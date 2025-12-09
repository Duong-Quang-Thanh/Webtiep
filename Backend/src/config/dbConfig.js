import 'dotenv/config'; 

const dbConfig = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: 'tHanhduong231', 
    DB: "Web_qlnv",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default dbConfig;