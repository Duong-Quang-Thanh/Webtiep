import db from '../models/index.js';
import moment from 'moment';
import { GIO_LAM_CHUAN_THANG, HE_SO_LAM_THEM_GIO, ROLES } from '../config/constantConfig.js';
import { Op } from 'sequelize';

const ChamCong = db.ChamCong;
const BangLuong = db.BangLuong;
const NhanVien = db.NhanVien;

//  TÍNH TỔNG GIỜ LÀM
async function tongGioLam(ma_nhan_vien, thang, nam) {
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    const records = await ChamCong.findAll({
        where: {
            ma_nhan_vien,
            ngay_lam: { [Op.between]: [startDate, endDate] }
        },
        raw: true
    });

    let tongGio = 0;
    records.forEach(record => {
        const checkIn = moment(record.gio_vao, 'HH:mm:ss');
        const checkOut = moment(record.gio_ra, 'HH:mm:ss');

        if (checkOut.isValid() && checkIn.isValid() && checkOut.isAfter(checkIn)) {
            const duration = moment.duration(checkOut.diff(checkIn));
            tongGio += duration.asHours();
        }
    });

    return tongGio;
}
//  TÍNH LƯƠNG VÀ LƯU VÀO BẢNG
export const tinhToanVaLuuBangLuong = async (ma_nhan_vien, thang, nam) => {
    const nhanVien = await NhanVien.findByPk(ma_nhan_vien);
    if (!nhanVien) throw new Error('Nhân viên không tồn tại.');

    const luongCoBanThang = parseFloat(nhanVien.muc_luong_co_ban);
    const tong_gio_lam = await tongGioLam(ma_nhan_vien, thang, nam);

    let luongThemGio = 0;
    let tongLuong = 0;
    let gioLamThem = 0;

    const luongCoBanTheoGio = luongCoBanThang / GIO_LAM_CHUAN_THANG;
    if (tong_gio_lam === 0) {
        tongLuong = 0;
    } 
    else if (tong_gio_lam < GIO_LAM_CHUAN_THANG) {
        tongLuong = luongCoBanTheoGio * tong_gio_lam;
    } 
    else if (tong_gio_lam === GIO_LAM_CHUAN_THANG) {
        tongLuong = luongCoBanThang;
    } 
    else {
        gioLamThem = tong_gio_lam - GIO_LAM_CHUAN_THANG;
        luongThemGio = gioLamThem * luongCoBanTheoGio * HE_SO_LAM_THEM_GIO;
        tongLuong = luongCoBanThang + luongThemGio;
    }

   
    // CẬP NHẬT/ TẠO MỚI LƯƠNG
   
    const [bangLuong, created] = await BangLuong.findOrCreate({
        where: { ma_nhan_vien, thang, nam },
        defaults: {
            ma_nhan_vien, thang, nam,
            tong_gio_lam: tong_gio_lam.toFixed(2),
            luong_co_ban: luongCoBanThang.toFixed(2),
            luong_them_gio: luongThemGio.toFixed(2),
            tong_luong: tongLuong.toFixed(2)
        }
    });

    if (!created) {
        await bangLuong.update({
            tong_gio_lam: tong_gio_lam.toFixed(2),
            luong_them_gio: luongThemGio.toFixed(2),
            tong_luong: tongLuong.toFixed(2)
        });
    }

    return bangLuong;
};

//  THỐNG KÊ THU NHẬP NĂM
export const getThongKeNam = async (ma_nhan_vien, nam, userRole, currentUserId) => {
    if (userRole === ROLES.NHAN_VIEN && ma_nhan_vien !== currentUserId) {
        return { error: 403, message: "Bạn không có quyền xem thống kê thu nhập của nhân viên khác." };
    }

    const thongKe = await BangLuong.findAll({
        where: { ma_nhan_vien, nam },
        attributes: ['thang', 'luong_co_ban', 'tong_luong', 'luong_them_gio'],
        order: [['thang', 'ASC']],
        raw: true
    });

    const tongThuNhapNam = thongKe.reduce((sum, item) => sum + parseFloat(item.tong_luong), 0);

    return {
        tong_thu_nhap_nam: tongThuNhapNam.toFixed(2),
        chi_tiet_theo_thang: thongKe
    };
};
