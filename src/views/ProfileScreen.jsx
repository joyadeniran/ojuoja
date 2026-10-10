import React from "react";
import { Icon } from "../../components/brand/Icon.jsx";
import { Button } from "../../components/core/Button.jsx";
import { ProfileCard } from "../components/ProfileCard.jsx";

/**
 * ProfileScreen — "My Profile" for every role (customer, vendor, dispatch, admin).
 */
export function ProfileScreen({ currentUser, onNav, onSignOut, onOpenAuth, onProfileUpdated }) {
  if (!currentUser) {
    return (
      <div style={{ maxWidth: 440, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-heading)", margin: "0 0 8px" }}>Sign in to view your profile</h2>
        <p style={{ color: "var(--text-muted)", margin: "0 0 20px" }}>Log in to manage your details and photo.</p>
        <Button variant="primary" onClick={onOpenAuth}>Log In or Sign Up</Button>
      </div>
    );
  }
  return (
    <div className="oj-dash-wrap" style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)", color: "var(--text-heading)", margin: "0 0 6px" }}>My Profile</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--text-muted)" }}>Update how you appear on Ojawa.</p>
      <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <ProfileCard currentUser={currentUser} onUpdated={onProfileUpdated} />
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => onNav("dashboard")}>Go to my dashboard</Button>
        <button type="button" onClick={onSignOut}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
          <Icon name="log-out" size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
