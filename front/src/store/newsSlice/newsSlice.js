import { createSlice } from '@reduxjs/toolkit';

const NewsSlice = createSlice({
  name: 'newsSlice',
  initialState: {
    selectNewsData: null,
    dataNews: {},
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setSelectNewsData(state, action) {
      const { id } = action.payload;
      state.selectNewsData = id;
    },
    setDataNews(state, action) {
      const { data } = action.payload;
      state.dataNews = data;
    },
  },
});

export const { setSelectNewsData, setDataNews } = NewsSlice.actions;

export default NewsSlice.reducer;
