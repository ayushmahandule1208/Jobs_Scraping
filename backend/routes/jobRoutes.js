import express from 'express';
import { getAllJobs } from '../controllers/jobController.js';

const router = express.Router();

router.get('/jobs', getAllJobs); // API endpoint to fetch all jobs

export default router;
