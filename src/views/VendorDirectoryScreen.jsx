import React, { useState } from "react";
import { Breadcrumb } from "../../components/navigation/Breadcrumb.jsx";
import { SectionHeading } from "../../components/core/SectionHeading.jsx";
import { VendorCard } from "../../components/commerce/VendorCard.jsx";
import { Tag } from "../../components/core/Tag.jsx";
import { Button } from "../../components/core/Button.jsx";
import { Card } from "../../components/core/Card.jsx";
import { VENDORS, AREAS } from "../data/marketData.js";

export function VendorDirectoryScreen({ onNav, onOpenVendorModal }) {
  const [selectedArea, setSelectedArea] = useState("All");

  const filteredVendors = VENDORS.filter((v) => {
    if (selectedArea !== "All" && v.area !== selectedArea) return false;
    return true;
  });

  return (
    <main style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "32px 32px 96px" }}>
      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "#home",
            onClick: (e) => {
              e.preventDefault();
              onNav("home");
            },
          },
          { label: "Verified Vendors" },
        ]}
      />

      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <SectionHeading
          title={
            <>
              Ikorodu Verified
              <br />
              Vendors Directory
            </>
          }
          subtitle="Every stall, local grocery, and hot food kitchen is physically inspected and verified."
        />
        <Button
          badgeIcon="store"
          variant="primary"
          onClick={onOpenVendorModal}
        >
          Register Your Shop
        </Button>
      </div>

      {/* Area Filter Tags */}
      <div style={{ marginTop: 28, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span
          style={{
            font: "600 11px/1 var(--font-body)",
            letterSpacing: ".09em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            marginRight: 8,
          }}
        >
          Filter by Zone:
        </span>
        {AREAS.map((a) => (
          <Tag
            key={a}
            selected={selectedArea === a}
            onClick={() => setSelectedArea(a)}
          >
            {a}
          </Tag>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} style={{ display: "flex", flexDirection: "column" }}>
            <Card tone="flat" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <VendorCard
                name={vendor.name}
                area={vendor.area}
                verified={vendor.verified}
                rating={vendor.rating}
                deliveryMins={vendor.deliveryMins}
              />
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-body)",
                  lineHeight: 1.55,
                  margin: 0,
                  flex: 1,
                }}
              >
                {vendor.description}
              </p>
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text-faint)" }}>
                  Zone: <strong>{vendor.area}</strong>
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  badgeIcon="shopping-basket"
                  onClick={() => onNav("category", { area: vendor.area })}
                >
                  Shop Vendor
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Merchant CTA Card */}
      <div
        style={{
          marginTop: 64,
          padding: 36,
          background: "var(--surface-lime)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              color: "var(--oj-green-900)",
              margin: "0 0 8px",
            }}
          >
            Run a shop or kitchen in Ikorodu?
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "var(--oj-green-800)",
              margin: 0,
              maxWidth: "48ch",
            }}
          >
            Reach thousands of buyers in Ita Elewa, Agric, Sabo, and Ebute. Free onboarding with dedicated riders.
          </p>
        </div>
        <Button badgeIcon="store" size="lg" onClick={onOpenVendorModal}>
          Become an Ojuoja Vendor!
        </Button>
      </div>
    </main>
  );
}
