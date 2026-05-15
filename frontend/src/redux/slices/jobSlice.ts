import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PrintJob {
  _id: string;
  customerName: string;
  phone: string;
  fileUrl: string;
  fileName: string;
  copies: number;
  printType: 'Color' | 'B/W';
  status: 'Pending' | 'Printing' | 'Completed';
  notes?: string;
  createdAt: string;
}

interface JobState {
  jobs: PrintJob[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.loading = true;
    },
    fetchJobsSuccess: (state, action: PayloadAction<PrintJob[]>) => {
      state.loading = false;
      state.jobs = action.payload;
    },
    fetchJobsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addJob: (state, action: PayloadAction<PrintJob>) => {
      state.jobs.unshift(action.payload);
    },
    updateJobStatusLocal: (state, action: PayloadAction<{ id: string; status: PrintJob['status'] }>) => {
      const job = state.jobs.find((j) => j._id === action.payload.id);
      if (job) {
        job.status = action.payload.status;
      }
    },
    removeJobLocal: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((j) => j._id !== action.payload);
    },
  },
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure, addJob, updateJobStatusLocal, removeJobLocal } = jobSlice.actions;
export default jobSlice.reducer;
