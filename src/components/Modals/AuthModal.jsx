import React, { useState } from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Input } from "../../../components/forms/Input.jsx";
import { Icon } from "../../../components/brand/Icon.jsx";
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
  sendPasswordReset,
  updatePassword,
} from "../../lib/supabase.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const Divider = ({ label = "or continue with email" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-faint)", fontSize: 12 }}>
    <div style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
    <span>{label}</span>
    <div style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
  </div>
);

const SuccessScreen = ({ title, message }) => (
  <div style={{ textAlign: "center", padding: "28px 0" }}>
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "var(--surface-lime)",
        color: "var(--oj-green-900)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
      }}
    >
      <Icon name="check" size={24} />
    </div>
    <h3 style={{ margin: "0 0 6px", color: "var(--text-heading)", fontFamily: "var(--font-display)" }}>
      {title}
    </h3>
    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>{message}</p>
  </div>
);

const ErrorBanner = ({ message }) =>
  message ? (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-danger-soft, #fef2f2)",
        border: "1px solid var(--color-danger-light, #fecaca)",
        color: "var(--color-danger, #dc2626)",
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      <Icon name="alert-circle" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{message}</span>
    </div>
  ) : null;

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * `mode`:
 *   "login"          — sign in with email/password or Google
 *   "signup"         — create account with email/password or Google
 *   "forgot"         — request password-reset email
 *   "forgot-sent"    — reset email sent confirmation
 *   "reset-update"   — enter + confirm new password (after recovery link)
 */
export function AuthModal({ open, onClose, onAuthSuccess, initialMode = "login" }) {
  const [role, setRole] = useState("customer");
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetState = () => {
    setError("");
    setSuccessMsg("");
  };

  const switchMode = (next) => {
    resetState();
    setMode(next);
  };

  // ── Google Sign-in ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    resetState();
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
    // On success Supabase redirects the browser — no further action needed here
  };

  // ── Email/Phone Submit (login or signup) ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    resetState();

    const identifier = email || phone;
    if (!identifier) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await signUpUser({
        email: email || undefined,
        phone: phone || undefined,
        password,
        fullName: fullName || "Ojawa Member",
        role,
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError);
        return;
      }

      // Supabase may require email confirmation — show a friendly message.
      // The onAuthStateChange in App.jsx will fire SIGNED_IN once confirmed.
      setSuccessMsg("account-created");
    } else {
      const { user, session, error: signInError } = await signInUser({
        email: email || undefined,
        phone: phone || undefined,
        password,
      });

      setLoading(false);

      if (signInError) {
        setError(signInError);
        return;
      }

      // onAuthStateChange in App.jsx will handle setCurrentUser
      // We also call onAuthSuccess here as a direct callback path
      if (onAuthSuccess && user) {
        onAuthSuccess({ id: user.id, email: user.email, fullName: fullName || user.email });
      }

      setSuccessMsg("signed-in");
    }
  };

  // ── Forgot Password ─────────────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetState();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const { success, error: resetError } = await sendPasswordReset(email);
    setLoading(false);

    if (!success) {
      setError(resetError || "Could not send reset email. Please try again.");
      return;
    }

    switchMode("forgot-sent");
  };

  // ── Update Password (after recovery link) ───────────────────────────────────
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    resetState();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { success, error: updateError } = await updatePassword(password);
    setLoading(false);

    if (!success) {
      setError(updateError || "Could not update password. Please try again.");
      return;
    }

    setSuccessMsg("password-updated");
  };

  // ── Title map ────────────────────────────────────────────────────────────────
  const titleMap = {
    login: "Log in to Ojawa",
    signup: "Join Ojawa Marketplace",
    forgot: "Reset your password",
    "forgot-sent": "Check your email",
    "reset-update": "Set new password",
  };

  // ── Success screens ──────────────────────────────────────────────────────────
  const isSuccessScreen =
    successMsg === "account-created" ||
    successMsg === "signed-in" ||
    successMsg === "password-updated";

  if (successMsg === "account-created") {
    return (
      <Dialog open={open} onClose={onClose} title="Welcome to Ojawa!">
        <SuccessScreen
          title="Account created!"
          message="Check your email to confirm your address, then log in to start shopping."
        />
      </Dialog>
    );
  }

  if (successMsg === "signed-in") {
    return (
      <Dialog open={open} onClose={onClose} title="Welcome back!">
        <SuccessScreen
          title="Logged in!"
          message="Welcome to Ikorodu's verified marketplace."
        />
      </Dialog>
    );
  }

  if (successMsg === "password-updated") {
    return (
      <Dialog open={open} onClose={onClose} title="Password updated">
        <SuccessScreen
          title="Password updated!"
          message="Your new password is active. You can now log in."
        />
      </Dialog>
    );
  }

  // ── Reset-update mode ────────────────────────────────────────────────────────
  if (mode === "reset-update") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title="Set new password"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleUpdatePassword} disabled={loading}>
              {loading ? "Saving…" : "Set Password"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ErrorBanner message={error} />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </form>
      </Dialog>
    );
  }

  // ── Forgot-sent mode ─────────────────────────────────────────────────────────
  if (mode === "forgot-sent") {
    return (
      <Dialog open={open} onClose={onClose} title="Check your email">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--surface-lime)", color: "var(--oj-green-900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icon name="mail" size={24} />
          </div>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-heading)", fontFamily: "var(--font-display)" }}>
            Reset link sent
          </h3>
          <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
            We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the link.
          </p>
          <Button variant="ghost" size="sm" onClick={() => switchMode("login")}>
            Back to Login
          </Button>
        </div>
      </Dialog>
    );
  }

  // ── Forgot mode ──────────────────────────────────────────────────────────────
  if (mode === "forgot") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title="Reset your password"
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 12 }}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{ background: "transparent", border: 0, color: "var(--text-brand)", font: "600 13px var(--font-body)", cursor: "pointer", padding: 0 }}
            >
              ← Back to Login
            </button>
            <Button variant="primary" size="sm" onClick={handleForgotPassword} disabled={!email || loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <ErrorBanner message={error} />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leadingIcon="mail"
            required
          />
        </form>
      </Dialog>
    );
  }

  // ── Login / Signup mode ──────────────────────────────────────────────────────
  const isLogin = mode === "login";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={titleMap[mode]}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 12 }}>
          <button
            type="button"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            style={{ background: "transparent", border: 0, color: "var(--text-brand)", font: "600 13px var(--font-body)", cursor: "pointer", padding: 0 }}
          >
            {isLogin ? "Need an account? Sign up" : "Already registered? Log in"}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              badgeIcon="user"
              onClick={handleSubmit}
              disabled={!(email || phone) || !password || loading}
            >
              {loading ? "Please wait…" : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ─── Google Button ─── */}
        <button
          type="button"
          id="btn-google-auth"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, height: 44, borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--border-default)",
            background: "#fff", color: "#1f1f1f",
            font: "600 14px var(--font-body)",
            cursor: googleLoading ? "wait" : "pointer",
            transition: "box-shadow 0.15s ease, border-color 0.15s ease",
            width: "100%", opacity: googleLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = "#aaa"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
        >
          <GoogleLogo />
          <span>{googleLoading ? "Redirecting…" : `Continue with Google`}</span>
        </button>

        <Divider label="or continue with email" />

        {/* ─── Error Banner ─── */}
        <ErrorBanner message={error} />

        {/* ─── Role Picker (sign-up only) ─── */}
        {!isLogin && (
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              background: "var(--surface-sunken)", padding: 4,
              borderRadius: "var(--radius-pill)", gap: 4,
            }}
          >
            {[
              { id: "customer", label: "Customer", icon: "user" },
              { id: "vendor", label: "Vendor", icon: "store" },
              { id: "dispatch", label: "Dispatch", icon: "bike" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 6, height: 32, border: 0,
                  borderRadius: "var(--radius-pill)",
                  background: role === tab.id ? "#fff" : "transparent",
                  color: role === tab.id ? "var(--oj-green-900)" : "var(--text-muted)",
                  font: "600 12px var(--font-body)",
                  boxShadow: role === tab.id ? "var(--shadow-xs)" : "none",
                  cursor: "pointer", transition: "var(--transition-control)",
                }}
              >
                <Icon name={tab.icon} size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ─── Role description (sign-up only) ─── */}
        {!isLogin && (
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45 }}>
            {role === "customer"
              ? "Access your saved addresses, track live orders, and view past receipts."
              : role === "vendor"
              ? "Verified vendor portal: manage kitchen queues, stock, and incoming payouts."
              : "Dispatch rider logistics: view assigned route orders, delivery stops, and callouts."}
          </p>
        )}

        {/* ─── Full Name (sign-up only) ─── */}
        {!isLogin && (
          <Input
            label="Full Name"
            placeholder={role === "vendor" ? "Business / Store Name" : "Your Name"}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        {/* ─── Email ─── */}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon="mail"
          required
        />

        {/* ─── Password ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isLogin && (
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              style={{
                alignSelf: "flex-end",
                background: "transparent", border: 0,
                color: "var(--text-brand)", fontSize: 12, fontWeight: 600,
                cursor: "pointer", padding: 0,
              }}
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* ─── Trust badge ─── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>
          <Icon name="shield-check" size={14} style={{ color: "var(--text-brand)" }} />
          <span>Protected by Ojawa Verified Ikorodu Network</span>
        </div>

      </form>
    </Dialog>
  );
}
