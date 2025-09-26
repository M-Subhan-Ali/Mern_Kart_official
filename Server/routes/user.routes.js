import { Router } from "express";
import { privateRoute } from "../middlewares/authmiddleware.js";
import { getUserInfo, userLogin } from "../Controllers/user.Controller.js";

const route = Router();

route.get("/userInfo", privateRoute, userLogin);
route.get("/getUserInfo", privateRoute, getUserInfo);

export { route as UserRouter };
