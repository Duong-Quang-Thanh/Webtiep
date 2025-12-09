import db from '../models/index.js';
import {ROLES} from '../config/constantConfig.js'

/**
 * @param {Array<string>} allowedRoles 
 */

const authorize = (allowedRoles) => (req, res, next) => {
  const userRole = req.userRole 
  const currentUserId = req.userId // Mã nhân viên của người dùng hiện tại
  const requestedId = req.params.ma_nhan_vien || req.params.id
  
  // -- logic phan quyen --
  if (allowedRoles.includes(userRole)) {
    next(); 
    return;
  }
  
  if (allowedRoles.includes(ROLES.NHAN_VIEN)) {
    if (requestedId) {
      if (currentUserId === requestedId) {
        next()
        return 
      }
    }else {
      // tu choi khong co y/c id
    }
  }

  // Trường hợp không có quyền
  res.status(403).send({ 
      message: " Bạn không có quyền truy cập vào chức năng này.",
      required_roles: allowedRoles 
  })
}

export default authorize