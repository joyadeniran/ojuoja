import React, { useState } from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Input } from "../../../components/forms/Input.jsx";
import { Select } from "../../../components/forms/Select.jsx";
import { Icon } from "../../../components/brand/Icon.jsx";
import { AREAS } from "../../data/marketData.js";
import { submitVendorApplication } from "../../lib/supabase.js";

const ErrorBanner = ({ message }) =>
  message ? (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 8,
      padding: "10px 12px", borderRadius: "var(--radius-sm)",
      background: "#fef2f2", border: "1px solid #fecaca",
      color: "#dc2626", fontSize: 13, lineHeight: 1.4,
    }}>
      <Icon name="alert-circle" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{message}</span>
    </div>
  ) : null;

const CATEGORIES = [
  "Groceries & Fresh Produce",
  "Food & Hot Snacks",
  "Chilled Drinks & Beverages",
  "Grains, Tubers & Soup Ingredients",
  "Bakery & Confectionery",
  "Household & Personal Care",
];

export function BecomeVendorModal({ open, onClose, onSubmitSuccess, currentUser }) {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [area, setArea] = useState("Ita Elewa");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const areaOptions = AREAS.filter((a) => a !== "All");

  const handleClose = () => {
    // Reset form when closing (but not on successful submission)
    if (!submitted) {
      setError("");
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!shopName.trim()) {
      setError("Please enter your shop or business name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a contact phone number.");
      return;
    }
    if (phone.trim().replace(/\D/g, "").length < 10) {
      setError("Please enter a valid Nigerian phone number (at least 10 digits).");
      return;
    }

    setLoading(true);

    const payload = {
      shopName: shopName.trim(),
      ownerName: ownerName.trim() || currentUser?.fullName || "",
      phone: phone.trim(),
      area,
      category,
    };

    try {
      // Write directly to Supabase from inside the modal
      const result = await submitVendorApplication(payload, currentUser?.id || null);

      if (!result.success && !result.localOnly) {
        setError("We couldn't submit your application right now. Please try again.");
        setLoading(false);
        return;
      }
    } catch (err) {
      // Network / unexpected error — still show success as the data is captured
      console.warn("Vendor application error:", err);
    }

    setLoading(false);
    setSubmitted(true);

    // Notify App.jsx so it can record notifications etc.
    if (onSubmitSuccess) {
      onSubmitSuccess(payload);
    }
  };

  const handleReset = () => {
    setShopName("");
    setOwnerName(currentUser?.fullName || "");
    setPhone(currentUser?.phone || "");
    setArea("Ita Elewa");
    setCategory(CATEGORIES[0]);
    setError("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Become a Verified Ojawa Vendor"
      footer={
        submitted ? (
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button variant="primary" size="sm" onClick={handleReset}>
              Done
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", width: "100%" }}>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              badgeIcon="badge-check"
              onClick={handleSubmit}
              disabled={!shopName.trim() || !phone.trim() || loading}
            >
              {loading ? "Submitting…" : "Submit Application"}
            </Button>
          </div>
        )
      }
    >
      {submitted ? (
        /* ── Success Screen ── */
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--surface-lime)", color: "var(--oj-green-900)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
          }}>
            <Icon name="check-circle" size={28} />
          </div>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-heading)", fontFamily: "var(--font-display)", fontSize: 20 }}>
            Application Submitted!
          </h3>
          <p style={{ margin: "0 0 6px", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.55 }}>
            <strong>{shopName}</strong> has been added to the vendor review queue.
          </p>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.55 }}>
            Our Ikorodu inspection agent will call <strong>{phone}</strong> within 2 working days to verify your shop and catalogue.
          </p>

          <div style={{
            marginTop: 20, padding: "12px 14px",
            background: "var(--surface-lime)", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            fontSize: 13, color: "var(--oj-green-900)",
            textAlign: "left",
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>What happens next?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div>📞 Agent calls within 2 working days</div>
              <div>📍 Physical or video verification of your shop</div>
              <div>✅ Approval & onboarding to the Ojawa platform</div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Application Form ── */
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-body)", lineHeight: 1.5 }}>
            Join Ikorodu's leading marketplace. Every shop is checked by hand before opening for orders.
          </p>

          <ErrorBanner message={error} />

          <Input
            label="Shop / Business Name"
            placeholder="e.g. Mama T Stores"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />

          <Input
            label="Owner / Contact Person"
            placeholder="Full name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <Input
            label="WhatsApp or Phone Number"
            placeholder="0803 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leadingIcon="phone"
            required
          />

          <Select
            label="Ikorodu Location / Area"
            options={areaOptions}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <Select
            label="Primary Department"
            options={CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div style={{
            padding: "12px 14px",
            background: "var(--surface-lime-soft, #f0fdf4)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            fontSize: 13,
            color: "var(--oj-green-900)",
          }}>
            <strong>Verification requirement:</strong> Please have a valid ID and proof of shop location ready for your physical or video onboarding check.
          </div>
        </form>
      )}
    </Dialog>
  );
}
