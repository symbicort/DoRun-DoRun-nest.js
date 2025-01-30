import { createAsyncThunk } from "@reduxjs/toolkit";
import { conversationAPI } from "../../../api/type/conversation";

export const fetchConversation = createAsyncThunk('conversation/fetchConversation', async ({ id } : {id : string}, {rejectWithValue}) => {
    try{
        return await conversationAPI({ id })
    }catch(error){
        return rejectWithValue('대화 데이터를 가져오는 도중 오류가 발생했습니다.')
    }

})