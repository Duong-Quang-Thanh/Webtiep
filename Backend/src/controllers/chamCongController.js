import * as chamCongService from '../services/chamCongService.js';
import moment from 'moment';

/* ==========================
 *  CHECK-IN (Dùng giờ server)
 * ========================== */
export const checkIn = async (req, res) => {
    const { ma_nhan_vien } = req.body;

    if (!ma_nhan_vien) {
        return res.status(400).send({ message: "Thiếu mã nhân viên." });
    }

    const ngay_lam = moment().format('YYYY-MM-DD');
    const gio_vao = moment().format('HH:mm:ss'); // giờ thực server

    try {
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien,
            ngay_lam,
            gio_vao,
            null // Check-in ⇒ không có giờ ra
        );

        res.status(201).send({
            message: "Check-in thành công! Đang chờ Check-out.",
            data: newRecord
        });

    } catch (error) {
        if (error.message.includes("Bạn đã check-in rồi")) {
            return res.status(400).send({ message: "Bạn đã check-in và chưa check-out." });
        }
        res.status(500).send({ message: "Lỗi Check-in: " + error.message });
    }
};


/* ==========================
 *  CHECK-OUT (Dùng giờ server)
 * ========================== */
export const checkOut = async (req, res) => {
    const { ma_nhan_vien } = req.body;

    if (!ma_nhan_vien) {
        return res.status(400).send({ message: "Thiếu mã nhân viên." });
    }

    const ngay_lam = moment().format('YYYY-MM-DD');
    const gio_ra = moment().format('HH:mm:ss'); // giờ thực server

    try {
        const updatedRecord = await chamCongService.updateGioRaAndCheckChuyenCan(
            ma_nhan_vien,
            ngay_lam,
            gio_ra
        );

        res.send({
            message: `Check-out thành công. Trạng thái ca: ${updatedRecord.trang_thai_ca}`,
            data: updatedRecord
        });

    } catch (error) {
        if (error.message.includes("Không tìm thấy bản ghi Check-in")) {
            return res.status(404).send({ message: "Không có bản ghi Check-in cần Check-out." });
        }
        res.status(500).send({ message: "Lỗi Check-out: " + error.message });
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