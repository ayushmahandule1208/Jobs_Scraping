import mongoose from 'mongoose';

// Define the Job schema dynamically if not using a model file
const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', jobSchema, 'jobs'); // Explicitly set collection name

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from 'jobs' collection

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found',
      });
    }

    res.status(200).json({
      success: true,
      data: jobs,
      message: 'Jobs retrieved successfully',
    });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
