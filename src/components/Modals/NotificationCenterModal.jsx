import React, { useState } from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Badge } from "../../../components/core/Badge.jsx";
import { Icon } from "../../../components/brand/Icon.jsx";

export function NotificationCenterModal({ open, onClose, notifications = [], onClear }) {
  const [filterRole, setFilterRole] = useState("all");

  const filtered = notifications.filter((n) => {
    if (filterRole === "all") return true;
    return n.recipient === filterRole;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Activity & Notifications"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <button
            type="button"
            onClick={onClear}
            style={{
              background: "transparent",
              border: 0,
              color: "var(--text-faint)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Clear all
          </button>
          <Button size="sm" variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Role Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Activity" },
            { id: "vendor", label: "Vendors", icon: "store" },
            { id: "dispatch", label: "Dispatch", icon: "bike" },
            { id: "admin", label: "Admin Ops", icon: "shield-check" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterRole(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                border: filterRole === tab.id ? "1px solid var(--oj-green-700)" : "1px solid var(--border-subtle)",
                background: filterRole === tab.id ? "var(--surface-brand)" : "#fff",
                color: filterRole === tab.id ? "#fff" : "var(--text-body)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "var(--transition-control)",
              }}
            >
              {tab.icon && <Icon name={tab.icon} size={13} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: 14 }}>
              No notifications for this category yet.
            </div>
          ) : (
            filtered.map((item) => {
              const tone = item.recipient === "vendor" ? "lime" : item.recipient === "dispatch" ? "accent" : "soft";
              const icon = item.recipient === "vendor" ? "store" : item.recipient === "dispatch" ? "bike" : "shield-check";
              const roleName = item.recipient === "vendor" ? "Vendor Alert" : item.recipient === "dispatch" ? "Dispatch Rider" : "Platform Admin";

              return (
                <div
                  key={item.id}
                  style={{
                    padding: "12px 16px",
                    background: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <Badge tone={tone} icon={icon}>
                      {roleName}
                    </Badge>
                    <span style={{ fontSize: 11, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                      {item.time || "Just now"}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.35, marginTop: 2 }}>
                    {item.title}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-body)", lineHeight: 1.45 }}>
                    {item.message}
                  </p>
                  {item.meta && (
                    <div style={{ fontSize: 12, color: "var(--text-brand)", fontWeight: 500 }}>
                      {item.meta}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
}
