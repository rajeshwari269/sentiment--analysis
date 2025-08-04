const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const signup = async (req, res) => {
  console.log("Signup request received:", req.body);

  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.Jwt_USER_SECRET,
      { expiresIn: '1h' }
    );

    console.log("User created successfully:", user.email);

    return res.status(201).json({
      message: "You are signed up",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });

  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ message: "signup failed", error: e.message });
  }
};

const signin = async (req, res) => {
  console.log("Signin request received:", req.body);

  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.Jwt_USER_SECRET,
      { expiresIn: '1h' }
    );

    console.log("User authenticated:", user.email);

    return res.json({ token });

  } catch (e) {
    console.error("Signin error:", e);
    return res.status(500).json({ message: "internal error" });
  }
};


// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create a reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '15m' }
    );

    // Reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return res.json({ message: 'Reset link sent successfully', resetLink });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


// Reset Password

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// GitHub OAuth Callback
const githubCallback = async (req, res) => {
  try {
    console.log("GitHub callback received:", req.query);
    
    const { code, state, error } = req.query;
    
    // Handle OAuth errors
    if (error) {
      console.error("GitHub OAuth error:", error);
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=${encodeURIComponent(error)}`);
    }
    
    // Verify state parameter to prevent CSRF attacks (if session is available)
    if (req.session && req.session.oauthState && state !== req.session.oauthState) {
      console.error("Invalid OAuth state");
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=invalid_state`);
    }
    
    if (!code) {
      console.error("No authorization code received");
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const { access_token, error: token_error } = tokenResponse.data;
    
    if (token_error || !access_token) {
      console.error("Token exchange error:", token_error);
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=token_exchange_failed`);
    }

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const githubUser = userResponse.data;
    
    // Get user's email (GitHub API might not return email in user object)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    const emails = emailResponse.data;
    const primaryEmail = emails.find(email => email.primary)?.email || githubUser.email;
    
    if (!primaryEmail) {
      console.error("No email found for GitHub user");
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=no_email`);
    }

    // Check if user already exists
    let user = await userModel.findOne({
      $or: [
        { email: primaryEmail },
        { githubId: githubUser.id.toString() }
      ]
    });

    if (user) {
      // User exists, update GitHub info if needed
      if (!user.githubId) {
        user.githubId = githubUser.id.toString();
        user.accountType = user.password ? 'hybrid' : 'github';
        user.githubProfile = {
          username: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          name: githubUser.name,
          bio: githubUser.bio,
          location: githubUser.location,
          company: githubUser.company,
          publicRepos: githubUser.public_repos,
          followers: githubUser.followers,
          following: githubUser.following,
          profileUrl: githubUser.html_url
        };
        await user.save();
      }
    } else {
      // Create new user
      const names = githubUser.name ? githubUser.name.split(' ') : [githubUser.login, ''];
      user = await userModel.create({
        firstname: names[0] || githubUser.login,
        lastname: names.slice(1).join(' ') || '',
        email: primaryEmail,
        githubId: githubUser.id.toString(),
        accountType: 'github',
        isEmailVerified: true, // GitHub emails are verified
        registrationSource: 'github',
        githubProfile: {
          username: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          name: githubUser.name,
          bio: githubUser.bio,
          location: githubUser.location,
          company: githubUser.company,
          publicRepos: githubUser.public_repos,
          followers: githubUser.followers,
          following: githubUser.following,
          profileUrl: githubUser.html_url
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.Jwt_USER_SECRET,
      { expiresIn: '1h' }
    );

    console.log("GitHub OAuth successful for user:", user.email);
    
    // Clear the OAuth state from session if it exists
    if (req.session && req.session.oauthState) {
      delete req.session.oauthState;
    }
    
    // Redirect to frontend OAuth callback page with token
    return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?code=${code}&state=${state}&token=${token}`);

  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=server_error`);
  }
};



module.exports = { signup, signin, forgotPassword, resetPassword, githubCallback };
