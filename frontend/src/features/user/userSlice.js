// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUser,
  postLoginUser,
  postSignupUser,
} from "@/services/apiQuestions";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await getUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // 1. Get authentication token
      const { token, user: userData } = await postLoginUser(credentials);
      // 2. Store token
      localStorage.setItem("token", token);
      return userData;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  },
);
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { token, user: userData } = await postSignupUser(credentials);
      localStorage.setItem("token", token);
      return userData;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem("token");
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = "loadingUser";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        console.log(state.status);
        state.error = action.payload;
      })

      // loginUser
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loadingToken";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // userData from the chain
      })
      // signupUser
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
