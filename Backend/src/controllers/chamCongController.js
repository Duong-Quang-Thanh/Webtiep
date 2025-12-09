import * as chamCongService from '../services/chamCongService.js';
import moment from 'moment';
import { ROLES } from '../config/constantConfig.js'; // Đảm bảo import ROLES

export const checkIn = async (req, res) => {
    let { ma_nhan_vien } = req.body;
    const { userRole, userId } = req; // Lấy từ Middleware xác thực (authMiddleware)

    // NẾU LÀ NHÂN VIÊN: Ép buộc ma_nhan_vien phải là ID của chính họ
    if (userRole === ROLES.NHAN_VIEN) {
        ma_nhan_vien = userId;
    }

    if (!ma_nhan_vien) {
        return res.status(400).send({ message: "Thiếu mã nhân viên." });
    }

    const ngay_lam = moment().format('YYYY-MM-DD');
    const gio_vao = moment().format('HH:mm:ss');

    try {
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien,
            ngay_lam,
            gio_vao,
            null
        );

        res.status(201).send({
            message: "Check-in thành công!",
            data: newRecord
        });

    } catch (error) {
        if (error.message.includes("đã check-in") || error.message.includes("chưa check-out")) {
            return res.status(400).send({ message: "❌ Bạn đã check-in trong ngày này rồi! Vui lòng check-out trước khi check-in lại." });
        }
        if (error.message.includes("chồng lấn") || error.message.includes("duplicate")) {
            return res.status(400).send({ message: "❌ Bạn đã Check-in rồi, không thể Check-in lại." });
        }
        res.status(500).send({ message: "Lỗi Check-in: " + error.message });
    }
};

/* ==========================
 *  CHECK-OUT (BẢO MẬT TƯƠNG TỰ)
 * ========================== */
export const checkOut = async (req, res) => {
    let { ma_nhan_vien } = req.body;
    const { userRole, userId } = req;

    // NẾU LÀ NHÂN VIÊN: Ép buộc ID
    if (userRole === ROLES.NHAN_VIEN) {
        ma_nhan_vien = userId;
    }

    if (!ma_nhan_vien) {
        return res.status(400).send({ message: "Thiếu mã nhân viên." });
    }

    const ngay_lam = moment().format('YYYY-MM-DD');
    const gio_ra = moment().format('HH:mm:ss');

    try {
        const updatedRecord = await chamCongService.updateGioRaAndCheckChuyenCan(
            ma_nhan_vien,
            ngay_lam,
            gio_ra
        );

        res.send({
            message: `Check-out thành công. Trạng thái: ${updatedRecord.trang_thai_ca}`,
            data: updatedRecord
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* ==========================
 *  LẤY DANH SÁCH (CHO QUẢN LÝ - CÓ FILTER)
 *  Hàm này đang thiếu trong code cũ của bạn
 * ========================== */
export const getDanhSach = async (req, res) => {
    try {
        // Lấy các tham số từ query string (Frontend gửi lên)
        const filters = {
            ma_phong: req.query.ma_phong,
            ngay: req.query.ngay,          // YYYY-MM-DD
            thang: req.query.thang,
            nam: req.query.nam,
            trang_thai_ca: req.query.trang_thai_ca
        };

        const data = await chamCongService.getDanhSachChamCongFilter(filters);

        res.status(200).send({
            message: "Lấy danh sách thành công",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Lỗi lấy danh sách chấm công: " + error.message });
    }
};

/* ==========================================
 *  HR TẠO CA HOÀN CHỈNH (ĐƯỢC PHÉP TRUYỀN GIỜ)
 * ========================================== */
export const createFullChamCong = async (req, res) => {
    const { ma_nhan_vien, ngay_lam, gio_vao, gio_ra } = req.body;

    if (!ma_nhan_vien || !gio_vao || !gio_ra) {
        return res.status(400).send({ message: "Thiếu thông tin bắt buộc." });
    }

    const ngayLamFinal = ngay_lam || moment().format('YYYY-MM-DD');

    if (moment(gio_vao, 'HH:mm:ss').isSameOrAfter(moment(gio_ra, 'HH:mm:ss'))) {
        return res.status(400).send({ message: "Giờ ra phải sau giờ vào." });
    }

    try {
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien,
            ngayLamFinal,
            gio_vao,
            gio_ra
        );

        res.status(201).send({
            message: `HR ghi nhận ca làm thành công! Trạng thái: ${newRecord.trang_thai_ca}`,
            data: newRecord
        });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi tạo ca làm: " + error.message });
    }
};


/* ==========================
 *  HISTORY theo tháng/năm
 * ========================== */
export const getHistory = async (req, res) => {
    const { ma_nv } = req.params;
    const { thang, nam } = req.query;

    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu tham số tháng và năm." });
    }

    try {
        const result = await chamCongService.getChamCongByMaNv(
            ma_nv,
            parseInt(thang),
            parseInt(nam),
            req.userRole,
            req.userId
        );

        if (result.error === 403) {
            return res.status(403).send({ message: result.message });
        }

        res.send({
            message: "Lấy lịch sử chấm công thành công.",
            data: result.records
        });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi lấy lịch sử chấm công: " + error.message });
    }
};


/* ==========================
 *  Summary báo cáo chuyên cần
 * ========================== */
export const getAll = async (req, res) => {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu tham số tháng và năm." });
    }

    try {
        const summary = await chamCongService.getAllChamCongSummary(
            parseInt(thang),
            parseInt(nam)
        );

        res.send({
            message: `Lấy báo cáo chuyên cần tháng ${thang}/${nam} thành công.`,
            data: summary
        });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi lấy báo cáo: " + error.message });
    }
};

/* ==========================
 *  UPDATE CHUYÊN CẦN (HR/Admin)
 * ========================== */
export const updateTrangThaiChuanCan = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai_ca } = req.body;

        if (!trang_thai_ca) {
            return res.status(400).send({ message: "Thiếu trạng thái chuyên cần." });
        }

        // Parse ID (format: ma_nhan_vien-ngay_lam hoặc id trực tiếp)
        let ma_nhan_vien, ngay_lam;
        
        if (id.includes('-')) {
            const [nv, date] = id.split('-');
            ma_nhan_vien = nv;
            ngay_lam = date;
        } else {
            // Nếu là ID số, cần tìm record trước
            const record = await chamCongService.getChamCongById(id);
            if (!record) {
                return res.status(404).send({ message: "Không tìm thấy bản ghi chấm công." });
            }
            ma_nhan_vien = record.ma_nhan_vien;
            ngay_lam = record.ngay_lam;
        }

        const result = await chamCongService.updateTrangThaiChuanCan(
            ma_nhan_vien,
            ngay_lam,
            trang_thai_ca
        );

        res.send({
            message: "Cập nhật chuyên cần thành công.",
            data: result
        });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật chuyên cần: " + error.message });
    }
};