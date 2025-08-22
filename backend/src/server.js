import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { purchasesRouter } from './routes/purchases.js';
import { transfersRouter } from './routes/Transfers.js';
import { assignmentsRouter } from './routes/assignments.js';
import { dashboardRouter } from './routes/dashboard.js';
import { masterRouter } from './routes/master.js';
import { logMiddleware } from './utils/logging.js';

import { connectDB } from "./db.js";
connectDB();

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.options('*', cors()); 

app.use(express.json());
app.use(morgan('combined'));
app.use(logMiddleware);

app.get('/health', (req,res)=>res.json({ok:true, time:new Date().toISOString()}));

app.use('/api/auth', authRouter);
app.use('/api/master', masterRouter); // bases, equipment types
app.use('/api/purchases', purchasesRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/dashboard', dashboardRouter);

const port = process.env.PORT || 8080;
app.listen(port, ()=>{
  console.log(`MAMS backend listening on :${port}`);
});
