import {registerUser,loginUser,LogOutUser} from "../controllers/authController.js"
import isAuth from "../Middlewares/isAuth.js";

const router=express.router();

router.post("/register",registerUser);
router.get("/login",loginUser);
router.get("/logout",isAuth,LogOutUser);

export default router;