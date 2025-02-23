import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, addDoctorAPI } from "@/services/apiQuestions";

// Thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { users } = await getUsers(); // Assuming API returns { users: [...] }
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const addDoctor = createAsyncThunk(
  "users/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await addDoctorAPI(doctorData); // Call your backend API
      return response.data; // Assuming the API returns the added doctor data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Optional reducer to clear users
    clearUsers(state) {
      state.users = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
