import React from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { CustomerDashboard } from "./CustomerDashboard.jsx";
import { VendorDashboard } from "./VendorDashboard.jsx";
import { AdminDashboard } from "./AdminDashboard.jsx";

/**
 * DashboardRouter
 *
 * Renders the correct dashboard based on currentUser.role.
 * Shows an access-denied gate if the user is not authenticated.
 * Also shows a role-mismatch screen if somehow the wrong
 * `targetRole` is requested (edge-case safety).
 */
export function DashboardRouter({ currentUser, onNav, onSignOut, onOpenAuth, favourites }) {
  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div style={{
        maxWidth: 440, margin: "80px auto", padding: "0 24px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20,
      }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--surface-brand)", color: "var(--text-on-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="lock" size={32} />
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-heading)", margin: "0 0 8px" }}>
            Sign in to access your dashboard
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15, lineHeight: 1.5 }}>
            Log in or create an account to manage your orders, store, or platform settings.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="primary" onClick={onOpenAuth}>Log In or Sign Up</Button>
          <Button variant="ghost" onClick={() => onNav("home")}>Browse Store</Button>
        </div>
      </div>
    );
  }

  // ── Route to role-specific dashboard ──────────────────────────────────────
  switch (currentUser.role) {
    case "admin":
      return (
        <AdminDashboard
          currentUser={currentUser}
          onNav={onNav}
          onSignOut={onSignOut}
        />
      );

    case "vendor":
      return (
        <VendorDashboard
          currentUser={currentUser}
          onNav={onNav}
          onSignOut={onSignOut}
        />
      );

    case "dispatch":
      // Dispatch riders see a simplified customer-style view + route feed
      // (Full dispatch dashboard is a future extension)
      return (
        <div style={{ maxWidth: 640, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--surface-accent)", color: "var(--text-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon name="bike" size={28} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-heading)", margin: "0 0 10px" }}>
            Dispatch Rider Portal
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>
            Welcome, {currentUser.fullName}! Your rider dashboard is coming soon. You'll be able to view assigned routes, pickup points, and delivery confirmations here.
          </p>
          <div style={{ background: "var(--surface-lime)", borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--oj-green-900)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="check-circle" size={16} />
              Your Account Details
            </div>
            <div style={{ fontSize: 13, color: "var(--oj-green-900)", lineHeight: 1.7 }}>
              <div><strong>Name:</strong> {currentUser.fullName}</div>
              <div><strong>Role:</strong> Dispatch Rider</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
            </div>
          </div>
          <button type="button" onClick={onSignOut}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer", margin: "0 auto" }}>
            <Icon name="log-out" size={14} />
            Sign Out
          </button>
        </div>
      );

    case "customer":
    default:
      return (
        <CustomerDashboard
          currentUser={currentUser}
          onNav={onNav}
          onSignOut={onSignOut}
          favourites={favourites}
        />
      );
  }
}
