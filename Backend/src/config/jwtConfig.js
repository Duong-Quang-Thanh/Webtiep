import 'dotenv/config'; 

const jwtConfig = {
    SECRET: process.env.JWT_SECRET || 'fallback-secret-for-dev', 
    EXPIRATION: '1d' 
};

export default jwtConfig;