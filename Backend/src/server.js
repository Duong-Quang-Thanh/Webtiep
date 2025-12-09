import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import db from './models/index.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api', routes);

db.sequelize.sync({alter: true})
    .then(() => {
        console.log("Database synced successfully."); 

        app.listen(PORT, () => {
            console.log('Employee Management System started!');
        });
    })
    .catch(err => {
        console.error("Failed to sync database:", err.message);
    });

export default app;