import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        username: null,
        money: null
    },
    reducers: {
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
        updateMoney: (state, action) => {
            state.money = action.payload;
        }
    }
})

export const {updateUsername, updateMoney} = userSlice.actions;

export default userSlice.reducer;