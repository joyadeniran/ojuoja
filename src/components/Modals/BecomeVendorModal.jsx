import React, { useState } from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Input } from "../../../components/forms/Input.jsx";
import { Select } from "../../../components/forms/Select.jsx";
import { AREAS } from "../../data/marketData.js";

export function BecomeVendorModal({ open, onClose, onSubmitSuccess }) {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Ita Elewa");
  const [category, setCategory] = useState("Groceries & Fresh Produce");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shopName || !phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShopName("");
      setOwnerName("");
      setPhone("");
      onClose();
      if (onSubmitSuccess) {
        onSubmitSuccess({
          shopName,
          ownerName,
          phone,
          area,
          category,
        });
      }
    }, 1200);
  };

  const areaOptions = AREAS.filter((a) => a !== "All");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Become a Verified Ojawa Vendor"
      footer={
        submitted ? null : (
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", width: "100%" }}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              badgeIcon="badge-check"
              onClick={handleSubmit}
              disabled={!shopName || !phone}
            >
              Submit Application
            </Button>
          </div>
        )
      }
    >
      {submitted ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--oj-green-50)",
              color: "var(--oj-green-700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
            }}
          >
            ✓
          </div>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-heading)" }}>
            Application Submitted!
          </h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
            Our Ikorodu inspection agent will call {phone} within 2 working days to verify your shop
            and catalogue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-body)", lineHeight: 1.5 }}>
            Join Ikorodu's leading marketplace. Every shop is checked by hand before opening for orders.
          </p>

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
            options={[
              "Groceries & Fresh Produce",
              "Food & Hot Snacks",
              "Chilled Drinks & Beverages",
              "Grains, Tubers & Soup Ingredients",
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div
            style={{
              padding: "12px 14px",
              background: "var(--surface-lime-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              fontSize: 13,
              color: "var(--oj-green-900)",
            }}
          >
            <strong>Verification requirement:</strong> Please have a valid ID and proof of shop location ready for your physical or video onboarding check.
          </div>
        </form>
      )}
    </Dialog>
  );
}
