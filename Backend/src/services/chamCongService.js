import db from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import {ROLES, TRANG_THAI_CHUYEN_CAN, GIO_VAO_CHUAN, GIO_RA_CHUAN, NGUONG_DI_MUON_PHUT, NGUONG_VE_SOM_PHUT} from '../config/constantConfig.js';

const ChamCong = db.ChamCong;
const NhanVien = db.NhanVien;
const ChucVu = db.ChucVu;
/**
 * Hàm nội bộ để xác định trạng thái chuyên cần (Đi muộn, Về sớm, Đúng giờ)
 * @param {string} gioVao Thực tế
 * @param {string} gioRa Thực tế
 * @returns {string} Trạng thái chuyên cần
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
    const diffRaPhut = gioRaChuan.diff(gioRaThucTe, 'minutes');
    if (diffRaPhut > NGUONG_VE_SOM_PHUT) {
        if (trangThai === TRANG_THAI_CHUYEN_CAN.DUNG_GIO) {
            trangThai = TRANG_THAI_CHUYEN_CAN.VE_SOM;
        }
    }

    return trangThai;
}
/**
 * Kiểm tra xem ca làm mới có bị chồng lấn với bất kỳ ca làm nào đã ghi nhận trong ngày không.
 * Giả định: Người dùng sẽ gửi cả gio_vao và gio_ra.
 */
export const checkOverlappingTime = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    // 2. Tìm các ca làm khác của nhân viên này trong cùng ngày
    const overlappingRecord = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam,
            // Logic kiểm tra chồng lấn
            [Op.and]: [
                { gio_vao: { [Op.lt]: gio_ra} }, 
                { gio_ra: { [Op.gt]: gio_vao } } 
            ]
        }
    });

    return !!overlappingRecord; 
};

// Ghi nhận ca làm mới (Check-in/Check-out)

export const createChamCongRecord = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    // Nếu có gio_ra, kiểm tra chồng lấn
    if (gio_ra) {
        const isOverlapping = await checkOverlappingTime(ma_nhan_vien, ngay_lam, gio_vao, gio_ra);
        if (isOverlapping) {
            throw new Error("Giờ làm đã ghi nhận bị chồng lấn.");
        }
    }
    
    // CẬP NHẬT: LƯU TRẠNG THÁI CHUYÊN CẦN BAN ĐẦU ⭐
    const initialStatus = gio_ra 
        ? tinhTrangThaiChuyenCan(gio_vao, gio_ra) 
        : TRANG_THAI_CHUYEN_CAN.DANG_LAM;

    // Ghi nhận vào DB
    return await ChamCong.create({
        ma_nhan_vien,
        ngay_lam,
        gio_vao,
        gio_ra,
        trang_thai_ca: initialStatus // Lưu trạng thái 
    });
};

export const updateGioRaAndCheckChuyenCan = async (ma_nhan_vien, ngay_lam, gio_ra) => {
    // 1. Tìm bản ghi Check-in chưa có gio_ra trong ngày hôm đó
    const record = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam,
            gio_ra: null // Tìm bản ghi chưa check-out
        }
    });

    if (!record) {
        throw new Error("Không tìm thấy bản ghi Check-in chưa kết thúc trong ngày.");
    }

    const gio_vao = record.gio_vao;

    // 2. Kiểm tra tính hợp lệ của giờ ra so với giờ vào
    const checkInTime = moment(gio_vao, 'HH:mm:ss');
    const checkOutTime = moment(gio_ra, 'HH:mm:ss');

    if (checkOutTime.isBefore(checkInTime)) {
        throw new Error("Giờ ra phải sau giờ vào.");
    }

    // 3. Tính toán trạng thái chuyên cần
    const trang_thai_moi = tinhTrangThaiChuyenCan(gio_vao, gio_ra);

    // 4. Cập nhật bản ghi
    await record.update({
        gio_ra,
        trang_thai_ca: trang_thai_moi
    });

    return record;
};

// Lấy lịch sử chấm công theo ngày/tháng

export const getChamCongByMaNv = async (ma_nhan_vien, thang, nam, userRole, currentUserId) => {
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
    
    return { records: records }; 
};
/**
 * ds trả về tổng sl nv theo trạng thái cc
 * @param {number} thang
 * @param {number} nam
 * @returns {Object} 
 */
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

    // 4. Chuyển đổi Set sang số đếm
    const globalEmployeeCounts = {};
    for (const [status, employeesSet] of Object.entries(uniqueEmployeesByStatus)) {
        globalEmployeeCounts[status] = employeesSet.size;
    }

    return globalEmployeeCounts;
};
// --- BỔ SUNG HÀM NÀY: Để vẽ biểu đồ Admin chính xác hơn ---
export const getThongKeBieuDo = async (thang, nam) => {
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    // Dùng SQL COUNT để đếm tổng số lượt (Shift) theo từng trạng thái
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

    // Format kết quả dễ dùng: { DungGio: 100, DiMuon: 15, VeSom: 5 }
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