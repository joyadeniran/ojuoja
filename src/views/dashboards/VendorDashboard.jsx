import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { ProfileCard } from "../../components/ProfileCard.jsx";
import { refreshMarket } from "../../lib/market.js";
import {
  getMyVendor,
  updateVendorProfile,
  getVendorOrders,
  computeVendorStats,
  computeSalesSeries,
  updateOrderStatus,
  getVendorStoreSettings,
  updateVendorStoreSettings,
  getVendorProducts,
  saveVendorProduct,
  deleteVendorProduct,
  uploadMedia,
  getVendorWallet,
  getPayoutAccount,
  savePayoutAccount,
  requestWithdrawal,
  getMyWithdrawals,
} from "../../lib/supabase.js";

const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");

// ── Shared primitives ─────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid var(--border-input)", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box", background: "#fff" };

function Field({ label, children, span2 }) {
  return (
    <div className={span2 ? "oj-span-2" : undefined}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function DashShell({ title, subtitle, right, children }) {
  return (
    <div className="oj-dash-wrap">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>{title}</h1>
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
  };
  const t = themes[tone] || themes.brand;
  return (
    <div style={{ background: t.bg, color: t.color, borderRadius: 16, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: "clamp(20px, 4.5vw, 26px)", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1, overflowWrap: "anywhere" }}>{value}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, action, noPad, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && <Icon name={icon} size={18} style={{ color: "var(--text-brand)" }} />}
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: noPad ? 0 : 20 }}>{children}</div>
    </div>
  );
}

function Empty({ icon = "check-circle", title, text }) {
  return (
    <div style={{ padding: 36, textAlign: "center" }}>
      <Icon name={icon} size={34} style={{ color: "var(--text-brand)", marginBottom: 10 }} />
      <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>{title}</div>
      {text && <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{text}</div>}
    </div>
  );
}

const STATUS_COLORS = {
  pending: { background: "#fef3c7", color: "#92400e" },
  completed: { background: "#dcfce7", color: "#166534" },
  paid: { background: "#dcfce7", color: "#166534" },
  cancelled: { background: "#fee2e2", color: "#991b1b" },
  rejected: { background: "#fee2e2", color: "#991b1b" },
  in_progress: { background: "#dbeafe", color: "#1e40af" },
};
function StatusPill({ status }) {
  return (
    <span style={{ ...(STATUS_COLORS[status] || STATUS_COLORS.pending), fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "capitalize", whiteSpace: "nowrap" }}>
      {(status || "pending").replace("_", " ")}
    </span>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div
        role="switch" aria-checked={value} tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange(!value)}
        style={{ width: 44, height: 24, borderRadius: 12, background: value ? "var(--surface-brand)" : "var(--oj-grey-200)", position: "relative", transition: "background 0.2s ease", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "left 0.2s ease" }} />
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-heading)" }}>{label}</span>
    </label>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────
function OrderRow({ order, idx, vendorName, onStatus, busy }) {
  const myItems = (order.items || []).filter((i) => (i.vendor || "").toLowerCase() === vendorName.toLowerCase());
  const myTotal = myItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const next = order.status === "pending" ? { to: "in_progress", label: "Accept" } : order.status === "in_progress" ? { to: "completed", label: "Mark done" } : null;
  return (
    <div style={{ borderTop: idx > 0 ? "1px solid var(--border-subtle)" : "none" }}>
      <div className="oj-order-row">
        <div style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "monospace" }}>
          #{String(order.id).padStart(5, "0")}
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
            {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-heading)", marginBottom: 2 }}>
            {myItems.map((i) => `${i.qty}× ${i.name}`).join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{order.delivery_address} · {order.phone}</div>
          {order.payment_status === "paid" && <div style={{ fontSize: 11, color: "#166534", fontWeight: 700, marginTop: 2 }}>✓ Paid online</div>}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)", textAlign: "right" }}>{naira(myTotal)}</div>
        <StatusPill status={order.status} />
      </div>
      {onStatus && (next || order.status === "pending") && (
        <div style={{ display: "flex", gap: 8, padding: "0 24px 14px", flexWrap: "wrap" }}>
          {next && <Button variant="primary" size="sm" disabled={busy} onClick={() => onStatus(order.id, next.to)}>{next.label}</Button>}
          {order.status === "pending" && (
            <Button variant="ghost" size="sm" disabled={busy} onClick={() => window.confirm("Cancel this order?") && onStatus(order.id, "cancelled")}>Decline</Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sales chart ───────────────────────────────────────────────────────────────
function SalesChart({ series }) {
  const max = Math.max(1, ...series.map((s) => s.revenue));
  const total = series.reduce((s, d) => s + d.revenue, 0);
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
        Last 7 days: <strong style={{ color: "var(--text-heading)" }}>{naira(total)}</strong> from {series.reduce((s, d) => s + d.orders, 0)} orders
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(6px, 2vw, 14px)", height: 150 }}>
        {series.map((d) => (
          <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end", minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600 }}>{d.revenue ? naira(d.revenue).replace(/,000$/, "k") : ""}</div>
            <div title={`${d.label}: ${naira(d.revenue)}`} style={{ width: "100%", maxWidth: 44, height: `${Math.max(4, (d.revenue / max) * 100)}%`, borderRadius: "8px 8px 3px 3px", background: d.revenue ? "linear-gradient(180deg, var(--oj-green-500), var(--oj-green-700))" : "var(--oj-grey-200)", transition: "height .4s ease" }} />
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product form (modal) ──────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { id: "groceries", label: "Groceries" },
  { id: "food-snacks", label: "Food & Snacks" },
  { id: "drinks", label: "Drinks" },
];

function ProductModal({ initial, vendor, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? { id: initial.id, name: initial.name, category: initial.category, price: initial.price, was_price: initial.was || "", unit: initial.unit || "", description: initial.description || "", image: initial.image || "", stock: initial.stock ?? "", is_available: initial.is_available !== false }
      : { name: "", category: "groceries", price: "", was_price: "", unit: "", description: "", image: "", stock: "", is_available: true }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    const res = await uploadMedia(file, "products");
    setUploading(false);
    if (!res.success) return setError(res.error);
    setForm((f) => ({ ...f, image: res.url }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await saveVendorProduct(form, vendor);
    setSaving(false);
    if (!res.success) return setError(res.error);
    onSaved(res.data);
  };

  return (
    <div className="oj-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="oj-modal" onSubmit={submit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <strong style={{ fontSize: 17, color: "var(--text-heading)" }}>{initial ? "Edit product" : "Add a product"}</strong>
          <button type="button" aria-label="Close" onClick={onClose} style={{ border: 0, background: "transparent", cursor: "pointer", padding: 4 }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>{error}</div>}

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 96, height: 96, borderRadius: 14, background: "var(--oj-grey-100)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px dashed var(--border-input)" }}>
              {form.image ? <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Icon name="image" size={28} style={{ color: "var(--text-faint)" }} />}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} style={{ display: "none" }} />
              <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : form.image ? "Replace photo" : "Upload photo"}</Button>
              <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>JPG or PNG, up to 5MB</div>
            </div>
          </div>

          <div className="oj-form-grid">
            <Field label="Product name" span2><input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Ijebu garri (2kg bag)" required /></Field>
            <Field label="Category">
              <select style={inputStyle} value={form.category} onChange={set("category")}>
                {CATEGORY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Unit / size"><input style={inputStyle} value={form.unit} onChange={set("unit")} placeholder="e.g. 2kg bag" /></Field>
            <Field label="Price (₦)"><input style={inputStyle} type="number" min="1" inputMode="numeric" value={form.price} onChange={set("price")} required /></Field>
            <Field label="Old price (₦) — optional"><input style={inputStyle} type="number" min="0" inputMode="numeric" value={form.was_price} onChange={set("was_price")} placeholder="Shows a discount tag" /></Field>
            <Field label="Stock — blank = unlimited"><input style={inputStyle} type="number" min="0" inputMode="numeric" value={form.stock} onChange={set("stock")} /></Field>
            <Field label="Visibility">
              <div style={{ paddingTop: 8 }}><Toggle value={form.is_available} onChange={(v) => setForm((f) => ({ ...f, is_available: v }))} label={form.is_available ? "Visible to customers" : "Hidden"} /></div>
            </Field>
            <Field label="Description" span2>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.description} onChange={set("description")} placeholder="What makes it good? How is it packed?" />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving || uploading}>{saving ? "Saving…" : initial ? "Save changes" : "Publish product"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: "layout-grid" },
  { id: "products", label: "Products", icon: "package" },
  { id: "orders", label: "Orders", icon: "list" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "store", label: "Store & Profile", icon: "settings" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export function VendorDashboard({ currentUser, onNav, onSignOut, onProfileUpdated }) {
  const [tab, setTab] = useState("overview");
  const [vendor, setVendor] = useState(null);
  const [vendorLoaded, setVendorLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ is_open: true, opens_at: "08:00", closes_at: "22:00", banner_message: "" });
  const [wallet, setWallet] = useState(null);
  const [payout, setPayout] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [toast, setToast] = useState(null);
  const [busyOrder, setBusyOrder] = useState(false);
  const [productModal, setProductModal] = useState(null); // null | {} (new) | product
  const [savingSettings, setSavingSettings] = useState(false);

  const vendorName = vendor?.name || currentUser?.vendorStoreName || currentUser?.fullName || "My Store";

  const notify = (tone, message) => {
    setToast({ tone, message });
    setTimeout(() => setToast(null), 4500);
  };

  const loadWallet = useCallback(async () => {
    const [w, wd] = await Promise.all([getVendorWallet(), getMyWithdrawals()]);
    setWallet(w);
    setWithdrawals(wd);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const v = await getMyVendor();
      if (!alive) return;
      setVendor(v);
      setVendorLoaded(true);
      const name = v?.name || currentUser?.vendorStoreName || currentUser?.fullName || "";
      const [orderData, settingsData, productData, acct] = await Promise.all([
        getVendorOrders(name),
        v ? getVendorStoreSettings(v.id) : null,
        v ? getVendorProducts(v.id) : [],
        v ? getPayoutAccount(v.id) : null,
      ]);
      if (!alive) return;
      setOrders(orderData);
      setOrdersLoading(false);
      if (settingsData) setSettings(settingsData);
      setProducts(productData);
      setPayout(acct);
      loadWallet();
    })();
    return () => { alive = false; };
  }, [currentUser?.id, loadWallet]);

  const stats = useMemo(() => computeVendorStats(orders, vendorName), [orders, vendorName]);
  const series = useMemo(() => computeSalesSeries(orders, vendorName, 7), [orders, vendorName]);
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "in_progress");

  const handleOrderStatus = async (id, status) => {
    setBusyOrder(true);
    const res = await updateOrderStatus(id, status);
    setBusyOrder(false);
    if (!res.success) return notify("danger", `Could not update order: ${res.error}`);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    notify("success", status === "completed" ? "Order completed — earnings added to your wallet." : "Order updated.");
    if (status === "completed") loadWallet();
  };

  const handleProductSaved = (p) => {
    setProducts((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
    setProductModal(null);
    refreshMarket();
    notify("success", "Product saved — it's now live on the marketplace.");
  };

  const handleToggleProduct = async (p) => {
    const res = await saveVendorProduct({ ...p, was_price: p.was, is_available: !(p.is_available !== false) }, vendor);
    if (!res.success) return notify("danger", res.error);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? res.data : x)));
    refreshMarket();
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await deleteVendorProduct(p.id);
    if (!res.success) return notify("danger", res.error);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    refreshMarket();
    notify("success", "Product deleted.");
  };

  const handleSaveSettings = async () => {
    if (!vendor) return notify("danger", "Your store isn't linked yet.");
    setSavingSettings(true);
    const { vendor_id, owner_id, updated_at, ...editable } = settings;
    const res = await updateVendorStoreSettings(vendor.id, editable);
    setSavingSettings(false);
    notify(res.success ? "success" : "danger", res.success ? "Store settings saved." : res.error);
  };

  const noStore = vendorLoaded && !vendor;

  return (
    <DashShell
      title={`${vendorName}`}
      subtitle="Vendor dashboard — products, orders, earnings and store settings"
      right={
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700, background: settings.is_open ? "var(--surface-lime)" : "#fee2e2", color: settings.is_open ? "var(--oj-green-900)" : "#991b1b" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: settings.is_open ? "var(--oj-green-700)" : "#c0392b" }} />
          {settings.is_open ? "Store Open" : "Store Closed"}
        </div>
      }
    >
      {toast && (
        <div role="status" style={{ marginBottom: 18, padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: toast.tone === "danger" ? "#fff0f0" : "#dcfce7", color: toast.tone === "danger" ? "#991b1b" : "#166534", border: `1px solid ${toast.tone === "danger" ? "#fecaca" : "#86efac"}` }}>
          {toast.message}
        </div>
      )}

      {noStore && (
        <div style={{ marginBottom: 20, padding: "14px 18px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", fontSize: 14, lineHeight: 1.5 }}>
          <strong>Your store isn't linked to your account yet.</strong> Product uploads and wallet need a store record. Ask an admin to re-approve your application, then refresh.
        </div>
      )}

      <div className="oj-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: tab === t.id ? "var(--text-brand)" : "var(--text-muted)", borderBottom: `2px solid ${tab === t.id ? "var(--surface-brand)" : "transparent"}`, marginBottom: -1 }}>
            <Icon name={t.icon} size={15} />
            {t.label}
            {t.id === "orders" && pendingOrders.length > 0 && (
              <span style={{ background: "var(--color-danger, #dc2626)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 6px" }}>{pendingOrders.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <>
          <div className="oj-stat-grid">
            <StatCard icon="package" label="Total Orders" value={stats.totalOrders} tone="brand" />
            <StatCard icon="clock" label="Pending" value={stats.pendingOrders} tone="accent" />
            <StatCard icon="trending-up" label="Sales" value={naira(stats.totalRevenue)} tone="lime" />
            <StatCard icon="wallet" label="Available" value={naira(wallet?.available)} sub="Ready to withdraw" tone="neutral" />
          </div>
          <div className="oj-dash-split">
            <div>
              <SectionCard title="Sales — last 7 days" icon="bar-chart-2"><SalesChart series={series} /></SectionCard>
              <SectionCard title={`Live orders${activeOrders.length ? ` (${activeOrders.length})` : ""}`} icon="zap" noPad>
                {ordersLoading ? <div style={{ padding: 36, textAlign: "center", color: "var(--text-faint)" }}>Loading orders…</div>
                  : activeOrders.length === 0 ? <Empty title="All clear" text="No orders waiting right now." />
                  : activeOrders.map((o, i) => <OrderRow key={o.id} order={o} idx={i} vendorName={vendorName} onStatus={handleOrderStatus} busy={busyOrder} />)}
              </SectionCard>
            </div>
            <div>
              <SectionCard title="Top products" icon="star">
                {stats.topProducts.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: 12 }}>No sales data yet</div> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {stats.topProducts.map((p, i) => (
                      <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "var(--surface-accent)" : "var(--oj-grey-100)", color: i === 0 ? "var(--text-on-accent)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--text-heading)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{p.count} sold</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
              <SectionCard title="At a glance" icon="activity">
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Products live</span><strong>{products.filter((p) => p.is_available !== false).length}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Avg. order value</span><strong>{naira(stats.avgOrderValue)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Completed orders</span><strong>{stats.completedOrders}</strong></div>
                </div>
                <div style={{ marginTop: 16 }}><Button variant="primary" size="sm" onClick={() => { setTab("products"); setProductModal({}); }} disabled={noStore}>+ Add a product</Button></div>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {/* ── PRODUCTS ─────────────────────────────────────────────────────── */}
      {tab === "products" && (
        <SectionCard title={`My products (${products.length})`} icon="package" noPad
          action={<Button variant="primary" size="sm" onClick={() => setProductModal({})} disabled={noStore}>+ Add product</Button>}>
          {products.length === 0 ? (
            <Empty icon="package" title="No products yet" text="Upload your first product with a photo, price and description — it goes live instantly." />
          ) : (
            <div className="oj-product-grid">
              {products.map((p) => (
                <div key={p.id} style={{ border: "1px solid var(--border-subtle)", borderRadius: 14, overflow: "hidden", opacity: p.is_available === false ? 0.65 : 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <div style={{ aspectRatio: "4/3", background: "var(--oj-grey-100)", position: "relative" }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="image" size={28} style={{ color: "var(--text-faint)" }} /></div>}
                    {p.is_available === false && <span style={{ position: "absolute", top: 8, left: 8, background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>HIDDEN</span>}
                    {p.stock === 0 && <span style={{ position: "absolute", top: 8, right: 8, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>SOLD OUT</span>}
                  </div>
                  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.unit || CATEGORY_OPTIONS.find((c) => c.id === p.category)?.label}{p.stock != null ? ` · ${p.stock} in stock` : ""}</div>
                    <div style={{ fontWeight: 700, color: "var(--text-brand)" }}>{naira(p.price)} {p.was ? <s style={{ color: "var(--text-faint)", fontWeight: 400, fontSize: 12 }}>{naira(p.was)}</s> : null}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: "auto", paddingTop: 8, flexWrap: "wrap" }}>
                      <Button size="sm" variant="secondary" onClick={() => setProductModal(p)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleToggleProduct(p)}>{p.is_available === false ? "Show" : "Hide"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(p)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* ── ORDERS ───────────────────────────────────────────────────────── */}
      {tab === "orders" && (
        <SectionCard title={`All orders (${orders.length})`} icon="list" noPad>
          {ordersLoading ? <div style={{ padding: 36, textAlign: "center", color: "var(--text-faint)" }}>Loading orders…</div>
            : orders.length === 0 ? <Empty icon="inbox" title="No orders yet" text="Orders from customers will appear here." />
            : orders.map((o, i) => <OrderRow key={o.id} order={o} idx={i} vendorName={vendorName} onStatus={handleOrderStatus} busy={busyOrder} />)}
        </SectionCard>
      )}

      {/* ── WALLET ───────────────────────────────────────────────────────── */}
      {tab === "wallet" && (
        <WalletTab
          wallet={wallet} payout={payout} withdrawals={withdrawals} vendor={vendor}
          onPayoutSaved={setPayout} onWithdrawn={loadWallet} notify={notify}
        />
      )}

      {/* ── STORE & PROFILE ──────────────────────────────────────────────── */}
      {tab === "store" && (
        <div className="oj-dash-split">
          <div>
            <SectionCard title="My profile" icon="user" noPad>
              <ProfileCard currentUser={currentUser} onUpdated={onProfileUpdated} />
            </SectionCard>
            {vendor && <StoreProfileCard vendor={vendor} onSaved={(v) => { setVendor(v); refreshMarket(); notify("success", "Store profile updated."); }} notify={notify} />}
          </div>
          <div>
            <SectionCard title="Opening hours" icon="clock">
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Toggle value={settings.is_open} onChange={(v) => setSettings((s) => ({ ...s, is_open: v }))} label={settings.is_open ? "Store is open" : "Store is closed"} />
                <div className="oj-form-grid">
                  <Field label="Opens at"><input type="time" style={inputStyle} value={settings.opens_at || ""} onChange={(e) => setSettings((s) => ({ ...s, opens_at: e.target.value }))} /></Field>
                  <Field label="Closes at"><input type="time" style={inputStyle} value={settings.closes_at || ""} onChange={(e) => setSettings((s) => ({ ...s, closes_at: e.target.value }))} /></Field>
                </div>
                <Field label="Banner message"><input style={inputStyle} value={settings.banner_message || ""} onChange={(e) => setSettings((s) => ({ ...s, banner_message: e.target.value }))} placeholder="e.g. Back in stock: Ofada rice!" /></Field>
                <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={savingSettings || noStore}>{savingSettings ? "Saving…" : "Save settings"}</Button>
              </div>
            </SectionCard>
            <button type="button" onClick={onSignOut}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 99, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "var(--color-danger, #dc2626)", cursor: "pointer" }}>
              <Icon name="log-out" size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {productModal && (
        <ProductModal
          initial={productModal.id ? productModal : null}
          vendor={vendor}
          onClose={() => setProductModal(null)}
          onSaved={handleProductSaved}
        />
      )}
    </DashShell>
  );
}

// ── Store public profile ──────────────────────────────────────────────────────
function StoreProfileCard({ vendor, onSaved, notify }) {
  const [form, setForm] = useState({ tagline: vendor.tagline || "", description: vendor.description || "", phone: vendor.phone || "", image_url: vendor.image_url || "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const res = await uploadMedia(file, "stores");
    setUploading(false);
    if (!res.success) return notify("danger", res.error);
    setForm((f) => ({ ...f, image_url: res.url }));
  };

  const save = async () => {
    setSaving(true);
    const res = await updateVendorProfile(vendor.id, form);
    setSaving(false);
    if (!res.success) {
      // phone / image_url columns may not exist before the migration
      return notify("danger", res.error);
    }
    onSaved(res.data);
  };

  return (
    <SectionCard title="Public store page" icon="store">
      <div className="oj-form-grid">
        <Field label="Tagline" span2><input style={inputStyle} value={form.tagline} onChange={set("tagline")} placeholder="Short line customers see under your name" /></Field>
        <Field label="About your store" span2><textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.description} onChange={set("description")} /></Field>
        <Field label="Store phone"><input style={inputStyle} value={form.phone} inputMode="tel" onChange={set("phone")} /></Field>
        <Field label="Store photo">
          <input ref={fileRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {form.image_url && <img src={form.image_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />}
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
          </div>
        </Field>
      </div>
      <div style={{ marginTop: 16 }}><Button variant="primary" size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save store page"}</Button></div>
    </SectionCard>
  );
}

// ── Wallet ────────────────────────────────────────────────────────────────────
function WalletTab({ wallet, payout, withdrawals, vendor, onPayoutSaved, onWithdrawn, notify }) {
  const [acct, setAcct] = useState({ bank_name: payout?.bank_name || "", account_number: payout?.account_number || "", account_name: payout?.account_name || "" });
  const [amount, setAmount] = useState("");
  const [savingAcct, setSavingAcct] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (payout) setAcct({ bank_name: payout.bank_name, account_number: payout.account_number, account_name: payout.account_name });
  }, [payout]);

  const saveAcct = async () => {
    if (!vendor) return notify("danger", "Your store isn't linked yet.");
    setSavingAcct(true);
    const res = await savePayoutAccount(vendor.id, acct);
    setSavingAcct(false);
    if (!res.success) return notify("danger", res.error);
    onPayoutSaved(res.data);
    notify("success", "Payout account saved.");
  };

  const withdraw = async () => {
    const n = Number(amount);
    if (!n || n < 1000) return notify("danger", "Minimum withdrawal is ₦1,000.");
    if (n > (wallet?.available || 0)) return notify("danger", "That's more than your available balance.");
    setWithdrawing(true);
    const res = await requestWithdrawal(n);
    setWithdrawing(false);
    if (!res.success) return notify("danger", res.error);
    setAmount("");
    notify("success", "Withdrawal requested. We'll transfer to your bank account shortly.");
    onWithdrawn();
  };

  const walletMissing = wallet?.error;

  return (
    <>
      {walletMissing && (
        <div style={{ marginBottom: 18, padding: "12px 16px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", fontSize: 13 }}>
          Wallet isn't active yet — run <code>supabase/migration_v3_vendor_payments.sql</code> in the Supabase SQL editor.
        </div>
      )}
      <div className="oj-stat-grid">
        <StatCard icon="wallet" label="Available" value={naira(wallet?.available)} tone="brand" />
        <StatCard icon="clock" label="Pending payout" value={naira(wallet?.pending_withdrawals)} tone="accent" />
        <StatCard icon="check-circle" label="Withdrawn" value={naira(wallet?.withdrawn)} tone="lime" />
        <StatCard icon="trending-up" label="Total earned" value={naira(wallet?.earned)} sub={`after ${wallet?.commission_pct ?? 10}% platform fee`} tone="neutral" />
      </div>

      <div className="oj-dash-split">
        <div>
          <SectionCard title="Withdrawal history" icon="list" noPad>
            {withdrawals.length === 0 ? <Empty icon="wallet" title="No withdrawals yet" text="Earnings from completed orders can be withdrawn to your bank." /> : (
              <div className="oj-table-scroll">
                {withdrawals.map((w, i) => (
                  <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: i ? "1px solid var(--border-subtle)" : "none", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-heading)" }}>{naira(w.amount)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{new Date(w.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} · {w.bank_name} ••{String(w.account_number).slice(-4)}</div>
                      {w.notes && w.status === "rejected" && <div style={{ fontSize: 12, color: "#991b1b" }}>{w.notes}</div>}
                    </div>
                    <StatusPill status={w.status} />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Withdraw funds" icon="arrow-down-circle">
            <Field label="Amount (₦)">
              <input style={inputStyle} type="number" min="1000" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min ₦1,000" />
            </Field>
            <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "8px 0 14px" }}>
              Available: <strong>{naira(wallet?.available)}</strong>
              {wallet?.available > 0 && <button type="button" onClick={() => setAmount(String(wallet.available))} style={{ border: 0, background: "none", color: "var(--text-brand)", fontWeight: 700, cursor: "pointer", marginLeft: 8 }}>Max</button>}
            </div>
            <Button variant="primary" block onClick={withdraw} disabled={withdrawing || !payout}>{withdrawing ? "Requesting…" : "Request withdrawal"}</Button>
            {!payout && <div style={{ fontSize: 12, color: "#92400e", marginTop: 8 }}>Add your bank account below first.</div>}
          </SectionCard>
          <SectionCard title="Payout bank account" icon="landmark">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Bank"><input style={inputStyle} value={acct.bank_name} onChange={(e) => setAcct((a) => ({ ...a, bank_name: e.target.value }))} placeholder="e.g. GTBank" /></Field>
              <Field label="Account number"><input style={inputStyle} value={acct.account_number} inputMode="numeric" maxLength={10} onChange={(e) => setAcct((a) => ({ ...a, account_number: e.target.value.replace(/\D/g, "") }))} placeholder="10 digits" /></Field>
              <Field label="Account name"><input style={inputStyle} value={acct.account_name} onChange={(e) => setAcct((a) => ({ ...a, account_name: e.target.value }))} /></Field>
              <Button variant="secondary" size="sm" onClick={saveAcct} disabled={savingAcct}>{savingAcct ? "Saving…" : "Save account"}</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
