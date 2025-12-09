import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js'; 

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: "🚫 Cần cung cấp Token để truy cập!" });
  }

  const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  jwt.verify(tokenValue, jwtConfig.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "🚫 Token không hợp lệ hoặc đã hết hạn!" });
    }
    req.userId = decoded.ma_nhan_vien; // ma_nhan_vien
    req.userRole = decoded.role; 
    next();
  });
};

export default verifyToken;