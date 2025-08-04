const { Router } = require("express");

const authRouter = Router();

const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  githubCallback,
} = require("../controllers/authController");

// Initiate GitHub OAuth
authRouter.get('/github', (req, res) => {
  console.log("GitHub OAuth initiation requested");
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in session if available
  if (req.session) {
    req.session.oauthState = state;
  }
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}&` +
    `scope=user:email&` +
    `state=${state}`;
  
  console.log("Redirecting to GitHub:", githubAuthUrl);
  console.log("Callback URL:", process.env.GITHUB_CALLBACK_URL);
  res.redirect(githubAuthUrl);
});

// Handle GitHub OAuth callback - THIS IS THE IMPORTANT FIX
// Your frontend expects /api/auth/callback, so we need both routes
authRouter.get('/callback', (req, res) => {
  console.log('GET /callback route hit with query:', req.query);
  githubCallback(req, res);
});

// Handle GitHub OAuth callback for POST requests from frontend
authRouter.post('/callback', (req, res) => {
  console.log('POST /callback route hit with body:', req.body);
  // For POST requests, we'll handle the code exchange manually
  handlePostCallback(req, res);
});

// New function to handle POST callback requests
const handlePostCallback = async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: "No authorization code provided" });
    }

    // Create a mock request object for githubCallback
    const mockReq = {
      query: { code, state },
      session: req.session
    };
    
    // Create a custom response object that captures the redirect
    let redirectUrl = '';
    const mockRes = {
      redirect: (url) => {
        redirectUrl = url;
      },
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      }),
      json: (data) => res.json(data)
    };

    // Call the existing githubCallback function
    await githubCallback(mockReq, mockRes);
    
    // If we got a redirect URL, extract the token and return it
    if (redirectUrl) {
      const url = new URL(redirectUrl);
      const token = url.searchParams.get('token');
      const error = url.searchParams.get('error');
      
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

// Test route
authRouter.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ 
    message: 'Auth router is working!',
    env: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'Not set',
      CLIENT_URL: process.env.CLIENT_URL || 'Not set'
    }
  });
});

// Regular auth routes
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
