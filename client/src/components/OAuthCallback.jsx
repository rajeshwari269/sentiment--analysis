import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const state = searchParams.get("state");
        const token = searchParams.get("token");

        if (error) {
          setError(`OAuth Error: ${error}`);
          setLoading(false);
          return;
        }

        // If we received a token directly from the redirect, use it
        if (token) {
          localStorage.setItem("token", token);
          
          // Get redirect URL or default to home
          const redirectUrl = localStorage.getItem("oauth_redirect") || "/";
          localStorage.removeItem("oauth_redirect");
          
          // Redirect to the intended page
          navigate(redirectUrl);
          return;
        }

        if (!code) {
          setError("No authorization code received");
          setLoading(false);
          return;
        }

        // If no token in URL, try to exchange code for token
        // This is a fallback in case the backend didn't include token in redirect
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            code,
            state 
          }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          // Store the JWT token
          localStorage.setItem("token", data.token);
          
          // Get redirect URL or default to home
          const redirectUrl = localStorage.getItem("oauth_redirect") || "/";
          localStorage.removeItem("oauth_redirect");
          
          // Redirect to the intended page
          navigate(redirectUrl);
        } else {
          setError(data.message || "Authentication failed");
          setLoading(false);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Network error during authentication");
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Completing GitHub Authentication...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please wait while we sign you in.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Failed
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default OAuthCallback;