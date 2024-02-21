import { User } from "../../app/models/user";
import { createSlice } from "@reduxjs/toolkit";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers:{}
})