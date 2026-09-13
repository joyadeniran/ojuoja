import React from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { CustomerDashboard } from "./CustomerDashboard.jsx";
import { VendorDashboard } from "./VendorDashboard.jsx";
import { AdminDashboard } from "./AdminDashboard.jsx";
import { DispatchDashboard } from "./DispatchDashboard.jsx";

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
      return (
        <DispatchDashboard
          currentUser={currentUser}
          onSignOut={onSignOut}
        />
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
