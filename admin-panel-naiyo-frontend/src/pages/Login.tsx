import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import apiBaseUrl from "../apiBaseUrl";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          remember_me: rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("authToken", data.token);
        storage.setItem("user", JSON.stringify(data.user));
        storage.setItem("isAuthenticated", "true");
        
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d1a",
        fontFamily: "'Jaldi', sans-serif",
        padding: "20px",
        overflow: "auto",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#1a1a2e",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #16162a 0%, #1a1a2e 100%)",
            padding: "40px 40px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#ffffff",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#0d0d1a",
                letterSpacing: "-1px",
              }}
            >
              N24
            </span>
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 8px 0",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
            }}
          >
            Sign in to Naiyo24 Admin Panel
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: "40px 40px" }}>
          {/* Error Alert */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                marginBottom: "24px",
              }}
            >
              <AlertCircle size={20} color="#ef4444" />
              <span style={{ fontSize: "14px", color: "#ef4444", fontWeight: "500" }}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={20}
                  color="#6b7280"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@naiyo24.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 48px",
                    fontSize: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                    background: "#0d0d1a",
                    color: "#ffffff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={20}
                  color="#6b7280"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 48px",
                    fontSize: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                    background: "#0d0d1a",
                    color: "#ffffff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "28px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#6366f1",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)" }}>
                  Remember me
                </span>
              </label>
              <a
                href="#"
                style={{
                  fontSize: "14px",
                  color: "#6366f1",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#818cf8")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6366f1")}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#ffffff",
                background: isLoading
                  ? "#4b5563"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                borderRadius: "12px",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.45)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(99, 102, 241, 0.35)";
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#ffffff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              margin: "28px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
            <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.4)", fontWeight: "500" }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
          </div>

          {/* Demo Credentials */}
          <div
            style={{
              background: "rgba(99, 102, 241, 0.08)",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0 0 8px 0",
                fontWeight: "600",
              }}
            >
              Admin Access
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", margin: 0, lineHeight: "1.5" }}>
              Use your registered admin credentials to sign in. Contact the system administrator if you need access.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 40px",
            background: "#0d0d1a",
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.4)", margin: 0 }}>
            © 2026 Naiyo24. All rights reserved.
          </p>
        </div>
      </div>

      {/* CSS Animation for Spinner */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
