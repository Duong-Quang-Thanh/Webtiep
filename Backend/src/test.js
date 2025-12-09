import bcrypt from 'bcryptjs'; 

const plainPassword = '123456';
const saltRounds = 10; 

bcrypt.hash(plainPassword, saltRounds)
    .then(hash => {
        console.log("Chuỗi Hash của mật khẩu:", hash);
        
    })
    .catch(err => console.error(err));