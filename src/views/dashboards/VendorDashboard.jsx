import React, { useState, useEffect } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import {
  getVendorOrders,
  computeVendorStats,
  getVendorStoreSettings,
  updateVendorStoreSettings,
} from "../../lib/supabase.js";
import { VENDORS } from "../../data/marketData.js";

// ── Shared primitives ─────────────────────────────────────────────────────────
function DashShell({ title, subtitle, right, children }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 20px 64px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>{title}</h1>
          {subtitle && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, sub, tone = "brand" }) {
  const themes = {
    brand: { bg: "var(--surface-brand)", color: "var(--text-on-brand)", iconBg: "rgba(255,255,255,0.2)" },
    lime: { bg: "var(--surface-lime)", color: "var(--oj-green-900)", iconBg: "rgba(0,100,40,0.12)" },
    accent: { bg: "var(--surface-accent)", color: "var(--text-on-accent)", iconBg: "rgba(255,255,255,0.2)" },
    neutral: { bg: "var(--oj-grey-100)", color: "var(--text-heading)", iconBg: "rgba(0,0,0,0.07)" },
    danger: { bg: "#fff0f0", color: "#c0392b", iconBg: "rgba(192,57,43,0.1)" },
  };
  const t = themes[tone] || themes.brand;
  return (
    <div style={{ background: t.bg, color: t.color, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, action, noPad, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && <Icon name={icon} size={18} style={{ color: "var(--text-brand)" }} />}
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: noPad ? 0 : 24 }}>{children}</div>
    </div>
  );
}

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
  in_progress: { bg: "#dbeafe", color: "#1e40af" },
};

function OrderRow({ order, idx, vendorName }) {
  const myItems = (order.items || []).filter(
    (i) => (i.vendor || "").toLowerCase() === vendorName.toLowerCase()
  );
  const myTotal = myItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 2fr auto auto",
      alignItems: "center", gap: 16, padding: "14px 24px",
      borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "monospace" }}>
        #{String(order.id).padStart(5, "0")}
        <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
          {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)", marginBottom: 2 }}>
          {myItems.map((i) => `${i.qty}× ${i.name}`).join(", ")}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{order.delivery_address}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)", textAlign: "right" }}>
        ₦{myTotal.toLocaleString("en-NG")}
      </div>
      <span style={{ ...statusStyle, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "capitalize", whiteSpace: "nowrap" }}>
        {order.status?.replace("_", " ")}
      </span>
    </div>
  );
}

// ── Store toggle slider ───────────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? "var(--surface-brand)" : "var(--oj-grey-200)",
          position: "relative", transition: "background 0.2s ease", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: value ? 23 : 3,
          width: 18, height: 18, borderRadius: 9, background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "left 0.2s ease",
        }} />
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-heading)" }}>{label}</span>
    </label>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function VendorDashboard({ currentUser, onNav, onSignOut }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({ is_open: true, opens_at: "08:00", closes_at: "22:00", banner_message: "" });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Derive vendor record from the user's full_name matching vendor data
  const vendorRecord = VENDORS.find(
    (v) => v.name.toLowerCase() === (currentUser?.fullName || "").toLowerCase()
  ) || VENDORS[0]; // Fallback for demo

  const vendorName = currentUser?.fullName || vendorRecord?.name || "My Store";

  useEffect(() => {
    Promise.all([
      getVendorOrders(vendorName),
      getVendorStoreSettings(vendorRecord?.id),
    ]).then(([orderData, settingsData]) => {
      setOrders(orderData);
      setStats(computeVendorStats(orderData, vendorName));
      if (settingsData) setSettings(settingsData);
      setLoading(false);
    });
  }, [vendorName]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    await updateVendorStoreSettings(vendorRecord?.id, settings);
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const recentOrders = orders.slice(0, 20);

  return (
    <DashShell
      title={`${vendorName} — Vendor Portal`}
      subtitle="Manage your orders, store settings, and performance"
      right={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 99, fontSize: 13, fontWeight: 700,
            background: settings.is_open ? "var(--surface-lime)" : "#fee2e2",
            color: settings.is_open ? "var(--oj-green-900)" : "#991b1b",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: settings.is_open ? "var(--oj-green-700)" : "#c0392b" }} />
            {settings.is_open ? "Store Open" : "Store Closed"}
          </div>
        </div>
      }
    >
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon="package" label="Total Orders" value={stats?.totalOrders ?? "—"} tone="brand" />
        <StatCard icon="clock" label="Pending" value={stats?.pendingOrders ?? "—"} tone="accent" />
        <StatCard icon="trending-up" label="Revenue" value={stats ? `₦${stats.totalRevenue.toLocaleString("en-NG")}` : "—"} tone="lime" />
        <StatCard icon="bar-chart-2" label="Avg. Order Value" value={stats ? `₦${stats.avgOrderValue.toLocaleString("en-NG")}` : "—"} tone="neutral" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        <div>
          {/* Live Orders Queue */}
          <SectionCard title={`Live Orders${pendingOrders.length ? ` (${pendingOrders.length} pending)` : ""}`} icon="zap" noPad>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>Loading orders…</div>
            ) : pendingOrders.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Icon name="check-circle" size={36} style={{ color: "var(--text-brand)", marginBottom: 10 }} />
                <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>All clear</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>No pending orders right now.</div>
              </div>
            ) : (
              pendingOrders.map((order, idx) => (
                <OrderRow key={order.id} order={order} idx={idx} vendorName={vendorName} />
              ))
            )}
          </SectionCard>

          {/* Recent Orders Table */}
          <SectionCard title="Recent Orders" icon="list" noPad>
            {recentOrders.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                No orders yet. Share your store link to start receiving orders.
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto", gap: 16, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
                  <div>Order ID</div><div>Items</div><div>Amount</div><div>Status</div>
                </div>
                {recentOrders.map((order, idx) => (
                  <OrderRow key={order.id} order={order} idx={idx} vendorName={vendorName} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Sidebar: Top Products + Store Settings */}
        <div>
          {/* Top Products */}
          <SectionCard title="Top Products" icon="star">
            {!stats || stats.topProducts.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: 16 }}>No sales data yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.topProducts.map((p, i) => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "var(--surface-accent)" : "var(--oj-grey-100)", color: i === 0 ? "var(--text-on-accent)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, color: "var(--text-heading)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{p.count} sold</div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Store Settings */}
          <SectionCard title="Store Settings" icon="settings">
            {settingsSaved && (
              <div style={{ background: "var(--surface-lime)", color: "var(--oj-green-900)", padding: "8px 12px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
                ✓ Settings saved
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Toggle
                value={settings.is_open}
                onChange={(v) => setSettings((s) => ({ ...s, is_open: v }))}
                label={settings.is_open ? "Store is Open" : "Store is Closed"}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Opens At</label>
                  <input type="time" value={settings.opens_at}
                    onChange={(e) => setSettings((s) => ({ ...s, opens_at: e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Closes At</label>
                  <input type="time" value={settings.closes_at}
                    onChange={(e) => setSettings((s) => ({ ...s, closes_at: e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Banner Message</label>
                <input value={settings.banner_message || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, banner_message: e.target.value }))}
                  placeholder="e.g. Back in stock: Ofada rice!"
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" }} />
              </div>

              <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? "Saving…" : "Save Settings"}
              </Button>
            </div>
          </SectionCard>

          {/* Sign Out */}
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={onSignOut}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
              <Icon name="log-out" size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
