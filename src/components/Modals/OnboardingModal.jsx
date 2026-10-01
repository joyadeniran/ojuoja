import React, { useState } from "react";
import { Icon } from "../../../components/brand/Icon.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { upsertProfile } from "../../lib/supabase.js";

/**
 * OnboardingModal
 *
 * Shown immediately after Google OAuth when profile.onboarding_complete === false.
 * Non-dismissable — the user MUST complete this to use the app.
 *
 * Steps:
 *   1. Choose role (Customer / Vendor / Dispatch Rider)
 *   2. Role-specific details
 *   3. Review & confirm
 *
 * On submit: upsertProfile() sets role, vendor_store_name, phone,
 *            preferred_area, onboarding_complete = true
 *
 * Props:
 *   userId  {string}   — Supabase auth user id
 *   name    {string}   — Name from Google
 *   onDone  {(profile) => void} — Called when profile is saved; parent reloads user
 */

const AREAS = ["Ita Elewa", "Sabo", "Agric", "Igbogbo", "Ebute"];
const CATEGORIES = ["Food & Snacks", "Groceries", "Drinks", "Mixed"];

const ROLES = [
  {
    value: "customer",
    label: "Customer",
    icon: "shopping-bag",
    description: "Shop from verified Ikorodu vendors and track your orders.",
    color: "var(--oj-green-900)",
    bg: "var(--surface-lime)",
  },
  {
    value: "vendor",
    label: "Vendor / Seller",
    icon: "store",
    description: "List your food or grocery store and receive orders.",
    color: "var(--text-on-brand)",
    bg: "var(--surface-brand)",
  },
  {
    value: "dispatch",
    label: "Dispatch Rider",
    icon: "bike",
    description: "Pick up and deliver orders across Ikorodu zones.",
    color: "var(--text-on-accent)",
    bg: "var(--surface-accent)",
  },
];

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 99,
            background: i <= current ? "var(--surface-brand)" : "var(--oj-grey-200)",
            transition: "all 0.25s ease",
          }}
        />
      ))}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)", marginBottom: 6, display: "block" }}>
      {children}{required && <span style={{ color: "#e53e3e", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 14px",
        border: "1.5px solid var(--border-input)",
        borderRadius: 10,
        fontSize: 14,
        fontFamily: "var(--font-body)",
        outline: "none",
        color: "var(--text-heading)",
        background: "#fff",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--color-brand)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border-input)")}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 14px",
        border: "1.5px solid var(--border-input)",
        borderRadius: 10,
        fontSize: 14,
        fontFamily: "var(--font-body)",
        outline: "none",
        color: value ? "var(--text-heading)" : "var(--text-faint)",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export function OnboardingModal({ userId, name, onDone }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredArea, setPreferredArea] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeArea, setStoreArea] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleZone = (zone) => {
    setZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const canProceedStep1 = role !== "";

  const canProceedStep2 = (() => {
    if (role === "vendor") return storeName.trim() && storeArea && storeCategory && phone.trim();
    if (role === "dispatch") return phone.trim() && zones.length > 0;
    return true; // customer — all optional
  })();

  const handleNext = () => {
    setError("");
    if (step < 2) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const updates = {
      role,
      phone: phone || null,
      preferred_area: role === "customer" ? preferredArea || null : null,
      vendor_store_name: role === "vendor" ? storeName.trim() : null,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    };

    const result = await upsertProfile(userId, updates);

    setLoading(false);

    if (!result) {
      setError("Something went wrong saving your profile. Please try again.");
      return;
    }

    onDone(result);
  };

  return (
    // Full-screen overlay — non-dismissable
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "36px 32px 32px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "var(--surface-brand)",
              color: "var(--text-on-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: 22,
              fontFamily: "var(--font-display)",
              fontWeight: 800,
            }}
          >
            O
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text-heading)",
              margin: "0 0 4px",
            }}
          >
            Welcome to Ojawa{name ? `, ${name.split(" ")[0]}` : ""}!
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Quick setup — tell us how you'll use Ojawa.
          </p>
        </div>

        <StepIndicator current={step} total={3} />

        {/* ── STEP 1: Choose Role ─────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)", margin: "0 0 16px", textAlign: "center" }}>
              I am joining Ojawa as a…
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    border: `2px solid ${role === r.value ? "var(--color-brand)" : "var(--border-subtle)"}`,
                    borderRadius: 14,
                    background: role === r.value ? "var(--surface-lime)" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: r.bg,
                      color: r.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={r.icon} size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)", marginBottom: 2 }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {r.description}
                    </div>
                  </div>
                  {role === r.value && (
                    <div style={{ marginLeft: "auto", color: "var(--color-brand)" }}>
                      <Icon name="check-circle" size={22} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceedStep1}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Role-specific details ──────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)", margin: 0, textAlign: "center" }}>
              {role === "vendor" ? "Set up your store" : role === "dispatch" ? "Your rider profile" : "A little about you"}
            </p>

            {/* ── Customer fields ── */}
            {role === "customer" && (
              <>
                <div>
                  <FieldLabel>Phone number <span style={{ fontWeight: 400, color: "var(--text-faint)" }}>(optional)</span></FieldLabel>
                  <TextInput value={phone} onChange={setPhone} placeholder="08012345678" type="tel" />
                </div>
                <div>
                  <FieldLabel>Preferred delivery area <span style={{ fontWeight: 400, color: "var(--text-faint)" }}>(optional)</span></FieldLabel>
                  <SelectInput value={preferredArea} onChange={setPreferredArea} options={AREAS} placeholder="Select area…" />
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  You can update these anytime from your dashboard.
                </p>
              </>
            )}

            {/* ── Vendor fields ── */}
            {role === "vendor" && (
              <>
                <div>
                  <FieldLabel required>Store / Kitchen name</FieldLabel>
                  <TextInput value={storeName} onChange={setStoreName} placeholder="e.g. Mama T Stores" />
                </div>
                <div>
                  <FieldLabel required>Zone / Area</FieldLabel>
                  <SelectInput value={storeArea} onChange={setStoreArea} options={AREAS} placeholder="Select your zone…" />
                </div>
                <div>
                  <FieldLabel required>Category</FieldLabel>
                  <SelectInput value={storeCategory} onChange={setStoreCategory} options={CATEGORIES} placeholder="Select category…" />
                </div>
                <div>
                  <FieldLabel required>Phone number</FieldLabel>
                  <TextInput value={phone} onChange={setPhone} placeholder="08012345678" type="tel" />
                </div>
                <div
                  style={{
                    background: "var(--surface-lime)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "var(--oj-green-900)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Next step:</strong> An Ojawa coordinator will contact you to complete physical verification before your store goes live.
                </div>
              </>
            )}

            {/* ── Dispatch fields ── */}
            {role === "dispatch" && (
              <>
                <div>
                  <FieldLabel required>Phone number</FieldLabel>
                  <TextInput value={phone} onChange={setPhone} placeholder="08012345678" type="tel" />
                </div>
                <div>
                  <FieldLabel required>Coverage zones</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                    {AREAS.map((zone) => (
                      <button
                        key={zone}
                        onClick={() => toggleZone(zone)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 99,
                          border: `2px solid ${zones.includes(zone) ? "var(--color-brand)" : "var(--border-subtle)"}`,
                          background: zones.includes(zone) ? "var(--surface-lime)" : "#fff",
                          color: zones.includes(zone) ? "var(--oj-green-900)" : "var(--text-muted)",
                          fontWeight: zones.includes(zone) ? 700 : 500,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {zones.includes(zone) && "✓ "}{zone}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#c0392b", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button variant="primary" onClick={handleNext} disabled={!canProceedStep2}>
                Review
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review & Confirm ────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-heading)", margin: 0, textAlign: "center" }}>
              Confirm your details
            </p>

            <div
              style={{
                border: "1.5px solid var(--border-subtle)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {[
                { label: "Name", value: name || "—" },
                { label: "Role", value: role === "dispatch" ? "Dispatch Rider" : role === "vendor" ? "Vendor" : "Customer" },
                role === "vendor" && { label: "Store Name", value: storeName },
                (role === "vendor" || role === "dispatch") && { label: role === "vendor" ? "Zone" : "Zones", value: role === "vendor" ? storeArea : zones.join(", ") },
                role === "vendor" && { label: "Category", value: storeCategory },
                phone && { label: "Phone", value: phone },
                role === "customer" && preferredArea && { label: "Area", value: preferredArea },
              ]
                .filter(Boolean)
                .map((row, i) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 18px",
                      borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none",
                      background: i % 2 === 0 ? "#fff" : "var(--surface-sunken)",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: "var(--text-heading)", fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                  </div>
                ))}
            </div>

            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#c0392b", fontSize: 13 }}>
                {error}
              </div>
            )}

            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
              You can update your profile anytime from your dashboard.
            </p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="ghost" onClick={handleBack} disabled={loading}>Back</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving…" : "Get started →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
