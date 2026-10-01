import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import {
  getPlatformStats,
  getAllProfiles,
  updateProfileRole,
  suspendProfile,
  restoreProfile,
  getAllOrders,
  updateOrderStatus,
  getAllVendorApplications,
  approveVendorApplication,
  rejectVendorApplication,
  getAllVendors,
  toggleVendorVerification,
} from "../../lib/supabase.js";

// ── Shared primitives ─────────────────────────────────────────────────────────
function DashShell({ title, subtitle, toast, onClearToast, children }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-brand)", color: "var(--text-on-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield-check" size={18} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
      </div>

      {/* Admin ribbon */}
      <div style={{ background: "linear-gradient(90deg, var(--oj-green-900), var(--oj-green-700))", color: "#fff", borderRadius: 12, padding: "10px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600 }}>
        <Icon name="shield-check" size={16} />
        Super-Admin Console — Restricted Access. All vendor approvals, role elevations, and order actions are recorded.
      </div>

      {/* Toast alert banner */}
      {toast && (
        <div style={{
          marginBottom: 20, padding: "12px 18px", borderRadius: 10,
          background: toast.tone === "danger" ? "#fff0f0" : "#dcfce7",
          border: `1px solid ${toast.tone === "danger" ? "#fecaca" : "#86efac"}`,
          color: toast.tone === "danger" ? "#991b1b" : "#166534",
          fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name={toast.tone === "danger" ? "x" : "check"} size={16} />
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={onClearToast}
            style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      )}

      {children}
    </div>
  );
}

function StatCard({ icon, label, value, tone = "brand", onClick }) {
  const themes = {
    brand: { bg: "var(--surface-brand)", color: "var(--text-on-brand)", ib: "rgba(255,255,255,0.2)" },
    lime: { bg: "var(--surface-lime)", color: "var(--oj-green-900)", ib: "rgba(0,100,40,0.12)" },
    accent: { bg: "var(--surface-accent)", color: "var(--text-on-accent)", ib: "rgba(255,255,255,0.2)" },
    neutral: { bg: "var(--oj-grey-100)", color: "var(--text-heading)", ib: "rgba(0,0,0,0.07)" },
    danger: { bg: "#fff0f0", color: "#c0392b", ib: "rgba(192,57,43,0.1)" },
  };
  const t = themes[tone] || themes.brand;
  return (
    <div
      onClick={onClick}
      style={{
        background: t.bg, color: t.color, borderRadius: 16, padding: "20px 24px",
        display: "flex", flexDirection: "column", gap: 10, cursor: onClick ? "pointer" : "default",
        transition: "transform 0.15s ease",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: t.ib, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
    </div>
  );
}

function SectionCard({ title, icon, action, noPad, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap", gap: 12 }}>
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
  admin: { tone: "brand", icon: "shield-check" },
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

// ── Users Section ─────────────────────────────────────────────────────────────
function UsersSection({ users, onRoleChange, onSuspend, onRestore, loading }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <SectionCard title={`Users (${users.length})`} icon="user" noPad
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
            <option value="suspended">Suspended</option>
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
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.6fr", gap: 12, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
            <div>Name / Email</div><div>Provider</div><div>Role</div><div>Actions</div>
          </div>
          {filtered.map((user, idx) => {
            const isSuspended = user.role === "suspended";
            const rb = ROLE_BADGE[user.role] || ROLE_BADGE.customer;
            return (
              <div key={user.id} style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.6fr", gap: 12,
                alignItems: "center", padding: "14px 24px",
                borderTop: "1px solid var(--border-subtle)",
                background: isSuspended
                  ? "#fff0f0"
                  : idx % 2 === 0 ? "transparent" : "var(--surface-sunken)",
                opacity: isSuspended ? 0.75 : 1,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: 6 }}>
                    {user.full_name || "—"}
                    {isSuspended && (
                      <span style={{ fontSize: 10, fontWeight: 700, background: "#fee2e2", color: "#991b1b", padding: "2px 6px", borderRadius: 99 }}>SUSPENDED</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{user.email || user.phone || "—"}</div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {user.avatar_url?.includes("google") ? "Google" : "Email / Phone"}
                </div>
                <div>
                  {!isSuspended && <Badge tone={rb.tone} icon={rb.icon}>{user.role}</Badge>}
                  {isSuspended && <Badge tone="danger" icon="x">suspended</Badge>}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {!isSuspended && (
                    <>
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
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Suspend ${user.full_name || user.email}? They will lose access immediately.`)) {
                            onSuspend(user.id);
                          }
                        }}
                        title="Suspend user"
                        style={{
                          padding: "5px 8px", border: "1px solid #fecaca",
                          borderRadius: 8, background: "#fff0f0",
                          color: "#c0392b", fontSize: 11, fontWeight: 700,
                          cursor: "pointer", whiteSpace: "nowrap",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Suspend
                      </button>
                    </>
                  )}
                  {isSuspended && (
                    <button
                      type="button"
                      onClick={() => onRestore(user.id)}
                      style={{
                        padding: "5px 12px", border: "1px solid #86efac",
                        borderRadius: 8, background: "var(--surface-lime)",
                        color: "var(--oj-green-900)", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", whiteSpace: "nowrap",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </SectionCard>
  );
}

// ── Active Vendors Section ───────────────────────────────────────────────────
function VendorsSection({ vendors, onToggleVerified, loading }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (v.name || "").toLowerCase().includes(q) ||
      (v.area || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && v.verified) ||
      (statusFilter === "unverified" && !v.verified);
    return matchSearch && matchStatus;
  });

  return (
    <SectionCard
      title={`Active Platform Vendors (${vendors.length})`}
      icon="store"
      noPad
      action={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search store / area…"
            style={{
              padding: "6px 12px",
              border: "1px solid var(--border-input)",
              borderRadius: 99,
              fontSize: 13,
              outline: "none",
              fontFamily: "var(--font-body)",
              width: 180,
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1px solid var(--border-input)",
              borderRadius: 99,
              fontSize: 13,
              outline: "none",
              fontFamily: "var(--font-body)",
              background: "#fff",
            }}
          >
            <option value="all">All Vendors</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      }
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>
          Loading marketplace vendors…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
          No vendors match your search
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1.2fr 1fr 1.2fr 1.3fr",
              gap: 12,
              padding: "10px 24px",
              background: "var(--surface-sunken)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-faint)",
            }}
          >
            <div>Vendor Store</div>
            <div>Zone / Area</div>
            <div>Rating & ETA</div>
            <div>Verification</div>
            <div>Actions</div>
          </div>
          {filtered.map((vendor, idx) => (
            <div
              key={vendor.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2.5fr 1.2fr 1fr 1.2fr 1.3fr",
                gap: 12,
                alignItems: "center",
                padding: "14px 24px",
                borderTop: "1px solid var(--border-subtle)",
                background: idx % 2 === 0 ? "transparent" : "var(--surface-sunken)",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: 6 }}>
                  {vendor.name}
                  {vendor.verified && (
                    <span style={{ color: "var(--text-brand)", fontSize: 13 }} title="Verified Merchant">✓</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>
                  {vendor.tagline || vendor.description || `ID: ${vendor.id}`}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{vendor.area}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                ⭐ {vendor.rating || 4.8} • {vendor.delivery_mins || 35}m
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: vendor.verified ? "#dcfce7" : "#f1f5f9",
                    color: vendor.verified ? "#166534" : "#64748b",
                  }}
                >
                  {vendor.verified ? "Verified ✓" : "Unverified"}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onToggleVerified(vendor.id, vendor.verified)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `1px solid ${vendor.verified ? "#fecaca" : "var(--border-brand, #009245)"}`,
                    background: vendor.verified ? "#fff0f0" : "var(--surface-lime)",
                    color: vendor.verified ? "#991b1b" : "var(--oj-green-900)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  {vendor.verified ? "Revoke Verification" : "Mark Verified ✓"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );
}

// ── Orders Section ────────────────────────────────────────────────────────────
function OrdersSection({ orders, onStatusChange, loading }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);

  return (
    <SectionCard title={`Platform Orders (${orders.length})`} icon="package" noPad
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
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1.4fr", gap: 12, padding: "10px 24px", background: "var(--surface-sunken)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)" }}>
            <div>Order Ref</div><div>Items & Address</div><div>Total</div><div>Status</div><div>Change Status</div>
          </div>
          {filtered.map((order, idx) => {
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
            const itemCount = (order.items || []).reduce((s, i) => s + (i.qty || 1), 0);
            return (
              <div key={order.id} style={{
                display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1.4fr", gap: 12,
                alignItems: "center", padding: "14px 24px",
                borderTop: "1px solid var(--border-subtle)",
                background: idx % 2 === 0 ? "transparent" : "var(--surface-sunken)",
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-heading)", fontFamily: "monospace" }}>#{String(order.id).slice(-8)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{dateStr}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>{itemCount} item(s) • {order.phone}</div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.delivery_address}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-brand)" }}>
                  ₦{(order.total || 0).toLocaleString("en-NG")}
                </div>
                <div><StatusPill status={order.status} /></div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    style={{ padding: "5px 8px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ── Vendor Applications Section (Approvals Queue) ─────────────────────────────
function ApplicationsSection({ applications, onApprove, onReject, loading, processingId }) {
  const [filter, setFilter] = useState("under_review");

  const counts = {
    all: applications.length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = applications.filter((a) => filter === "all" || a.status === filter);

  return (
    <SectionCard
      title={`Vendor Approval Queue (${counts.under_review} pending)`}
      icon="badge-check"
      noPad
      action={
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "under_review", label: "Pending Review", count: counts.under_review },
            { id: "all", label: "All", count: counts.all },
            { id: "approved", label: "Approved", count: counts.approved },
            { id: "rejected", label: "Rejected", count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 99,
                border: filter === tab.id ? "1px solid var(--surface-brand)" : "1px solid var(--border-subtle)",
                background: filter === tab.id ? "var(--surface-brand)" : "#fff",
                color: filter === tab.id ? "var(--text-on-brand)" : "var(--text-muted)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      }
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-faint)", fontSize: 14 }}>
          Loading vendor applications…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: "var(--surface-lime)", color: "var(--oj-green-900)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Icon name="check" size={24} />
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-heading)", marginBottom: 4 }}>No applications found</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>There are currently no vendor submissions in this view.</div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.6fr",
              gap: 12,
              padding: "10px 24px",
              background: "var(--surface-sunken)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-faint)",
            }}
          >
            <div>Shop & Applicant</div>
            <div>Zone / Area</div>
            <div>Category</div>
            <div>Status</div>
            <div>Approval Actions</div>
          </div>
          {filtered.map((app) => {
            const isProcessing = processingId === app.id;
            const appliedDate = app.created_at
              ? new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "Recent";

            return (
              <div
                key={app.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.6fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "16px 24px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)" }}>
                    {app.shop_name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span>{app.owner_name}</span>
                    <span>•</span>
                    <a href={`tel:${app.phone}`} style={{ color: "var(--text-brand)", textDecoration: "none", fontWeight: 600 }}>
                      📞 {app.phone}
                    </a>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    Applied {appliedDate}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{app.area}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{app.category}</div>
                <div>
                  <StatusPill status={app.status} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {app.status === "under_review" && (
                    <>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onApprove(app)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: "var(--surface-lime)",
                          color: "var(--oj-green-900)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          opacity: isProcessing ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                      >
                        ✓ {isProcessing ? "Approving…" : "Approve & Launch"}
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                          if (window.confirm(`Reject vendor application for "${app.shop_name}"?`)) {
                            onReject(app.id);
                          }
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                          background: "#fff0f0",
                          color: "#991b1b",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: isProcessing ? "not-allowed" : "pointer",
                        }}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {app.status === "approved" && (
                    <span style={{ fontSize: 12, color: "#166534", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="check" size={14} /> Store Live & Verified
                    </span>
                  )}
                  {app.status === "rejected" && (
                    <span style={{ fontSize: 12, color: "#991b1b", fontWeight: 600 }}>
                      ✕ Application Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ── Nav Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: "layout-grid" },
  { id: "applications", label: "Vendor Approvals", icon: "badge-check" },
  { id: "vendors", label: "Active Vendors", icon: "store" },
  { id: "users", label: "Users", icon: "user" },
  { id: "orders", label: "Orders", icon: "package" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export function AdminDashboard({ currentUser, onNav, onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [applications, setApplications] = useState([]);
  const [processingAppId, setProcessingAppId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState({ stats: true, users: true, orders: true, apps: true, vendors: true });

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
    getAllVendors().then((data) => {
      setVendors(data);
      setLoading((l) => ({ ...l, vendors: false }));
    });
  }, []);

  // Clear toast automatically after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleRoleChange = useCallback(async (userId, role) => {
    const result = await updateProfileRole(userId, role);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      setToast({ tone: "success", message: `User role updated to ${role}.` });
    }
  }, []);

  const handleSuspend = useCallback(async (userId) => {
    const result = await suspendProfile(userId);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: "suspended" } : u)));
      setToast({ tone: "danger", message: "User account suspended." });
    }
  }, []);

  const handleRestore = useCallback(async (userId) => {
    const result = await restoreProfile(userId);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: "customer" } : u)));
      setToast({ tone: "success", message: "User account restored." });
    }
  }, []);

  const handleOrderStatusChange = useCallback(async (orderId, status) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      setToast({ tone: "success", message: `Order #${String(orderId).slice(-6)} set to ${status}.` });
    }
  }, []);

  const handleApproveVendor = useCallback(async (app) => {
    setProcessingAppId(app.id);
    const result = await approveVendorApplication(app);
    setProcessingAppId(null);
    if (result.success) {
      setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: "approved" } : a)));
      // Add or update in vendors list
      if (result.vendor) {
        setVendors((prev) => [result.vendor, ...prev.filter((v) => v.id !== result.vendor.id)]);
      }
      // If applicant exists, update users state
      if (app.applicant_id) {
        setUsers((prev) =>
          prev.map((u) => (u.id === app.applicant_id ? { ...u, role: "vendor" } : u))
        );
      }
      setToast({
        tone: "success",
        message: `🎉 Approved "${app.shop_name}"! Store is live and applicant account elevated to Vendor.`,
      });
    } else {
      setToast({ tone: "danger", message: `Failed to approve vendor: ${result.error || "Unknown error"}` });
    }
  }, []);

  const handleRejectVendor = useCallback(async (appId, notes = "") => {
    setProcessingAppId(appId);
    const result = await rejectVendorApplication(appId, notes);
    setProcessingAppId(null);
    if (result.success) {
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: "rejected" } : a)));
      setToast({ tone: "danger", message: "Vendor application marked as rejected." });
    } else {
      setToast({ tone: "danger", message: `Failed to reject application: ${result.error}` });
    }
  }, []);

  const handleToggleVerified = useCallback(async (vendorId, currentVerified) => {
    const result = await toggleVendorVerification(vendorId, currentVerified);
    if (result.success) {
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, verified: !currentVerified } : v))
      );
      setToast({
        tone: "success",
        message: `Vendor verification ${!currentVerified ? "enabled ✓" : "revoked"}.`,
      });
    } else {
      setToast({ tone: "danger", message: `Failed to update verification: ${result.error}` });
    }
  }, []);

  const pendingApps = applications.filter((a) => a.status === "under_review").length;

  return (
    <DashShell
      title="Super-Admin Dashboard"
      subtitle={`Logged in as ${currentUser?.fullName || "Administrator"} — Ojawa Marketplace`}
      toast={toast}
      onClearToast={() => setToast(null)}
    >
      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 0, overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
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
              whiteSpace: "nowrap",
              transition: "color 0.15s ease",
            }}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
            {tab.id === "applications" && pendingApps > 0 && (
              <span style={{ background: "var(--color-danger, #dc2626)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 6px", marginLeft: 4 }}>
                {pendingApps}
              </span>
            )}
          </button>
        ))}
        <div style={{ marginLeft: "auto", alignSelf: "center" }}>
          <button
            type="button"
            onClick={onSignOut}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}
          >
            <Icon name="x" size={13} />
            Sign Out
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          {/* Platform Stat Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard icon="wallet" label="Platform Revenue" value={`₦${(stats?.revenue || 0).toLocaleString("en-NG")}`} tone="brand" />
            <StatCard icon="package" label="Total Orders" value={stats?.orders ?? orders.length} tone="lime" onClick={() => setActiveTab("orders")} />
            <StatCard icon="user" label="Total Users" value={stats?.users ?? users.length} tone="neutral" onClick={() => setActiveTab("users")} />
            <StatCard icon="store" label="Active Vendors" value={vendors.length} tone="accent" onClick={() => setActiveTab("vendors")} />
            <StatCard
              icon="badge-check"
              label="Pending Approvals"
              value={pendingApps}
              tone={pendingApps > 0 ? "danger" : "neutral"}
              onClick={() => setActiveTab("applications")}
            />
          </div>

          {/* Quick Review Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
            {/* Recent Orders */}
            <SectionCard title="Recent Orders" icon="package" noPad action={
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>View all</Button>
            }>
              {orders.slice(0, 5).map((order, idx) => (
                <div key={order.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "12px 20px", borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)", fontFamily: "monospace" }}>#{String(order.id).slice(-8)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{order.phone} • {order.delivery_address}</div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-brand)" }}>₦{(order.total || 0).toLocaleString("en-NG")}</div>
                    <StatusPill status={order.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && !loading.orders && (
                <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No orders yet</div>
              )}
            </SectionCard>

            {/* Pending Approvals quick-review */}
            <SectionCard
              title={`Pending Vendor Approvals (${pendingApps})`}
              icon="badge-check"
              noPad
              action={
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("applications")}>View queue</Button>
              }
            >
              {applications.filter((a) => a.status === "under_review").slice(0, 5).map((app, idx) => (
                <div key={app.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "14px 20px", borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-heading)" }}>{app.shop_name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{app.owner_name} • {app.area} ({app.category})</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      title="Approve & Launch Store"
                      onClick={() => handleApproveVendor(app)}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "var(--surface-lime)", color: "var(--oj-green-900)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      type="button"
                      title="Reject Application"
                      onClick={() => {
                        if (window.confirm(`Reject vendor application for ${app.shop_name}?`)) {
                          handleRejectVendor(app.id);
                        }
                      }}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#991b1b", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {pendingApps === 0 && !loading.apps && (
                <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: "var(--surface-lime)", color: "var(--oj-green-900)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <Icon name="check" size={20} />
                  </div>
                  <div>All vendor applications reviewed</div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* VENDOR APPROVALS TAB */}
      {activeTab === "applications" && (
        <ApplicationsSection
          applications={applications}
          onApprove={handleApproveVendor}
          onReject={handleRejectVendor}
          loading={loading.apps}
          processingId={processingAppId}
        />
      )}

      {/* ACTIVE VENDORS TAB */}
      {activeTab === "vendors" && (
        <VendorsSection
          vendors={vendors}
          onToggleVerified={handleToggleVerified}
          loading={loading.vendors}
        />
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <UsersSection
          users={users}
          onRoleChange={handleRoleChange}
          onSuspend={handleSuspend}
          onRestore={handleRestore}
          loading={loading.users}
        />
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <OrdersSection orders={orders} onStatusChange={handleOrderStatusChange} loading={loading.orders} />
      )}
    </DashShell>
  );
}
