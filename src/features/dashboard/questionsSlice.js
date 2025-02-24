import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getQuestionsAPI,
  answerQuestionAPI,
  updateResponseAPI,
  deleteResponseAPI,
  deleteQuestionAPI,
} from "@/services/apiQuestions";

// Thunk to fetch questions
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async ({ type, page }, { rejectWithValue }) => {
    try {
      const { questions } = await getQuestionsAPI(type, page);
      return questions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk to answer a question
export const answerQuestion = createAsyncThunk(
  "questions/answerQuestion",
  async ({ id, response }, { rejectWithValue }) => {
    try {
      await answerQuestionAPI(id, response);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Thunk to update a response
export const updateResponse = createAsyncThunk(
  "questions/updateResponse",
  async ({ id, response }, { rejectWithValue }) => {
    try {
      const result = await updateResponseAPI(id, response);
      console.log(result);
      return result.question[0];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Thunk to delete a response
export const deleteResponse = createAsyncThunk(
  "questions/deleteResponse",
  async (id, { rejectWithValue }) => {
    try {
      await deleteResponseAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      console.log(id);
      await deleteQuestionAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    questions: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearQuestions(state) {
      state.questions = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchQuestions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // answerQuestion
      .addCase(answerQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id,
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      // updateResponse
      .addCase(updateResponse.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id,
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      // deleteResponse
      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q.id !== action.payload,
        );
      })
      // deleteQuestion
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q.id !== action.payload,
        );
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
