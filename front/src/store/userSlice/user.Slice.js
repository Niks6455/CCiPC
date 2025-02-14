import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setUserData } = UserSlice.actions;

export default UserSlice.reducer;
