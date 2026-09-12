import React, { useState } from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Input } from "../../../components/forms/Input.jsx";
import { Icon } from "../../../components/brand/Icon.jsx";

export function AuthModal({ open, onClose, onAuthSuccess }) {
  const [role, setRole] = useState("customer"); // "customer" | "vendor" | "dispatch"
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const roleLabel = role === "vendor" ? "Vendor Partner" : role === "dispatch" ? "Dispatch Rider" : "Shopper";
      const actionLabel = mode === "login" ? "Logged in as" : "Account created as";
      setSuccessMsg(`${actionLabel} ${roleLabel}!`);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
        if (onAuthSuccess) {
          onAuthSuccess({
            role,
            phone,
            fullName: fullName || "Ikorodu Neighbor",
          });
        }
      }, 1100);
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "login" ? "Log in to Ojawa" : "Join Ojawa Marketplace"}
      footer={
        successMsg ? null : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 12 }}>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{
                background: "transparent",
                border: 0,
                color: "var(--text-brand)",
                font: "600 13px var(--font-body)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                badgeIcon="user"
                onClick={handleSubmit}
                disabled={!phone || loading}
              >
                {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
              </Button>
            </div>
          </div>
        )
      }
    >
      {successMsg ? (
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
            {successMsg}
          </h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
            Welcome to Ikorodu's verified marketplace.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Role Picker */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              background: "var(--surface-sunken)",
              padding: 4,
              borderRadius: "var(--radius-pill)",
              gap: 4,
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  height: 32,
                  border: 0,
                  borderRadius: "var(--radius-pill)",
                  background: role === tab.id ? "#fff" : "transparent",
                  color: role === tab.id ? "var(--oj-green-900)" : "var(--text-muted)",
                  font: "600 12px var(--font-body)",
                  boxShadow: role === tab.id ? "var(--shadow-xs)" : "none",
                  cursor: "pointer",
                  transition: "var(--transition-control)",
                }}
              >
                <Icon name={tab.icon} size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45 }}>
            {role === "customer"
              ? "Access your saved addresses, track live orders across Ikorodu, and view past receipts."
              : role === "vendor"
              ? "Verified vendor portal: manage kitchen queues, stock availability, and incoming payouts."
              : "Dispatch rider logistics: view assigned route orders, delivery stops, and customer callouts."}
          </p>

          {mode === "signup" && (
            <Input
              label="Full Name"
              placeholder={role === "vendor" ? "Business / Store Name" : "Your Name"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <Input
            label="Phone Number"
            placeholder="0803 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leadingIcon="phone"
            required
          />

          <Input
            label="Password / PIN"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--text-faint)",
              marginTop: 4,
            }}
          >
            <Icon name="shield-check" size={14} style={{ color: "var(--text-brand)" }} />
            <span>Protected by Ojawa Verified Ikorodu Network</span>
          </div>
        </form>
      )}
    </Dialog>
  );
}
