import React, { useState, useEffect } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import { getMyOrders, updateMyProfile } from "../../lib/supabase.js";

// ── Shared dashboard layout primitives ────────────────────────────────────────
function DashShell({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 64px" }}>
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
export function CustomerDashboard({ currentUser, onNav, favourites = [], onSignOut }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(currentUser?.fullName || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    getMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateMyProfile({ full_name: editName, phone: editPhone });
    setSaving(false);
    if (result.success) {
      setSaveMsg("Profile updated!");
      setEditMode(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const totalSpend = orders.reduce((s, o) => s + (o.total || 0), 0);
  const initials = (currentUser?.fullName || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <DashShell title="My Account" subtitle="Manage your orders, favourites, and profile settings">

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon="shopping-bag" label="Total Orders" value={orders.length} tone="brand" />
        <StatCard icon="heart" label="Saved Items" value={favourites.length} tone="lime" />
        <StatCard icon="wallet" label="Total Spend" value={`₦${totalSpend.toLocaleString("en-NG")}`} tone="accent" />
        <StatCard icon="check-circle" label="Completed" value={orders.filter((o) => o.status === "completed").length} tone="neutral" />
      </div>

      {/* Profile Card */}
      <SectionCard
        title="My Profile"
        icon="user"
        action={
          !editMode ? (
            <Button variant="ghost" size="sm" onClick={() => { setEditMode(true); setEditName(currentUser?.fullName || ""); setEditPhone(currentUser?.phone || ""); }}>
              Edit
            </Button>
          ) : null
        }
      >
        <div style={{ padding: 24 }}>
          {saveMsg && (
            <div style={{ background: "var(--surface-lime)", color: "var(--oj-green-900)", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
              ✓ {saveMsg}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--surface-brand)", color: "var(--text-on-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
              ) : initials}
            </div>

            <div style={{ flex: 1 }}>
              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Full Name</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "var(--font-body)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Phone Number</label>
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "var(--font-body)" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "var(--text-heading)" }}>{currentUser?.fullName}</div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{currentUser?.email}</div>
                  {currentUser?.phone && <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{currentUser.phone}</div>}
                  <div style={{ marginTop: 4 }}>
                    <Badge tone="lime" icon="check-circle">
                      {currentUser?.provider === "google" ? "Google Account" : "Email Account"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
