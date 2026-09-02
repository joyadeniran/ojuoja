import React from "react";
import { Logo } from "../../components/brand/Logo.jsx";

export function Footer({ onNav, onOpenAbout, onOpenVendorModal }) {
  return (
    <footer
      style={{
        background: "var(--surface-brand)",
        color: "#fff",
        paddingTop: 72,
        overflow: "hidden",
        marginTop: 96,
      }}
    >
      <div
        style={{
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }}
      >
        {/* Brand Column */}
        <div style={{ maxWidth: 300 }}>
          <div style={{ marginBottom: 16 }}>
            <Logo variant="white" height={32} />
          </div>
          <p
            style={{
              color: "rgba(255,255,255,.85)",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            From hidden local gems to your daily essentials, discover the best of Ikorodu's
            vendors, delivered straight to you.
          </p>
          <div style={{ marginTop: 20, fontSize: 13, color: "var(--oj-lime-100)" }}>
            Ikorodu, Lagos State, Nigeria
          </div>
        </div>

        {/* Categories */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "var(--oj-lime-100)",
              marginBottom: 16,
            }}
          >
            Categories
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Food & Snacks", "Groceries", "Drinks", "Fresh Vegetables", "Market Grains"].map(
              (cat) => (
                <a
                  key={cat}
                  href="#category"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav("category");
                  }}
                  style={{
                    color: "rgba(255,255,255,.9)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 140ms ease",
                  }}
                >
                  {cat}
                </a>
              )
            )}
          </div>
        </div>

        {/* Delivery Areas */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "var(--oj-lime-100)",
              marginBottom: 16,
            }}
          >
            Delivery Zones
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Ita Elewa", "Agric", "Sabo Market", "Igbogbo", "Ebute", "Ijede Road"].map(
              (area) => (
                <span
                  key={area}
                  style={{
                    color: "rgba(255,255,255,.8)",
                    fontSize: 14,
                  }}
                >
                  {area} • <span style={{ color: "var(--oj-lime-100)", fontSize: 12 }}>35–60m</span>
                </span>
              )
            )}
          </div>
        </div>

        {/* Platform & Community */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "var(--oj-lime-100)",
              marginBottom: 16,
            }}
          >
            Vendors & Support
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="#vendors"
              onClick={(e) => {
                e.preventDefault();
                onNav("vendors");
              }}
              style={{ color: "rgba(255,255,255,.9)", fontSize: 14, textDecoration: "none" }}
            >
              Browse All Vendors
            </a>
            <a
              href="#become-vendor"
              onClick={(e) => {
                e.preventDefault();
                onOpenVendorModal();
              }}
              style={{ color: "rgba(255,255,255,.9)", fontSize: 14, textDecoration: "none" }}
            >
              Become a Verified Vendor
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                onOpenAbout();
              }}
              style={{ color: "rgba(255,255,255,.9)", fontSize: 14, textDecoration: "none" }}
            >
              The Story of Ojú Ọjà
            </a>
            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert("Ojuoja WhatsApp Support: 0800-OJUOJA-IKORODU (Available 7am - 8pm daily)");
              }}
              style={{ color: "rgba(255,255,255,.9)", fontSize: 14, textDecoration: "none" }}
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* Legal and Domain */}
      <div
        style={{
          maxWidth: "var(--layout-max)",
          margin: "48px auto 0",
          padding: "20px 32px 0",
          borderTop: "1px solid var(--border-on-brand)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "rgba(255,255,255,.8)",
        }}
      >
        <span>© 2026 Ojuoja Marketplace. All Rights Reserved.</span>
        <span>www.ojuoja.shop • Hand-verified Ikorodu Vendors</span>
      </div>

      {/* White Wordmark Bleed Background */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <img
          src="/assets/logo-white.svg"
          alt=""
          style={{
            width: "120%",
            maxWidth: 1300,
            marginBottom: -44,
            opacity: 0.85,
            display: "block",
          }}
        />
      </div>
    </footer>
  );
}
