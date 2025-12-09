import db from "../models/index.js";

const normalizeCode = (value) => (typeof value === "string" ? value.trim().toUpperCase() : "");
const normalizeString = (value) => (typeof value === "string" ? value.trim() : value);
const isValidCode = (value) => /^[A-Za-z0-9]{1}$/.test(value || "");

export const listChucVus = async () =>
  db.ChucVu.findAll({
    order: [["ma_chuc_vu", "ASC"]], 
    raw: true,
  });

export const findChucVuByMa = async (maChucVu) =>
  db.ChucVu.findOne({
    where: { ma_chuc_vu: normalizeCode(maChucVu) }, 
    raw: true,
  });

export const createChucVu = async (payload = {}) => {
  const maChucVu = normalizeCode(payload.ma_chuc_vu || ""); 
  const exists = await db.ChucVu.findOne({ where: { ma_chuc_vu: maChucVu }, raw: true });
  
  if (exists) return { error: "Mã chức vụ đã tồn tại", status: 409 };
  if (!isValidCode(maChucVu)) return { error: "Mã chức vụ phải đúng 1 ký tự", status: 400 };

  const tenChucVu = normalizeString(payload.ten_chuc_vu || ""); 
  if (!maChucVu || !tenChucVu) return { error: "Thông tin không hợp lệ", status: 400 };

  const created = await db.ChucVu.create({
    ma_chuc_vu: maChucVu, 
    ten_chuc_vu: tenChucVu, 
  });
  return { data: created.get({ plain: true }) };
};

export const updateChucVu = async (maChucVu, updates) => {
  const record = await db.ChucVu.findByPk(normalizeCode(maChucVu));
  if (!record) return { error: "Chức vụ không tồn tại", status: 404 };
  
  const safeUpdates = { ...updates };
  delete safeUpdates.ma_chuc_vu; 

  if (safeUpdates.ten_chuc_vu !== undefined) {
    safeUpdates.ten_chuc_vu = normalizeString(safeUpdates.ten_chuc_vu || "");
  }
  
  await record.update(safeUpdates);
  const refreshed = await db.ChucVu.findByPk(record.ma_chuc_vu, { raw: true });
  return { data: refreshed };
};

export const deleteChucVu = async (maChucVu) => {
  const deleted = await db.ChucVu.destroy({ where: { ma_chuc_vu: normalizeCode(maChucVu) } });
  if (!deleted) return { error: "Chức vụ không tồn tại", status: 404 };
  return { data: true };
};