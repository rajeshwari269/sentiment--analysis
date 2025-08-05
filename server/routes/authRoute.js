
const { Router } = require('express');
const { signup, signin, forgotPassword, resetPassword,userProfile,updateUserProfile,deleteAccount,  githubCallback } = require('../controllers/authController'); // your logic here
const {upload}=require("../middleware/multer")
const jwtmiddleware = require("../middleware/jwt");
const authRouter = Router();

// ======= GitHub OAuth =======

// Initiate GitHub OAuth
authRouter.get("/github", (req, res) => {
  console.log("GitHub OAuth initiation requested");
  const state = Math.random().toString(36).substring(2, 15);

  if (req.session) {
    req.session.oauthState = state;
  }

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}&` +
    `scope=user:email&` +
    `state=${state}`;

  console.log("Redirecting to GitHub:", githubAuthUrl);
  console.log("Callback URL:", process.env.GITHUB_CALLBACK_URL);
  res.redirect(githubAuthUrl);
});

// GET GitHub callback
authRouter.get("/callback", (req, res) => {
  console.log("GET /callback route hit with query:", req.query);
  githubCallback(req, res);
});

// POST GitHub callback (for frontend use)
authRouter.post("/callback", (req, res) => {
  console.log("POST /callback route hit with body:", req.body);
  handlePostCallback(req, res);
});

// Handler for POST GitHub callback
const handlePostCallback = async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ message: "No authorization code provided" });
    }

    const mockReq = {
      query: { code, state },
      session: req.session,
    };

    let redirectUrl = "";
    const mockRes = {
      redirect: (url) => {
        redirectUrl = url;
      },
      status: (code) => ({
        json: (data) => res.status(code).json(data),
      }),
      json: (data) => res.json(data),
    };

    await githubCallback(mockReq, mockRes);

    if (redirectUrl) {
      const url = new URL(redirectUrl);
      const token = url.searchParams.get("token");
      const error = url.searchParams.get("error");

      if (token) {
        return res.json({ token, message: "Authentication successful" });
      } else if (error) {
        return res.status(400).json({ message: error });
      }
    }

    return res.status(500).json({ message: "Authentication failed" });
  } catch (error) {
    console.error("POST callback error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ======= Swagger Test Route =======
authRouter.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({
    message: "Auth router is working!",
    env: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? "Set" : "Not set",
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? "Set" : "Not set",
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "Not set",
      CLIENT_URL: process.env.CLIENT_URL || "Not set",
    },
  });
});

// ======= Regular Auth Routes =======

authRouter.post("/signup", upload.single("profilePhoto"), signup);
authRouter.post("/signin", signin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/user-profile", userProfile);
authRouter.post("/user-profile-update", upload.single("profilePhoto"), updateUserProfile);

module.exports = authRouter;


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               profilePhoto:
 *               type: string
 *               format: binary
 *     responses:
 *       201:
 *         description: User created
 */


/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Successful login
 */


/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset link sent
 */


/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successful
 */




/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     summary: Delete the currently logged-in user's account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
authRouter.delete("/delete-account", jwtmiddleware, deleteAccount);


module.exports = authRouter;

