import 'dotenv/config'; 

const dbConfig = {
    HOST: "localhost",
    USER: "root",
    PORT: 1301,
    PASSWORD: '123456', 
    DB: "qlnv",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default dbConfig;