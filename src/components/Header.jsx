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
  onOpenAuth,
  onSignOut,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  currentUser = null,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}) {
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
        className="oj-header-inner"
        style={{
          maxWidth: "var(--layout-max-wide)",
          margin: "0 auto",
          height: "var(--layout-header-h)",
          padding: "0 var(--layout-gutter-resp, 16px)",
          display: "flex",
          alignItems: "center",
          gap: 16,
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
          style={{ lineHeight: 0, textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}
          aria-label="Ojawa Homepage"
        >
          <Logo height={28} />
        </a>

        {/* Categories Dropdown Toggle */}
        <div className="oj-categories-wrapper" style={{ position: "relative" }}>
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
            About Ojawa
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

        {/* Search Field (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="oj-header-search-desktop"
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          <IconButton
            icon="shopping-basket"
            variant="solid"
            label="Basket"
            count={cartCount}
            onClick={() => onNav("basket")}
          />
          {/* Activity & Notifications (Vendors, Dispatch, Admin) */}
          <IconButton
            icon="bell"
            variant="outline"
            label="Activity & Notifications"
            count={unreadNotificationsCount}
            onClick={onOpenNotifications}
            title="Vendors, Dispatch & Admin Notifications"
          />

          {/* Login / User Account Button */}
          {currentUser ? (
            /* ─── Logged-in user dropdown ─── */
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="oj-login-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 38,
                  padding: "0 14px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border-brand)",
                  background: "var(--surface-brand-soft)",
                  color: "var(--text-brand)",
                  font: "600 13px/1 var(--font-body)",
                  cursor: "pointer",
                  transition: "var(--transition-control)",
                  boxShadow: "var(--shadow-xs)",
                }}
                aria-label={`Account: ${currentUser.fullName}`}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt=""
                    style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <Icon name="user" size={16} />
                )}
                <span className="oj-login-text">{currentUser.fullName.split(" ")[0]}</span>
                <Icon
                  name="chevron-down"
                  size={13}
                  style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    onClick={() => setUserMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 45 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 46,
                      right: 0,
                      zIndex: 50,
                      background: "#fff",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "var(--shadow-lg)",
                      minWidth: 200,
                      padding: "8px 0",
                    }}
                  >
                    <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ font: "600 13px var(--font-body)", color: "var(--text-heading)" }}>
                        {currentUser.fullName}
                      </div>
                      <div style={{ font: "400 12px var(--font-body)", color: "var(--text-muted)", marginTop: 2 }}>
                        {currentUser.email || currentUser.phone}
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 6,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--surface-lime)",
                          color: "var(--oj-green-900)",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        <Icon name={currentUser.role === "vendor" ? "store" : currentUser.role === "dispatch" ? "bike" : "user"} size={11} />
                        {currentUser.role}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onNav) onNav("dashboard");
                      }}
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
                        gap: 8,
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-brand-soft)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Icon name="layout-dashboard" size={14} style={{ color: "var(--text-brand)" }} />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 16px",
                        background: "transparent",
                        border: 0,
                        font: "500 14px/1 var(--font-body)",
                        color: "var(--color-danger, #dc2626)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Icon name="log-out" size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ─── Guest login button ─── */
            <button
              type="button"
              onClick={onOpenAuth}
              className="oj-login-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 38,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--border-subtle)",
                background: "#fff",
                color: "var(--text-heading)",
                font: "600 13px/1 var(--font-body)",
                cursor: "pointer",
                transition: "var(--transition-control)",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-brand)";
                e.currentTarget.style.background = "var(--surface-brand-soft)";
                e.currentTarget.style.color = "var(--text-brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "var(--text-heading)";
              }}
              aria-label="Login or Signup"
            >
              <Icon name="user" size={16} />
              <span className="oj-login-text">Log In</span>
            </button>
          )}

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

      {/* Mobile Search Bar (Only shown on mobile < 860px) */}
      <div className="oj-header-search-mobile">
        <form onSubmit={handleSearch} style={{ width: "100%" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              height: 38,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-input)",
              background: "var(--surface-sunken)",
              padding: "0 14px",
              gap: 10,
            }}
          >
            <Icon name="search" size={15} style={{ color: "var(--text-faint)" }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search akara, corn, garri..."
              style={{
                flex: 1,
                border: 0,
                background: "transparent",
                font: "400 13px var(--font-body)",
                color: "var(--text-heading)",
                outline: "none",
                width: "100%",
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
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="oj-header-drawer"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "#fff",
            padding: "16px var(--layout-gutter-resp, 16px) 32px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
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
            About Ojawa
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
          <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "4px 0" }} />
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNav("dashboard");
              }}
              style={{
                textAlign: "left",
                border: 0,
                background: "transparent",
                font: "600 15px var(--font-body)",
                color: "var(--text-brand)",
                cursor: "pointer",
                padding: "6px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon name="layout-dashboard" size={16} />
              <span>My Dashboard</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentUser) {
                if (onSignOut) onSignOut();
              } else {
                onOpenAuth();
              }
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "600 15px var(--font-body)",
              color: currentUser ? "var(--color-danger, #dc2626)" : "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name={currentUser ? "log-out" : "user"} size={16} />
            <span>{currentUser ? `Sign Out (${currentUser.fullName.split(" ")[0]})` : "Log In or Sign Up"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenNotifications();
            }}
            style={{
              textAlign: "left",
              border: 0,
              background: "transparent",
              font: "600 15px var(--font-body)",
              color: "var(--text-heading)",
              cursor: "pointer",
              padding: "6px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="bell" size={16} />
            <span>Notifications (Vendors, Dispatch & Admin)</span>
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  background: "var(--color-danger)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: "var(--radius-pill)",
                  padding: "1px 6px",
                  marginLeft: "auto",
                }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 861px) {
          .oj-desktop-nav { display: flex !important; }
          .oj-mobile-menu-btn { display: none !important; }
          .oj-header-inner { height: var(--layout-header-h) !important; }
          .oj-header-search-mobile { display: none !important; }
          .oj-categories-wrapper { display: inline-flex !important; }
          .oj-header-search-desktop { display: flex !important; }
          .oj-login-btn { display: inline-flex !important; }
        }
        @media (max-width: 860px) {
          .oj-desktop-nav { display: none !important; }
          .oj-categories-wrapper { display: none !important; }
          .oj-header-search-desktop { display: none !important; }
          .oj-login-btn { display: none !important; }
          .oj-header-inner { height: 60px !important; }
          .oj-header-search-mobile {
            display: block !important;
            padding: 0 var(--layout-gutter-resp, 16px) 10px !important;
          }
        }
        @media (max-width: 600px) {
          .oj-login-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}
