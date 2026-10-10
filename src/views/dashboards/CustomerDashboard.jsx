import React, { useState, useEffect } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { getMyOrders, getMyVendorApplications } from "../../lib/supabase.js";
import { ProfileCard } from "../../components/ProfileCard.jsx";

// ── Shared dashboard layout primitives ────────────────────────────────────────
function DashShell({ title, subtitle, children }) {
  return (
    <div className="oj-dash-wrap" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>
          {title}
        </h1>
        {subtitle && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, tone = "brand" }) {
  const bgMap = {
    brand: { bg: "var(--surface-brand)", color: "var(--text-on-brand)" },
    lime: { bg: "var(--surface-lime)", color: "var(--oj-green-900)" },
    accent: { bg: "var(--surface-accent)", color: "var(--text-on-accent)" },
    neutral: { bg: "var(--oj-grey-100)", color: "var(--text-heading)" },
  };
  const { bg, color } = bgMap[tone] || bgMap.brand;
  return (
    <div style={{ background: bg, color, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
  in_progress: { bg: "#dbeafe", color: "#1e40af" },
};

function OrderStatusBadge({ status }) {
  const style = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      ...style, fontSize: 11, fontWeight: 700, padding: "3px 10px",
      borderRadius: 99, textTransform: "capitalize", whiteSpace: "nowrap"
    }}>
      {status?.replace("_", " ")}
    </span>
  );
}

function SectionCard({ title, icon, action, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && <Icon name={icon} size={18} style={{ color: "var(--text-brand)" }} />}
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: "0" }}>{children}</div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function CustomerDashboard({ currentUser, onNav, favourites = [], onSignOut, onProfileUpdated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
    getMyVendorApplications().then(setApplications);
  }, []);

  const totalSpend = orders.reduce((s, o) => s + (o.total || 0), 0);
  
  return (
    <DashShell title="My Account" subtitle="Manage your orders, favourites, and profile settings">

      {/* Stats Row */}
      <div className="oj-stat-grid">
        <StatCard icon="shopping-bag" label="Total Orders" value={orders.length} tone="brand" />
        <StatCard icon="heart" label="Saved Items" value={favourites.length} tone="lime" />
        <StatCard icon="wallet" label="Total Spend" value={`₦${totalSpend.toLocaleString("en-NG")}`} tone="accent" />
        <StatCard icon="check-circle" label="Completed" value={orders.filter((o) => o.status === "completed").length} tone="neutral" />
      </div>

      {/* Vendor application status */}
      {applications.length > 0 && (() => {
        const app = applications[0];
        const tones = {
          under_review: { bg: "#fffbeb", border: "#fde68a", color: "#92400e", title: "Your vendor application is under review", text: "We'll notify you as soon as it's approved. Your vendor dashboard (product uploads, sales, wallet) unlocks right after approval." },
          approved: { bg: "#f0fdf4", border: "#86efac", color: "#166534", title: "Your vendor application was approved 🎉", text: "Sign out and back in to open your Vendor Dashboard." },
          rejected: { bg: "#fef2f2", border: "#fecaca", color: "#991b1b", title: "Your vendor application was not approved", text: app.notes || "Contact Ojawa support for details or apply again." },
        };
        const t = tones[app.status] || tones.under_review;
        return (
          <div style={{ marginBottom: 24, padding: "16px 20px", borderRadius: 14, background: t.bg, border: `1px solid ${t.border}`, color: t.color }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}><strong>{app.shop_name}</strong> · {app.area} — {t.text}</div>
          </div>
        );
      })()}

      {/* Profile Card */}
      <SectionCard title="My Profile" icon="user">
        <ProfileCard currentUser={currentUser} onUpdated={onProfileUpdated} />
      </SectionCard>

      {/* Order History */}
      <SectionCard title="Order History" icon="package" action={
        <Button variant="ghost" size="sm" onClick={() => onNav("home")}>Shop more</Button>
      }>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <Icon name="shopping-bag" size={40} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
            <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>No orders yet</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 16px" }}>Discover fresh produce and food from Ikorodu vendors.</p>
            <Button variant="primary" size="sm" onClick={() => onNav("home")}>Start Shopping</Button>
          </div>
        ) : (
          <div>
            {orders.map((order, idx) => (
              <div key={order.id} style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                padding: "16px 24px", borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-heading)", marginBottom: 4 }}>
                    {(order.items || []).slice(0, 2).map((i) => i.name).join(", ")}
                    {(order.items || []).length > 2 ? ` +${(order.items || []).length - 2} more` : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                    {order.delivery_address} • {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)" }}>
                    ₦{(order.total || 0).toLocaleString("en-NG")}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Sign Out */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button type="button" onClick={onSignOut}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
          <Icon name="log-out" size={14} />
          Sign Out
        </button>
      </div>
    </DashShell>
  );
}
