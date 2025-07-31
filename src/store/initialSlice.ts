import { createSlice } from '@reduxjs/toolkit';

const initialSlice = createSlice({
  name: 'impactAnalysisBbSlice',
  initialState: { data: 'initial' },
  reducers: {
    select: (state, action) => {
      state.data = { ...state, ...action.payload };
    },
  },
});

const initialReducer = initialSlice.reducer;

export const { select } = initialSlice.actions;
export default initialReducer;
