// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, postLoginUser } from "@/services/apiQuestions";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, thisthing) => {
    console.log(credentials, thisthing);
    try {
      // 1. Get authentication token
      const { token } = await postLoginUser(credentials);

      // 2. Store token
      localStorage.setItem("token", token);

      // 3. Get user data using the new token
      const userData = await getUser();

      return userData;
    } catch (error) {
      console.log(error);
      return thisthing.rejectWithValue(error.message);
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
        console.log(state.status);
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loadingToken";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // userData from the chain
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
