// File: features/question/questionSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addQuestion as apiAddQuestion } from "@/services/apiQuestions";

// Thunk for adding a question
export const addQuestion = createAsyncThunk(
  "question/addQuestion",
  async ({ object, content }, { rejectWithValue }) => {
    try {
      // Call the API function to add a question
      console.log(object, content);
      const data = await apiAddQuestion({ object, content });
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  questions: [],
  status: "idle",
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    // You can add additional synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally, push the newly added question into the questions array
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default questionSlice.reducer;
