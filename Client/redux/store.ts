import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./features/userSlice";
import cartReducer from "./features/cartSlice"
export const store = configureStore({
  reducer: {
    user: userReducer ,
    cart:cartReducer
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
