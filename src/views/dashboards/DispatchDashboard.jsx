import React, { useState, useEffect } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import { getAllOrders } from "../../lib/supabase.js";

// ── Shared primitives ─────────────────────────────────────────────────────────
function StatCard({ icon, label, value, tone = "accent" }) {
  const themes = {
    accent: { bg: "var(--surface-accent)", color: "var(--text-on-accent)", ib: "rgba(255,255,255,0.25)" },
    brand: { bg: "var(--surface-brand)", color: "var(--text-on-brand)", ib: "rgba(255,255,255,0.2)" },
    lime: { bg: "var(--surface-lime)", color: "var(--oj-green-900)", ib: "rgba(0,100,40,0.12)" },
    neutral: { bg: "var(--oj-grey-100)", color: "var(--text-heading)", ib: "rgba(0,0,0,0.07)" },
    danger: { bg: "#fff0f0", color: "#c0392b", ib: "rgba(192,57,43,0.1)" },
  };
  const t = themes[tone] || themes.accent;
  return (
    <div style={{ background: t.bg, color: t.color, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: t.ib, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
    </div>
  );
}

function SectionCard({ title, icon, action, noPad, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && <Icon name={icon} size={17} style={{ color: "var(--text-brand)" }} />}
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: noPad ? 0 : 20 }}>{children}</div>
    </div>
  );
}

const STATUS_COLORS = {
  pending:     { bg: "#fef3c7", color: "#92400e" },
  in_progress: { bg: "#dbeafe", color: "#1e40af" },
  completed:   { bg: "#dcfce7", color: "#166534" },
  cancelled:   { bg: "#fee2e2", color: "#991b1b" },
};

function StatusPill({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ ...s, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "capitalize", whiteSpace: "nowrap" }}>
      {status?.replace("_", " ")}
    </span>
  );
}

// ── Delivery Card ─────────────────────────────────────────────────────────────
function DeliveryCard({ order, index, onMarkDelivered, onMarkPickedUp }) {
  const isNew = order.status === "pending";
  const inProgress = order.status === "in_progress";

  return (
    <div style={{
      padding: "18px 22px",
      borderTop: index > 0 ? "1px solid var(--border-subtle)" : "none",
      background: isNew ? "rgba(250, 243, 220, 0.4)" : "transparent",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-faint)" }}>
              #{String(order.id).padStart(5, "0")}
            </span>
            <StatusPill status={order.status} />
            {isNew && (
              <span style={{ background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, animation: "dispatch-pulse 1.5s ease-in-out infinite" }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)", marginBottom: 3 }}>
            {(order.items || []).slice(0, 2).map((i) => `${i.qty}× ${i.name}`).join(", ")}
            {(order.items || []).length > 2 ? ` +${(order.items || []).length - 2} more` : ""}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {order.delivery_address}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-heading)" }}>
            ₦{(order.total || 0).toLocaleString("en-NG")}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
            {new Date(order.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Vendor + customer info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "var(--surface-sunken)", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: 4 }}>
            Pickup from
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from(new Set((order.items || []).map((i) => i.vendor).filter(Boolean))).map((v) => (
              <div key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>
                <Icon name="store" size={12} style={{ color: "var(--text-brand)", flexShrink: 0 }} />
                {v}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--surface-sunken)", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: 4 }}>
            Customer
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>
            <Icon name="phone" size={12} style={{ color: "var(--text-brand)", flexShrink: 0 }} />
            <a href={`tel:${order.phone}`} style={{ color: "var(--text-brand)", textDecoration: "none" }}>
              {order.phone}
            </a>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, textTransform: "capitalize" }}>
            {order.payment_method === "transfer" ? "💳 Bank Transfer" : "💵 Cash on Delivery"}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {(isNew || inProgress) && (
        <div style={{ display: "flex", gap: 8 }}>
          {isNew && (
            <button
              type="button"
              onClick={() => onMarkPickedUp(order.id)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                height: 40, borderRadius: 10, border: "none",
                background: "var(--surface-accent)", color: "var(--text-on-accent)",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Icon name="package" size={15} />
              Mark Picked Up
            </button>
          )}
          {inProgress && (
            <button
              type="button"
              onClick={() => onMarkDelivered(order.id)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                height: 40, borderRadius: 10, border: "none",
                background: "var(--surface-brand)", color: "var(--text-on-brand)",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Icon name="check-circle" size={15} />
              Mark Delivered
            </button>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address + ", Ikorodu, Lagos")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              height: 40, padding: "0 16px", borderRadius: 10,
              border: "1px solid var(--border-subtle)", background: "#fff",
              fontWeight: 600, fontSize: 13, color: "var(--text-heading)",
              textDecoration: "none", cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Icon name="map-pin" size={14} style={{ color: "var(--text-brand)" }} />
            Map
          </a>
        </div>
      )}
    </div>
  );
}

// ── Zone selector ─────────────────────────────────────────────────────────────
const ZONES = ["All Zones", "Ita Elewa", "Sabo", "Agric", "Igbogbo", "Ebute", "Town Centre"];

// ── Main Component ─────────────────────────────────────────────────────────────
export function DispatchDashboard({ currentUser, onSignOut }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState("All Zones");
  const [tab, setTab] = useState("active"); // "active" | "completed"
  const [onDuty, setOnDuty] = useState(true);

  useEffect(() => {
    getAllOrders({ limit: 200 }).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  // Optimistic status updates
  const handleMarkPickedUp = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "in_progress" } : o))
    );
    // Fire-and-forget Supabase update
    import("../../lib/supabase.js").then(({ updateOrderStatus }) =>
      updateOrderStatus(orderId, "in_progress")
    );
  };

  const handleMarkDelivered = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
    );
    import("../../lib/supabase.js").then(({ updateOrderStatus }) =>
      updateOrderStatus(orderId, "completed")
    );
  };

  // Filter by zone
  const zoneFiltered = zone === "All Zones"
    ? orders
    : orders.filter((o) =>
        (o.delivery_address || "").toLowerCase().includes(zone.toLowerCase())
      );

  const activeOrders    = zoneFiltered.filter((o) => o.status === "pending" || o.status === "in_progress");
  const completedOrders = zoneFiltered.filter((o) => o.status === "completed");
  const pendingOrders   = zoneFiltered.filter((o) => o.status === "pending");
  const inProgressOrders = zoneFiltered.filter((o) => o.status === "in_progress");

  const displayOrders = tab === "active" ? activeOrders : completedOrders;

  const initials = (currentUser?.fullName || "R").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 72px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: "var(--surface-accent)", color: "var(--text-on-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 18,
          }}>
            {currentUser?.avatarUrl
              ? <img src={currentUser.avatarUrl} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
              : initials}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 2px" }}>
              Rider Dashboard
            </h1>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{currentUser?.fullName} · Dispatch Rider</div>
          </div>
        </div>

        {/* On / Off duty toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            onClick={() => setOnDuty((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 99, cursor: "pointer",
              background: onDuty ? "var(--surface-lime)" : "var(--oj-grey-100)",
              color: onDuty ? "var(--oj-green-900)" : "var(--text-muted)",
              fontWeight: 700, fontSize: 13, transition: "all 0.2s ease",
              border: "none", userSelect: "none",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: onDuty ? "var(--oj-green-700)" : "#9ca3af", transition: "background 0.2s" }} />
            {onDuty ? "On Duty" : "Off Duty"}
          </div>
          <button type="button" onClick={onSignOut}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
            <Icon name="log-out" size={13} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon="package" label="Pending Pickups"  value={loading ? "…" : pendingOrders.length}    tone="accent" />
        <StatCard icon="bike"    label="In Transit"        value={loading ? "…" : inProgressOrders.length}  tone="brand"  />
        <StatCard icon="check-circle" label="Delivered Today" value={loading ? "…" : completedOrders.length} tone="lime"   />
        <StatCard icon="map-pin" label="Zone"              value={zone === "All Zones" ? "All" : zone}        tone="neutral" />
      </div>

      {/* Zone Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {ZONES.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => setZone(z)}
            style={{
              padding: "7px 16px", borderRadius: 99, border: "1px solid",
              borderColor: zone === z ? "var(--surface-brand)" : "var(--border-subtle)",
              background: zone === z ? "var(--surface-brand)" : "#fff",
              color: zone === z ? "var(--text-on-brand)" : "var(--text-body)",
              fontWeight: 600, fontSize: 12, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: "var(--font-body)",
              transition: "all 0.15s ease",
            }}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", borderBottom: "2px solid var(--border-subtle)", marginBottom: 20 }}>
        {[
          { id: "active", label: `Active (${activeOrders.length})`, icon: "zap" },
          { id: "completed", label: `Completed (${completedOrders.length})`, icon: "check-circle" },
        ].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 18px", border: "none", background: "transparent",
              cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
              color: tab === t.id ? "var(--text-brand)" : "var(--text-muted)",
              borderBottom: `2px solid ${tab === t.id ? "var(--surface-brand)" : "transparent"}`,
              marginBottom: -2, transition: "color 0.15s",
            }}>
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Deliveries */}
      <SectionCard
        title={tab === "active" ? "Active Deliveries" : "Completed Deliveries"}
        icon={tab === "active" ? "bike" : "check-circle"}
        noPad
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>
            Loading deliveries…
          </div>
        ) : displayOrders.length === 0 ? (
          <div style={{ padding: 52, textAlign: "center" }}>
            {tab === "active" ? (
              <>
                <Icon name="bike" size={40} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
                <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
                  {onDuty ? "No active deliveries" : "You are off duty"}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  {onDuty ? "New orders will appear here as they come in." : "Toggle to On Duty above to receive new orders."}
                </div>
              </>
            ) : (
              <>
                <Icon name="check-circle" size={40} style={{ color: "var(--text-brand)", marginBottom: 12 }} />
                <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>No completed deliveries yet</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Mark deliveries as delivered to see them here.</div>
              </>
            )}
          </div>
        ) : (
          displayOrders.map((order, idx) => (
            <DeliveryCard
              key={order.id}
              order={order}
              index={idx}
              onMarkPickedUp={handleMarkPickedUp}
              onMarkDelivered={handleMarkDelivered}
            />
          ))
        )}
      </SectionCard>

      {/* Pulse animation */}
      <style>{`
        @keyframes dispatch-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
