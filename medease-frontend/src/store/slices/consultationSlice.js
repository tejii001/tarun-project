import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { consultationService } from '../../services';

// Async thunks
export const fetchConsultations = createAsyncThunk(
  'consultations/fetchConsultations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await consultationService.getConsultations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch consultations');
    }
  }
);

export const startConsultation = createAsyncThunk(
  'consultations/startConsultation',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await consultationService.startConsultation(appointmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start consultation');
    }
  }
);

export const endConsultation = createAsyncThunk(
  'consultations/endConsultation',
  async (consultationId, { rejectWithValue }) => {
    try {
      const response = await consultationService.endConsultation(consultationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to end consultation');
    }
  }
);

const initialState = {
  consultations: [],
  currentConsultation: null,
  loading: false,
  error: null,
  messages: [],
};

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentConsultation: (state, action) => {
      state.currentConsultation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch consultations
      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start consultation
      .addCase(startConsultation.fulfilled, (state, action) => {
        state.currentConsultation = action.payload;
      })
      // End consultation
      .addCase(endConsultation.fulfilled, (state, action) => {
        const index = state.consultations.findIndex(cons => cons.id === action.payload.id);
        if (index !== -1) {
          state.consultations[index] = action.payload;
        }
        if (state.currentConsultation?.id === action.payload.id) {
          state.currentConsultation = null;
        }
      });
  },
});

export const { addMessage, clearMessages, setCurrentConsultation, clearError } = consultationSlice.actions;
export default consultationSlice.reducer;
