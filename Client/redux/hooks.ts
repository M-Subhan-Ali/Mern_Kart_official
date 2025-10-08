import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

//  type version of useDispatch 
export const useAppDispatch: () => AppDispatch = useDispatch;

//  typed version of useSelector for typescript bro
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
