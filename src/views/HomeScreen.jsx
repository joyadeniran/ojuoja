import React, { useState } from "react";
import { Button } from "../../components/core/Button.jsx";
import { SectionHeading } from "../../components/core/SectionHeading.jsx";
import { CategoryCard } from "../../components/commerce/CategoryCard.jsx";
import { ProductCard } from "../../components/commerce/ProductCard.jsx";
import { VendorCard } from "../../components/commerce/VendorCard.jsx";
import { Accordion } from "../../components/navigation/Accordion.jsx";
import { PatternPanel } from "../../components/brand/PatternPanel.jsx";
import { DeliveryNote } from "../../components/commerce/DeliveryNote.jsx";
import { Tag } from "../../components/core/Tag.jsx";
import { CATEGORIES, PRODUCTS, VENDORS, FAQS, PHOTO_BASE } from "../data/marketData.js";

export function HomeScreen({ onNav, onAdd, onSelectProduct, onToggleFavourite, favourites = [] }) {
  const [activeTab, setActiveTab] = useState("All");

  const filterMapping = {
    "All": null,
    "Food & Snacks": "food-snacks",
    "Groceries": "groceries",
    "Drinks": "drinks",
  };

  const filteredTrending = PRODUCTS.filter((p) => {
    const cat = filterMapping[activeTab];
    return !cat || p.category === cat;
  }).slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <PatternPanel variant="lime" padded={false}>
        <div
          style={{
            maxWidth: "var(--layout-max)",
            margin: "0 auto",
            padding: "0 var(--layout-gutter-resp, 16px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            alignItems: "center",
            minHeight: 460,
            gap: 24,
          }}
        >
          <div style={{ paddingTop: "clamp(32px, 5vw, 64px)", paddingBottom: "clamp(24px, 4vw, 64px)" }}>
            <span
              style={{
                display: "inline-block",
                font: "600 11px/1 var(--font-body)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--oj-green-900)",
                marginBottom: 14,
                padding: "4px 10px",
                background: "rgba(255,255,255,.6)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              Verified Ikorodu Marketplace
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(32px, 5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-.015em",
                color: "var(--oj-green-900)",
                margin: 0,
              }}
            >
              Your Next Craving<br />
              is Just Around the<br />
              Corner.
            </h1>
            <p
              style={{
                marginTop: 18,
                fontSize: 16,
                color: "var(--oj-green-900)",
                maxWidth: "42ch",
                lineHeight: 1.5,
              }}
            >
              From hidden local gems to your daily essentials, discover the best of Ikorodu's
              vendors, delivered straight to you in 35–60 minutes.
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                badgeIcon="shopping-basket"
                size="lg"
                onClick={() => onNav("category")}
              >
                Shop Now!
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNav("vendors")}
              >
                Browse vendors
              </Button>
            </div>
            <div style={{ marginTop: 24 }}>
              <DeliveryNote>
                <strong>Free delivery</strong> on all baskets over ₦10,000
              </DeliveryNote>
            </div>
          </div>
          <div
            style={{
              alignSelf: "end",
              display: "flex",
              justifyContent: "center",
              paddingBottom: 24,
            }}
          >
            <img
              src={PHOTO_BASE + "hero-jollof-hand.jpg"}
              alt="Authentic Nigerian Jollof Rice in takeaway pack from verified Ikorodu kitchen"
              style={{
                width: "100%",
                maxWidth: 480,
                borderRadius: "var(--radius-lg)",
                display: "block",
                boxShadow: "0 18px 36px rgba(8,69,37,0.16)",
                border: "4px solid #ffffff",
              }}
            />
          </div>
        </div>
      </PatternPanel>

      {/* Closer Than You Think Section */}
      <section style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "var(--layout-section-y-resp, 48px) var(--layout-gutter-resp, 16px) 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "start",
          }}
        >
          <SectionHeading
            title={
              <>
                Closer Than
                <br />
                You Think
              </>
            }
          />
          <div>
            <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: "52ch", lineHeight: 1.6, margin: 0 }}>
              Explore new flavors, trends, and essentials from verified vendors across Ikorodu.
              Every shop on Ojawa is physically verified before opening for online orders.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Button badgeIcon="shopping-basket" onClick={() => onNav("category")}>
                Shop Now!
              </Button>
              <DeliveryNote>Hand-checked fresh produce guaranteed</DeliveryNote>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: 24,
          }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.title}
              description={cat.description}
              image={cat.image}
              onClick={() => onNav("category", { categoryId: cat.id })}
            />
          ))}
        </div>
      </section>

      {/* Trending in Ikorodu Grid */}
      <section style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "var(--layout-section-y-resp, 48px) var(--layout-gutter-resp, 16px) 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <SectionHeading
            level={2}
            title={
              <>
                Trending in Ikorodu
                <br />
                this week
              </>
            }
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "100%", overflowX: "auto" }}>
            {["All", "Food & Snacks", "Groceries", "Drinks"].map((tab) => (
              <Tag
                key={tab}
                selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tag>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
            gap: 24,
          }}
        >
          {filteredTrending.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              was={p.was}
              vendor={p.vendor}
              verified={p.verified}
              rating={p.rating}
              image={p.image}
              flag={p.flag}
              favourite={favourites.includes(p.id)}
              onFavourite={(e) => {
                e.stopPropagation();
                onToggleFavourite(p.id);
              }}
              onAdd={(e) => {
                e.stopPropagation();
                onAdd(p);
              }}
              onClick={() => onSelectProduct(p)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </section>

      {/* Deals Banner & Promo */}
      <section style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "var(--layout-section-y-resp, 48px) var(--layout-gutter-resp, 16px) 0", textAlign: "center" }}>
        <SectionHeading
          align="center"
          title={
            <>
              Get the best grocery
              <br />
              deals within Ikorodu.
            </>
          }
          subtitle="One basket, multiple vendors, one fast delivery fee. Order before 6pm for same-day drop-off."
        />
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <Button badgeIcon="shopping-basket" size="lg" onClick={() => onNav("category")}>
            Shop Now!
          </Button>
        </div>
      </section>

      {/* Decorative Promo Card */}
      <div style={{ maxWidth: "var(--layout-max)", margin: "48px auto 0", padding: "0 var(--layout-gutter-resp, 16px)" }}>
        <PatternPanel
          variant="green"
          padded={false}
          style={{
            borderRadius: "var(--radius-lg)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            minHeight: 280,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "clamp(16px, 4vw, 32px)",
              left: "clamp(16px, 4vw, 32px)",
              right: "clamp(16px, 4vw, 32px)",
              color: "#fff",
              maxWidth: 360,
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--oj-yellow-500)",
              }}
            >
              Fresh Every Morning
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 3.5vw, 28px)",
                margin: "8px 0 0",
                lineHeight: 1.15,
              }}
            >
              Skip the Distance, Find the Flavor.
            </h3>
          </div>
          <img
            src={PHOTO_BASE + "promo-basket-green.png"}
            alt="Market produce bundle"
            style={{ maxHeight: 240, width: "auto", objectFit: "contain" }}
          />
        </PatternPanel>
      </div>

      {/* Verified Vendors Row */}
      <section style={{ maxWidth: "var(--layout-max)", margin: "var(--layout-section-y-resp, 48px) auto 0", padding: "0 var(--layout-gutter-resp, 16px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <SectionHeading
            level={2}
            title={
              <>
                Verified Ikorodu
                <br />
                Neighborhood Vendors
              </>
            }
            subtitle="Inspected stalls and licensed kitchens in your local community."
          />
          <Button variant="secondary" onClick={() => onNav("vendors")}>
            View all vendors
          </Button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 24,
          }}
        >
          {VENDORS.slice(0, 3).map((v) => (
            <div
              key={v.id}
              onClick={() => onNav("category", { area: v.area })}
              style={{ cursor: "pointer" }}
            >
              <VendorCard
                name={v.name}
                area={v.area}
                verified={v.verified}
                rating={v.rating}
                deliveryMins={v.deliveryMins}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "var(--layout-section-y-resp, 48px) var(--layout-gutter-resp, 16px) 0" }}>
        <SectionHeading
          align="center"
          title={
            <>
              Frequently Asked
              <br />
              Questions
            </>
          }
          subtitle="Everything you need to know about shopping, delivery zones, and verification."
        />
        <div style={{ marginTop: 36 }}>
          <Accordion items={FAQS} defaultOpen={0} />
        </div>
      </section>
    </main>
  );
}
