import React, { useRef, useState } from "react";
import { Icon } from "../../components/brand/Icon.jsx";
import { Button } from "../../components/core/Button.jsx";
import { updateMyProfile, uploadAvatar } from "../lib/supabase.js";
import { AREAS } from "../data/marketData.js";

const label = {
  display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-faint)",
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
};
const input = {
  width: "100%", padding: "10px 12px", border: "1px solid var(--border-input)",
  borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box", background: "#fff",
};

/**
 * ProfileCard — shared "my profile" editor used by every role
 * (customer, vendor, dispatch, admin): avatar upload, name, phone, area.
 */
export function ProfileCard({ currentUser, onUpdated }) {
  const [name, setName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [area, setArea] = useState(currentUser?.preferredArea || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null); // { tone, text }
  const fileRef = useRef(null);

  const initials = (currentUser?.fullName || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const flash = (tone, text) => {
    setMsg({ tone, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const save = async () => {
    if (!name.trim()) return flash("danger", "Name cannot be empty.");
    setSaving(true);
    const res = await updateMyProfile({ full_name: name.trim(), phone: phone.trim(), preferred_area: area || null });
    setSaving(false);
    if (!res.success) return flash("danger", res.error || "Could not save profile.");
    onUpdated?.({ fullName: res.data.full_name, phone: res.data.phone, preferredArea: res.data.preferred_area });
    flash("success", "Profile updated");
  };

  const onPickAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const res = await uploadAvatar(file);
    setUploading(false);
    if (!res.success) return flash("danger", res.error || "Upload failed.");
    onUpdated?.({ avatarUrl: res.url });
    flash("success", "Photo updated");
  };

  return (
    <div style={{ padding: 24 }}>
      {msg && (
        <div style={{
          padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600,
          background: msg.tone === "danger" ? "#fff0f0" : "var(--surface-lime)",
          color: msg.tone === "danger" ? "#991b1b" : "var(--oj-green-900)",
        }}>
          {msg.text}
        </div>
      )}
      <div className="oj-profile-row">
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%", background: "var(--surface-brand)", color: "var(--text-on-brand)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700,
            overflow: "hidden", margin: "0 auto 10px",
          }}>
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" style={{ width: 88, height: 88, objectFit: "cover" }} />
            ) : initials}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickAvatar} style={{ display: "none" }} />
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Change photo"}
          </Button>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="oj-form-grid">
            <div>
              <label style={label} htmlFor="pf-name">Full name</label>
              <input id="pf-name" style={input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={label} htmlFor="pf-phone">Phone number</label>
              <input id="pf-phone" style={input} value={phone} inputMode="tel" onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label style={label} htmlFor="pf-email">Email</label>
              <input id="pf-email" style={{ ...input, background: "var(--oj-grey-50)", color: "var(--text-muted)" }} value={currentUser?.email || ""} disabled />
            </div>
            <div>
              <label style={label} htmlFor="pf-area">Delivery zone</label>
              <select id="pf-area" style={input} value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Not set</option>
                {AREAS.filter((a) => a !== "All").map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Button variant="primary" size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, textTransform: "capitalize",
              padding: "4px 10px", borderRadius: 99, background: "var(--surface-lime)", color: "var(--oj-green-900)",
            }}>
              <Icon name={currentUser?.role === "vendor" ? "store" : "user"} size={12} />
              {currentUser?.role || "customer"} account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
