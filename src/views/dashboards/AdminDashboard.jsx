import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import {
  getPlatformStats,
  getAllProfiles,
  updateProfileRole,
  getAllOrders,
  updateOrderStatus,
  getAllVendorApplications,
  updateApplicationStatus,
} from "../../lib/supabase.js";

// ── Shared primitives ─────────────────────────────────────────────────────────
function DashShell({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-brand)", color: "var(--text-on-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={18} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
      </div>

      {/* Admin ribbon */}
      <div style={{ background: "linear-gradient(90deg, var(--oj-green-900), var(--oj-green-700))", color: "#fff", borderRadius: 12, padding: "10px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600 }}>
        <Icon name="shield-check" size={16} />
        Super-Admin Console — Restricted Access. All actions are logged.
      </div>

      {children}
    </div>
  );
}

function StatCard({ icon, label, value, delta, tone = "brand" }) {
  const themes = {
    brand: { bg: "var(--surface-brand)", color: "var(--text-on-brand)", ib: "rgba(255,255,255,0.2)" },
    lime: { bg: "var(--surface-lime)", color: "var(--oj-green-900)", ib: "rgba(0,100,40,0.12)" },
    accent: { bg: "var(--surface-accent)", color: "var(--text-on-accent)", ib: "rgba(255,255,255,0.2)" },
    neutral: { bg: "var(--oj-grey-100)", color: "var(--text-heading)", ib: "rgba(0,0,0,0.07)" },
    danger: { bg: "#fff0f0", color: "#c0392b", ib: "rgba(192,57,43,0.1)" },
  };
  const t = themes[tone] || themes.brand;
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

const ROLE_BADGE = {
  admin: { tone: "brand", icon: "shield" },
  vendor: { tone: "lime", icon: "store" },
  dispatch: { tone: "accent", icon: "bike" },
  customer: { tone: "neutral", icon: "user" },
};

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
  in_progress: { bg: "#dbeafe", color: "#1e40af" },
  under_review: { bg: "#ede9fe", color: "#5b21b6" },
  approved: { bg: "#dcfce7", color: "#166534" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
};

function StatusPill({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ ...s, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "capitalize", whiteSpace: "nowrap" }}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

// ── Users Table ───────────────────────────────────────────────────────────────
function UsersSection({ users, onRoleChange, loading }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <SectionCard title={`Users (${users.length})`} icon="users" noPad
      action={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / email…"
            style={{ padding: "6px 12px", border: "1px solid var(--border-input)", borderRadius: 99, fontSize: 13, outline: "none", fontFamily: "var(--font-body)", width: 180 }}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: "6px 12px", border: "1px solid var(--border-input)", borderRadius: 99, fontSize: 13, outline: "none", fontFamily: "var(--font-body)", background: "#fff" }}>
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="dispatch">Dispatch</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      }
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>Loading users…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No users match your search</div>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
            <div>Name / Email</div><div>Provider</div><div>Role</div><div>Actions</div>
          </div>
          {filtered.map((user, idx) => {
            const rb = ROLE_BADGE[user.role] || ROLE_BADGE.customer;
            return (
              <div key={user.id} style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12,
                alignItems: "center", padding: "14px 24px",
                borderTop: "1px solid var(--border-subtle)",
                background: idx % 2 === 0 ? "transparent" : "var(--surface-sunken)",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-heading)" }}>{user.full_name || "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{user.email || user.phone || "—"}</div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {user.avatar_url?.includes("google") ? "Google" : "Email / Phone"}
                </div>
                <div>
                  <Badge tone={rb.tone} icon={rb.icon}>{user.role}</Badge>
                </div>
                <div>
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    style={{ padding: "5px 8px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="dispatch">Dispatch</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            );
          })}
        </>
      )}
    </SectionCard>
  );
}

// ── Orders Table ──────────────────────────────────────────────────────────────
function OrdersSection({ orders, onStatusChange, loading }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <SectionCard title={`All Orders (${orders.length})`} icon="package" noPad
      action={
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "6px 12px", border: "1px solid var(--border-input)", borderRadius: 99, fontSize: 13, outline: "none", fontFamily: "var(--font-body)", background: "#fff" }}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      }
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No orders found</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr", gap: 12, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
            <div>ID</div><div>Items / Address</div><div>Phone</div><div>Amount</div><div>Status</div><div>Update</div>
          </div>
          {filtered.slice(0, 30).map((order, idx) => (
            <div key={order.id} style={{
              display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr", gap: 12,
              alignItems: "center", padding: "14px 24px",
              borderTop: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "monospace" }}>#{String(order.id).padStart(5, "0")}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)" }}>
                  {(order.items || []).slice(0, 2).map((i) => i.name).join(", ")}
                  {(order.items || []).length > 2 ? ` +${(order.items || []).length - 2}` : ""}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>{order.delivery_address}</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{order.phone}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>₦{(order.total || 0).toLocaleString("en-NG")}</div>
              <div><StatusPill status={order.status} /></div>
              <div>
                <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)}
                  style={{ padding: "5px 8px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );
}

// ── Applications Section ──────────────────────────────────────────────────────
function ApplicationsSection({ applications, onStatusChange, loading }) {
  const pending = applications.filter((a) => a.status === "under_review");

  return (
    <SectionCard title={`Vendor Applications${pending.length ? ` · ${pending.length} pending` : ""}`} icon="store" noPad>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>Loading applications…</div>
      ) : applications.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No vendor applications yet</div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
            <div>Shop / Owner</div><div>Area</div><div>Category</div><div>Status</div><div>Actions</div>
          </div>
          {applications.map((app, idx) => (
            <div key={app.id} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12,
              alignItems: "center", padding: "14px 24px",
              borderTop: "1px solid var(--border-subtle)",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)" }}>{app.shop_name}</div>
                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{app.owner_name} • {app.phone}</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{app.area}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{app.category}</div>
              <div><StatusPill status={app.status} /></div>
              <div style={{ display: "flex", gap: 6 }}>
                {app.status === "under_review" && (
                  <>
                    <button onClick={() => onStatusChange(app.id, "approved")}
                      style={{ padding: "5px 10px", borderRadius: 8, border: "none", background: "var(--surface-lime)", color: "var(--oj-green-900)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => onStatusChange(app.id, "rejected")}
                      style={{ padding: "5px 10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#991b1b", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      ✕ Reject
                    </button>
                  </>
                )}
                {app.status !== "under_review" && (
                  <span style={{ fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>{app.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ── Nav Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: "layout-dashboard" },
  { id: "users", label: "Users", icon: "users" },
  { id: "orders", label: "Orders", icon: "package" },
  { id: "applications", label: "Applications", icon: "store" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export function AdminDashboard({ currentUser, onNav, onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState({ stats: true, users: true, orders: true, apps: true });

  useEffect(() => {
    getPlatformStats().then((data) => {
      setStats(data);
      setLoading((l) => ({ ...l, stats: false }));
    });
    getAllProfiles().then((data) => {
      setUsers(data);
      setLoading((l) => ({ ...l, users: false }));
    });
    getAllOrders({ limit: 100 }).then((data) => {
      setOrders(data);
      setLoading((l) => ({ ...l, orders: false }));
    });
    getAllVendorApplications().then((data) => {
      setApplications(data);
      setLoading((l) => ({ ...l, apps: false }));
    });
  }, []);

  const handleRoleChange = useCallback(async (userId, role) => {
    const result = await updateProfileRole(userId, role);
    if (result.success) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    }
  }, []);

  const handleOrderStatusChange = useCallback(async (orderId, status) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    }
  }, []);

  const handleApplicationStatusChange = useCallback(async (appId, status) => {
    const result = await updateApplicationStatus(appId, status);
    if (result.success) {
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    }
  }, []);

  const pendingApps = applications.filter((a) => a.status === "under_review").length;

  return (
    <DashShell title="Super-Admin Dashboard" subtitle={`Logged in as ${currentUser?.fullName || "Administrator"} — Ojawa Marketplace`}>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 0 }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 18px", border: "none",
              background: "transparent", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
              color: activeTab === tab.id ? "var(--text-brand)" : "var(--text-muted)",
              borderBottom: `2px solid ${activeTab === tab.id ? "var(--surface-brand)" : "transparent"}`,
              marginBottom: -1,
              position: "relative",
              transition: "color 0.15s ease",
            }}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
            {tab.id === "applications" && pendingApps > 0 && (
              <span style={{ background: "var(--color-danger)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 5px", marginLeft: 2 }}>
                {pendingApps}
              </span>
            )}
          </button>
        ))}
        <div style={{ marginLeft: "auto", alignSelf: "center" }}>
          <button type="button" onClick={onSignOut}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
            <Icon name="log-out" size={13} />
            Sign Out
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          {/* Platform Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
            <StatCard icon="users" label="Total Users" value={loading.stats ? "…" : (stats?.total_users ?? 0)} tone="brand" />
            <StatCard icon="store" label="Verified Vendors" value={loading.stats ? "…" : (stats?.verified_vendors ?? 0)} tone="lime" />
            <StatCard icon="package" label="Total Orders" value={loading.stats ? "…" : (stats?.total_orders ?? 0)} tone="accent" />
            <StatCard icon="trending-up" label="Platform Revenue" value={loading.stats ? "…" : `₦${(stats?.total_revenue || 0).toLocaleString("en-NG")}`} tone="neutral" />
            <StatCard icon="clock" label="Pending Orders" value={loading.stats ? "…" : (stats?.pending_orders ?? 0)} tone="danger" />
            <StatCard icon="file-check" label="Pending Applications" value={loading.stats ? "…" : (stats?.pending_applications ?? 0)} tone="danger" />
          </div>

          {/* Quick overview: recent orders + pending applications */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <SectionCard title="Recent Orders" icon="package" noPad action={
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>View all</Button>
            }>
              {orders.slice(0, 5).map((order, idx) => (
                <div key={order.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "12px 20px", borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {(order.items || []).slice(0, 1).map((i) => i.name).join(", ")}
                      {(order.items || []).length > 1 ? ` +${(order.items || []).length - 1}` : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>₦{(order.total || 0).toLocaleString("en-NG")} • {order.delivery_address}</div>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              ))}
              {orders.length === 0 && !loading.orders && (
                <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No orders yet</div>
              )}
            </SectionCard>

            <SectionCard title="Pending Applications" icon="store" noPad action={
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("applications")}>View all</Button>
            }>
              {applications.filter((a) => a.status === "under_review").slice(0, 5).map((app, idx) => (
                <div key={app.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "12px 20px", borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)" }}>{app.shop_name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{app.area} • {app.category}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleApplicationStatusChange(app.id, "approved")}
                      style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "var(--surface-lime)", color: "var(--oj-green-900)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      ✓
                    </button>
                    <button onClick={() => handleApplicationStatusChange(app.id, "rejected")}
                      style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#991b1b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {applications.filter((a) => a.status === "under_review").length === 0 && !loading.apps && (
                <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  <Icon name="check-circle" size={28} style={{ color: "var(--text-brand)", marginBottom: 8 }} />
                  <div>All applications reviewed</div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <UsersSection users={users} onRoleChange={handleRoleChange} loading={loading.users} />
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <OrdersSection orders={orders} onStatusChange={handleOrderStatusChange} loading={loading.orders} />
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <ApplicationsSection applications={applications} onStatusChange={handleApplicationStatusChange} loading={loading.apps} />
      )}
    </DashShell>
  );
}
