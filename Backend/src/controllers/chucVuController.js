import {
  listChucVus,
  findChucVuByMa,
  createChucVu,
  updateChucVu,
  deleteChucVu,
} from "../services/chucVuService.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await listChucVus();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const record = await findChucVuByMa(req.params.ma_chuc_vu);
    if (!record) {
      return res.status(404).json({ message: "Chức vụ không tồn tại" });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { data, error, status } = await createChucVu(req.body);
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { data, error, status } = await updateChucVu(
      req.params.ma_chuc_vu,
      req.body
    );
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { error, status } = await deleteChucVu(req.params.ma_chuc_vu);
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};