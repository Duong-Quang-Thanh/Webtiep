import * as luongService from '../services/luongService.js';
import db from '../models/index.js';

export const tinhLuongThang = async (req, res) => {
    const { ma_nhan_vien, thang, nam, ma_phong, ma_chuc_vu } = req.body; 

    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu thông tin (thang, nam)." });
    }
    try {
        // CASE 1: Tính cho 1 cá nhân (Giữ nguyên)
        if (ma_nhan_vien) {
            const result = await luongService.tinhToanVaLuuBangLuong(ma_nhan_vien, thang, nam);
            return res.send({ 
                message: `Tính lương thành công cho NV ${ma_nhan_vien}.`,
                data: result
            });
        }

        // CASE 2: Tính cho NHIỀU NGƯỜI (Batch - Phòng ban/Chức vụ)
        const whereCondition = { trang_thai: 'DangLam' }; // Hoặc 'HoatDong' tuỳ convention DB của bạn
        if (ma_phong) whereCondition.ma_phong = ma_phong;
        if (ma_chuc_vu) whereCondition.ma_chuc_vu = ma_chuc_vu;

        // [FIX 1] Lấy thêm 'ten_nhan_vien' để Frontend hiển thị
        const listNV = await db.NhanVien.findAll({
            where: whereCondition,
            attributes: ['ma_nhan_vien', 'ten_nhan_vien'] 
        });

        let successCount = 0;
        const results = []; // [FIX 2] Mảng chứa kết quả trả về

        for (const nv of listNV) {
            try {
                // Service tính toán và lưu DB
                const luong = await luongService.tinhToanVaLuuBangLuong(nv.ma_nhan_vien, thang, nam);
                successCount++;
                
                // [FIX 3] Đẩy dữ liệu vào mảng kết quả
                results.push({
                    ma_nhan_vien: nv.ma_nhan_vien,
                    ten_nhan_vien: nv.ten_nhan_vien,
                    tong_luong: luong.tong_luong // Lấy từ kết quả service trả về
                });
            } catch (e) { 
                console.warn(`Lỗi tính lương NV ${nv.ma_nhan_vien}:`, e.message); 
            }
        }

        // [FIX 4] Trả về data dạng mảng và cờ isBatch
        res.send({ 
            message: `Hoàn tất! Đã tính lương cho ${successCount} nhân viên.`,
            data: results, 
            isBatch: true 
        });

    } catch (error) {
        res.status(500).send({ message: "Lỗi hệ thống: " + error.message });
    }
};

// ... (Giữ nguyên phần thongKeThuNhapNam)
export const thongKeThuNhapNam = async (req, res) => {
    // ... Code cũ giữ nguyên
    const { ma_nv, nam } = req.params;
    const userRole = req.userRole; 
    const currentUserId = req.userId; 

    try {
        const result = await luongService.getThongKeNam(ma_nv, nam, userRole, currentUserId);
        if (result.error === 403) {
             return res.status(403).send({ message: result.message });
        }
        if (result.chi_tiet_theo_thang.length === 0) {
            return res.status(404).send({ message: "Không tìm thấy dữ liệu lương trong năm này." });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi thống kê thu nhập: " + error.message });
    }
};