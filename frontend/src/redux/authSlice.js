import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser:(state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state, action) => {
            state.userProfile = action.payload;
        },
        setSelestedUser:(state, action) => {
            state.selectedUser = action.payload;
        }
    }
});
export const {setAuthUser, setSuggestedUsers, setUserProfile, setSelestedUser} = authSlice.actions;
export default authSlice.reducer;