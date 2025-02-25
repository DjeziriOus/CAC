import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import questionReducer from "./features/questions/questionSlice";
// import usersReducer from "./features/dashboard/usersSlice";
import questionsReducer from "./features/dashboard/questionsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer,
    // users: usersReducer,
    questions: questionsReducer,
  },
});

export default store;
