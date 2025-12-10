import db from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import {
    TRANG_THAI_CHUYEN_CAN,
    GIO_VAO_CHUAN,
    GIO_RA_CHUAN,
    NGUONG_DI_MUON_PHUT,
    NGUONG_VE_SOM_PHUT,
    ROLES
} from '../config/constantConfig.js';

const ChamCong = db.ChamCong;
const NhanVien = db.NhanVien;
const PhongBan = db.PhongBan;
const ChucVu = db.ChucVu;

/* ==========================================================================
 *  HELPER FUNCTIONS (Hàm phụ trợ nội bộ)
 * ========================================================================== */

/**
 * Tính trạng thái chuyên cần (Đi muộn, Về sớm, Đúng giờ)
 */
function tinhTrangThaiChuyenCan(gioVao, gioRa) {
    const gioVaoThucTe = moment(gioVao, 'HH:mm:ss');
    const gioRaThucTe = moment(gioRa, 'HH:mm:ss');

    const gioVaoChuan = moment(GIO_VAO_CHUAN, 'HH:mm:ss');
    const gioRaChuan = moment(GIO_RA_CHUAN, 'HH:mm:ss');

    let trangThai = TRANG_THAI_CHUYEN_CAN.DUNG_GIO;

    // 1. Kiểm tra Đi muộn
    const diffVaoPhut = gioVaoThucTe.diff(gioVaoChuan, 'minutes');
    if (diffVaoPhut > NGUONG_DI_MUON_PHUT) {
        trangThai = TRANG_THAI_CHUYEN_CAN.DI_MUON;
    }

    // 2. Kiểm tra Về sớm
    // Lưu ý: Nếu đã đi muộn thì ưu tiên trạng thái Đi muộn (hoặc tùy logic cty có thể lưu cả 2)
    // Ở đây giả sử ưu tiên trạng thái tệ nhất hoặc ghi đè nếu về sớm
    const diffRaPhut = gioRaChuan.diff(gioRaThucTe, 'minutes');
    if (diffRaPhut > NGUONG_VE_SOM_PHUT) {
        // Nếu trước đó là đúng giờ thì mới đổi thành về sớm
        // Nếu đã đi muộn, có thể giữ nguyên hoặc xử lý logic "Đi muộn & Về sớm" tùy nhu cầu
        if (trangThai === TRANG_THAI_CHUYEN_CAN.DUNG_GIO) {
            trangThai = TRANG_THAI_CHUYEN_CAN.VE_SOM;
        }
    }

    return trangThai;
}

/**
 * Kiểm tra chồng lấn thời gian ca làm
 */
export const checkOverlappingTime = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    const overlappingRecord = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam,
            [Op.and]: [
                { gio_vao: { [Op.lt]: gio_ra } },
                { gio_ra: { [Op.gt]: gio_vao } }
            ]
        }
    });
    return !!overlappingRecord;
};


/* ==========================================================================
 *  CORE SERVICE FUNCTIONS (Các hàm chính)
 * ========================================================================== */

// 1. Tạo bản ghi chấm công (Check-in hoặc tạo mới bởi HR)
export const createChamCongRecord = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    // Nếu có gio_ra, kiểm tra chồng lấn
    if (gio_ra) {
        const isOverlapping = await checkOverlappingTime(ma_nhan_vien, ngay_lam, gio_vao, gio_ra);
        if (isOverlapping) {
            throw new Error("Giờ làm đã ghi nhận bị chồng lấn.");
        }
    } else {
        // Nếu chỉ Check-in (chưa có giờ ra), kiểm tra xem đã check-in chưa
        const existingCheckIn = await ChamCong.findOne({
            where: {
                ma_nhan_vien,
                ngay_lam,
                gio_ra: null
            }
        });
        if (existingCheckIn) {
            throw new Error("Bạn đã check-in rồi và chưa check-out.");
        }
    }

    // Tính trạng thái ban đầu
    const initialStatus = gio_ra
        ? tinhTrangThaiChuyenCan(gio_vao, gio_ra)
        : TRANG_THAI_CHUYEN_CAN.DANG_LAM;

    return await ChamCong.create({
        ma_nhan_vien,
        ngay_lam,
        gio_vao,
        gio_ra, // check-in thì cái này null
        trang_thai_ca: initialStatus
    });
};

// 2. Cập nhật giờ ra (Check-out)
export const updateGioRaAndCheckChuyenCan = async (ma_nhan_vien, ngay_lam, gio_ra) => {
    const record = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam,
            gio_ra: null
        }
    });

    if (!record) {
        throw new Error("Không tìm thấy bản ghi Check-in chưa kết thúc trong ngày.");
    }

    const gio_vao = record.gio_vao;
    const checkInTime = moment(gio_vao, 'HH:mm:ss');
    const checkOutTime = moment(gio_ra, 'HH:mm:ss');

    if (checkOutTime.isBefore(checkInTime)) {
        throw new Error("Giờ ra phải sau giờ vào.");
    }

    const trang_thai_moi = tinhTrangThaiChuyenCan(gio_vao, gio_ra);

    await record.update({
        gio_ra,
        trang_thai_ca: trang_thai_moi
    });

    return record;
};

// 3. Lấy danh sách chấm công CÓ BỘ LỌC (Cho trang Quản lý/HR) - với tính toán giờ làm
export const getDanhSachChamCongFilter = async (filters) => {
    const { ma_phong, ngay, thang, nam, trang_thai_ca } = filters;

    // A. Điều kiện lọc bảng ChamCong
    const whereCondition = {};

    if (ngay) {
        whereCondition.ngay_lam = ngay;
    } else if (thang && nam) {
        const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
        const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');
        whereCondition.ngay_lam = {
            [Op.between]: [startDate, endDate]
        };
    }

    if (trang_thai_ca) {
        whereCondition.trang_thai_ca = trang_thai_ca;
    }

    // B. Điều kiện include (Join bảng NhanVien -> PhongBan, ChucVu)
    const nhanVienInclude = {
        model: NhanVien,
        as: 'nhanVien',
        attributes: ['ma_nhan_vien', 'ten_nhan_vien'],
        include: [
            {
                model: PhongBan,
                as: 'phongBan',
                attributes: ['ma_phong', 'ten_phong']
            },
            {
                model: ChucVu,
                as: 'chucVu',
                attributes: ['ten_chuc_vu']
            }
        ]
    };

    // Nếu lọc theo phòng ban, thêm điều kiện vào bảng NhanVien
    if (ma_phong) {
        nhanVienInclude.where = { ma_phong: ma_phong };
    }

    // C. Truy vấn
    const records = await ChamCong.findAll({
        where: whereCondition,
        include: [nhanVienInclude],
        order: [['ngay_lam', 'DESC'], ['gio_vao', 'ASC']]
    });

    // D. Tính toán giờ làm và flatten dữ liệu
    const recordsWithHours = records.map(record => {
        let tongGioLam = 0;

        if (record.gio_vao && record.gio_ra) {
            const checkIn = moment(record.gio_vao, 'HH:mm:ss');
            const checkOut = moment(record.gio_ra, 'HH:mm:ss');

            if (checkOut.isValid() && checkIn.isValid() && checkOut.isAfter(checkIn)) {
                const duration = moment.duration(checkOut.diff(checkIn));
                tongGioLam = parseFloat(duration.asHours().toFixed(2));
            }
        }

        const recordJSON = record.toJSON();
        
        return {
            ...recordJSON,
            ma_nhan_vien: recordJSON.nhanVien?.ma_nhan_vien || '',
            ten_nhan_vien: recordJSON.nhanVien?.ten_nhan_vien || '',
            ten_phong: recordJSON.nhanVien?.phongBan?.ten_phong || '-',
            ma_phong: recordJSON.nhanVien?.phongBan?.ma_phong || '',
            ten_chuc_vu: recordJSON.nhanVien?.chucVu?.ten_chuc_vu || '',
            tong_gio_lam: tongGioLam
        };
    });

    return recordsWithHours;
};

// 4. Lấy lịch sử chấm công cá nhân (với tính toán giờ làm)
export const getChamCongByMaNv = async (ma_nhan_vien, thang, nam, userRole, currentUserId) => {
    // Bảo mật: Nhân viên chỉ xem được của mình
    if (userRole === ROLES.NHAN_VIEN && ma_nhan_vien !== currentUserId) {
        return {
            error: 403,
            message: "Bạn không có quyền xem lịch sử chấm công của nhân viên khác."
        };
    }

    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    const records = await ChamCong.findAll({
        where: {
            ma_nhan_vien,
            ngay_lam: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [['ngay_lam', 'ASC']]
    });

    // Tính toán giờ làm cho mỗi bản ghi
    const recordsWithHours = records.map(record => {
        let tongGioLam = 0;

        if (record.gio_vao && record.gio_ra) {
            const checkIn = moment(record.gio_vao, 'HH:mm:ss');
            const checkOut = moment(record.gio_ra, 'HH:mm:ss');

            if (checkOut.isValid() && checkIn.isValid() && checkOut.isAfter(checkIn)) {
                const duration = moment.duration(checkOut.diff(checkIn));
                tongGioLam = parseFloat(duration.asHours().toFixed(2));
            }
        }

        return {
            ...record.toJSON(),
            tong_gio_lam: tongGioLam
        };
    });

    return { records: recordsWithHours };
};

// 5. Lấy Summary (Đếm số lượng nhân viên theo trạng thái) - Dùng cho Dashboard đơn giản
export const getAllChamCongSummary = async (thang, nam) => {
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    const records = await ChamCong.findAll({
        attributes: ['ma_nhan_vien', 'trang_thai_ca'],
        where: {
            ngay_lam: {
                [Op.between]: [startDate, endDate]
            }
        },
        raw: true
    });

    const uniqueEmployeesByStatus = {
        [TRANG_THAI_CHUYEN_CAN.DUNG_GIO]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.DI_MUON]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.VE_SOM]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.NGHI_PHEP]: new Set(),
    };

    records.forEach(record => {
        const maNv = record.ma_nhan_vien;
        const trangThai = record.trang_thai_ca;
        if (uniqueEmployeesByStatus[trangThai]) {
            uniqueEmployeesByStatus[trangThai].add(maNv);
        }
    });

    const globalEmployeeCounts = {};
    for (const [status, employeesSet] of Object.entries(uniqueEmployeesByStatus)) {
        globalEmployeeCounts[status] = employeesSet.size;
    }

    return globalEmployeeCounts;
};

// 6. Lấy thống kê biểu đồ (Đếm tổng lượt check-in theo trạng thái)
export const getThongKeBieuDo = async (thang, nam) => {
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    const stats = await ChamCong.findAll({
        attributes: [
            'trang_thai_ca',
            [db.sequelize.fn('COUNT', db.sequelize.col('trang_thai_ca')), 'so_luong']
        ],
        where: {
            ngay_lam: {
                [Op.between]: [startDate, endDate]
            }
        },
        group: ['trang_thai_ca'],
        raw: true
    });

    const result = {
        [TRANG_THAI_CHUYEN_CAN.DUNG_GIO]: 0,
        [TRANG_THAI_CHUYEN_CAN.DI_MUON]: 0,
        [TRANG_THAI_CHUYEN_CAN.VE_SOM]: 0,
        [TRANG_THAI_CHUYEN_CAN.NGHI_PHEP]: 0
    };

    stats.forEach(item => {
        if (result.hasOwnProperty(item.trang_thai_ca)) {
            result[item.trang_thai_ca] = parseInt(item.so_luong);
        }
    });

    return result;
};

// 7. Cập nhật trạng thái chuyên cần (HR/Admin)
export const updateTrangThaiChuanCan = async (ma_nhan_vien, ngay_lam, trang_thai_ca) => {
    const record = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam
        }
    });

    if (!record) {
        throw new Error('Không tìm thấy bản ghi chấm công.');
    }

    record.trang_thai_ca = trang_thai_ca;
    await record.save();

    return record;
};

// 8. Lấy bản ghi chấm công theo ID
export const getChamCongById = async (id) => {
    return await ChamCong.findByPk(id);
};