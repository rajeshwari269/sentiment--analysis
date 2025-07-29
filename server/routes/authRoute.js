const { Router } = require('express');
const { signup, signin, forgotPassword, resetPassword,userProfile,updateUserProfile } = require('../controllers/authController'); // your logic here
const {upload}=require("../middleware/multer")
const authRouter = Router();

authRouter.post('/signup',upload.single("profilePhoto") ,signup);
authRouter.post('/signin', signin);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post("/user-profile",userProfile)
authRouter.post("/user-profile-update",upload.single("profilePhoto"),updateUserProfile)
module.exports = authRouter;
