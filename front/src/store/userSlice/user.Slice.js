import { createSlice } from "@reduxjs/toolkit";
import { apiGetUserData } from "../../apirequests/apirequests";

const getDataUser = () => {
  apiGetUserData().then((res) => {
    console.log("res", res);
    if (res?.status === 200) {
      return res.data;
    } else {
      return null;
    }
  });
};

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

    disGetDataUser(state) {
      state.user.data = getDataUser();
    },
  },
});

export const { setUserData, disGetDataUser } = UserSlice.actions;

export default UserSlice.reducer;
