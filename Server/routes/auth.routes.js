import { Router } from "express";
import { Login, Logout, SignUp } from "../Controllers/auth.Controller.js";
import { userLogin } from "../Controllers/user.Controller.js";
import { privateRoute } from "../middlewares/authmiddleware.js";

const route = Router();

route.post("/signUp", SignUp);
route.post("/Login", Login);
route.post("/logout", Logout);

export { route as AuthRouter };
