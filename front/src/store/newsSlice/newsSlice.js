import { createSlice } from "@reduxjs/toolkit";
import { getNewsId } from "../../apirequests/apirequests";

const NewsSlice = createSlice({
  name: "newsSlice",
  initialState: {
    selectNewsData: null,
    dataNews: [],
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
   setSelectNewsData(state, action) {
     const { id } = action.payload;
     state.selectNewsData = id;
     getNewsId(id).then((response) => {
         if(response?.status === 200){
             state.dataNews = response.data
         }
     })
   }

   
  },
});

export const { setSelectNewsData } = NewsSlice.actions;

export default NewsSlice.reducer;
