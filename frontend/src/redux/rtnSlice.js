import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification:[],
    },
    reducers: {
        setlikeNotification: (state,action) => {
            if(action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            }
            else if(action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
            }
        }
    }
});

export const {setlikeNotification} = rtnSlice.actions;
export default rtnSlice.reducer;