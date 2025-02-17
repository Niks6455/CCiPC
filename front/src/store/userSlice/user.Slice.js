import { createSlice } from "@reduxjs/toolkit";
import { apiGetUserData } from "../../apirequests/apirequests";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      data: {},
    },
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setUserData(state, action) {
      const { data } = action.payload;
      state.user.data = data;
    },

    disGetDataUser(state, action) {
      const { data } = action.payload;
      state.user.data = data?.participant;
    },
  },
});

export const { setUserData, disGetDataUser } = UserSlice.actions;

export default UserSlice.reducer;
