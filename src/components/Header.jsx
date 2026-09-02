import React, { useState } from "react";
import { Logo } from "../../components/brand/Logo.jsx";
import { Icon } from "../../components/brand/Icon.jsx";
import { IconButton } from "../../components/core/IconButton.jsx";
import { CATEGORIES } from "../data/marketData.js";

export function Header({
  onNav,
  cartCount = 0,
  active = "home",
  onOpenAbout,
  onOpenVendorModal,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}) {
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (catId) => {
    setCatMenuOpen(false);
    setMobileMenuOpen(false);
    onNav("category", { categoryId: catId });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "#fff",
        borderBottom: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--layout-max-wide)",
          margin: "0 auto",
          height: "var(--layout-header-h)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          position: "relative",
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNav("home");
          }}
          style={{ lineHeight: 0, textDecoration: "none", display: "flex", alignItems: "center" }}
          aria-label="Ojuoja Homepage"
        >
          <Logo height={28} />
        </a>

        {/* Categories Dropdown Toggle */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setCatMenuOpen(!catMenuOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 38,
              padding: "0 16px",
              border: 0,
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-lime)",
              color: "var(--oj-green-900)",
              font: "600 13px/1 var(--font-body)",
              cursor: "pointer",
              transition: "var(--transition-control)",
            }}
          >
            <Icon name="layout-grid" size={15} />
            <span>Categories</span>
            <Icon
              name="chevron-down"
              size={14}
              style={{
                transform: catMenuOpen ? "rotate(180deg)" : "none",
                transition: "transform 180ms ease",
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {catMenuOpen && (
            <>
              <div
                onClick={() => setCatMenuOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 45 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 48,
                  left: 0,
                  zIndex: 50,
                  background: "#fff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px 0",
                  minWidth: 220,
                }}
              >
                <div
                  style={{
                    padding: "8px 16px",
                    font: "600 11px/1 var(--font-body)",
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: "var(--text-faint)",
                  }}
                >
                  Shop by Department
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      background: "transparent",
                      border: 0,
                      font: "500 14px/1 var(--font-body)",
                      color: "var(--text-heading)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-brand-soft)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span>{cat.title}</span>
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{cat.count} items</span>
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "6px 0" }} />
                <button
                  type="button"
                  onClick={() => {
                    setCatMenuOpen(false);
                    onNav("category");
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: "transparent",
                    border: 0,
                    font: "600 13px/1 var(--font-body)",
                    color: "var(--text-brand)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>View full marketplace</span>
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: 20,
            font: "500 13px/1 var(--font-body)",
          }}
          className="oj-desktop-nav"
        >
          <a
            href="#vendors"
            onClick={(e) => {
              e.preventDefault();
              onNav("vendors");
            }}
            style={{
              color: active === "vendors" ? "var(--oj-green-900)" : "var(--text-body)",
              fontWeight: active === "vendors" ? "600" : "500",
              textDecoration: "none",
            }}
          >
            Vendors
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              onOpenAbout();
            }}
            style={{ color: "var(--text-body)", textDecoration: "none" }}
          >
            About Ojuoja
          </a>
          <a
            href="#become-vendor"
            onClick={(e) => {
              e.preventDefault();
              onOpenVendorModal();
            }}
            style={{
              color: "var(--text-brand)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Become a Vendor
          </a>
        </nav>

        {/* Search Field */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: 380,
            marginLeft: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              height: 42,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-input)",
              background: "var(--surface-sunken)",
              padding: "0 14px",
              gap: 10,
              transition: "var(--transition-control)",
            }}
          >
            <Icon name="search" size={16} style={{ color: "var(--text-faint)" }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search akara, corn, garri..."
              style={{
                flex: 1,
                border: 0,
                background: "transparent",
                font: "400 14px var(--font-body)",
                color: "var(--text-heading)",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--text-faint)",
                  padding: 2,
                  display: "flex",
                }}
                aria-label="Clear search"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Header Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconButton
            icon="shopping-basket"
            variant="solid"
            label="Basket"
            count={cartCount}
            onClick={() => onNav("basket")}
          />
          <span
            title="Ojuoja Marketplace pattern"
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-sm)",
              background: "var(--pattern-market-bars)",
              backgroundColor: "#fff",
              display: "inline-block",
              boxShadow: "var(--shadow-xs)",
            }}
          />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              background: "#fff",
              cursor: "pointer",
            }}
            className="oj-mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "#fff",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              font: "600 11px/1 var(--font-body)",
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
            }}
          >
            Menu
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNav("home");
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "500 15px var(--font-body)",
              color: "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNav("category");
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "500 15px var(--font-body)",
              color: "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            Shop All Groceries & Food
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNav("vendors");
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "500 15px var(--font-body)",
              color: "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            Browse Ikorodu Vendors
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "500 15px var(--font-body)",
              color: "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            About Ojuoja
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenVendorModal();
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "600 15px var(--font-body)",
              color: "var(--oj-green-700)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            Become a Vendor (Apply Now)
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .oj-desktop-nav { display: flex !important; }
          .oj-mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
