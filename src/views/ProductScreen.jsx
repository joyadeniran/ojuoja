import React, { useState } from "react";
import { Breadcrumb } from "../../components/navigation/Breadcrumb.jsx";
import { Button } from "../../components/core/Button.jsx";
import { Badge } from "../../components/core/Badge.jsx";
import { Rating } from "../../components/core/Rating.jsx";
import { QuantityStepper } from "../../components/forms/QuantityStepper.jsx";
import { Tabs } from "../../components/navigation/Tabs.jsx";
import { Accordion } from "../../components/navigation/Accordion.jsx";
import { DeliveryNote } from "../../components/commerce/DeliveryNote.jsx";
import { VendorCard } from "../../components/commerce/VendorCard.jsx";
import { ProductCard } from "../../components/commerce/ProductCard.jsx";
import { Icon } from "../../components/brand/Icon.jsx";
import { PRODUCTS, VENDORS } from "../data/marketData.js";

const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

export function ProductScreen({
  product,
  onNav,
  onAdd,
  onSelectProduct,
  onToggleFavourite,
  favourites = [],
}) {
  const p = product || PRODUCTS[0];
  const [activeImage, setActiveImage] = useState(p.image);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Details");

  // Synchronize active image if product changes
  React.useEffect(() => {
    setActiveImage(p.image);
    setQty(1);
  }, [p]);

  const vendorObj = VENDORS.find((v) => v.name === p.vendor) || {
    name: p.vendor,
    area: p.area || "Ikorodu Central",
    verified: p.verified,
    rating: p.rating,
    deliveryMins: 35,
  };

  const moreProducts = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);

  const isFav = favourites.includes(p.id);

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
          {
            label: p.category === "food-snacks" ? "Food & Snacks" : p.category === "drinks" ? "Drinks" : "Groceries",
            href: "#category",
            onClick: (e) => {
              e.preventDefault();
              onNav("category", { categoryId: p.category });
            },
          },
          { label: p.name },
        ]}
      />

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 56,
          alignItems: "start",
        }}
      >
        {/* Left Column: Media Stage */}
        <div>
          <div
            style={{
              background: "var(--pattern-lime-stripe)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 420,
              padding: 24,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <img
              src={activeImage}
              alt={p.name}
              style={{
                maxWidth: "85%",
                maxHeight: "85%",
                objectFit: "contain",
                filter: "drop-shadow(0 12px 24px rgba(8,69,37,0.15))",
                transition: "transform 200ms ease",
              }}
            />
          </div>

          {/* Thumbnails Gallery */}
          {p.thumbnails && p.thumbnails.length > 1 && (
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {p.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(thumb)}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "var(--radius-media)",
                    overflow: "hidden",
                    background: "var(--surface-card)",
                    border:
                      activeImage === thumb
                        ? "2px solid var(--border-brand)"
                        : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <img
                    src={thumb}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {p.verified && (
              <Badge tone="soft" icon="badge-check">
                Verified vendor
              </Badge>
            )}
            <Badge tone="lime" icon="bike">
              {vendorObj.deliveryMins || 35} mins
            </Badge>
            {p.flag && <Badge tone={p.flag.tone || "danger"}>{p.flag.label}</Badge>}
          </div>

          <h1
            style={{
              marginTop: 16,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.06,
              letterSpacing: "-.015em",
              color: "var(--text-heading)",
              margin: "16px 0 0",
            }}
          >
            {p.name}
          </h1>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <Rating value={p.rating} count={p.reviewsCount || 120} />
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Sold by <strong>{p.vendor}</strong> ({vendorObj.area})
            </span>
          </div>

          <div style={{ marginTop: 20, display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 34,
                color: "var(--text-brand)",
              }}
            >
              {naira(p.price)}
            </span>
            {p.was && (
              <span style={{ fontSize: 17, color: "var(--text-faint)", textDecoration: "line-through" }}>
                {naira(p.was)}
              </span>
            )}
            {p.unit && (
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/ {p.unit}</span>
            )}
          </div>

          <p
            style={{
              marginTop: 16,
              fontSize: 15,
              color: "var(--text-body)",
              maxWidth: "48ch",
              lineHeight: 1.6,
            }}
          >
            {p.description}
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <QuantityStepper value={qty} onChange={setQty} unit={p.unit ? p.unit.split(" ")[0] : "qty"} />
            <Button
              badgeIcon="shopping-basket"
              size="lg"
              onClick={() => {
                onAdd(p, qty);
              }}
            >
              Add to Basket
            </Button>
            <Button
              variant={isFav ? "primary" : "secondary"}
              leadingIcon="heart"
              onClick={() => onToggleFavourite(p.id)}
            >
              {isFav ? "Saved" : "Save"}
            </Button>
          </div>

          <div style={{ marginTop: 22 }}>
            <DeliveryNote>
              <strong>Free delivery</strong> within Ikorodu on baskets over ₦10,000
            </DeliveryNote>
          </div>

          {/* Details & Specs Tabs */}
          <div style={{ marginTop: 36 }}>
            <Tabs
              variant="underline"
              items={["Details", "Vendor", "Reviews"]}
              value={activeTab}
              onChange={setActiveTab}
            />

            <div style={{ paddingTop: 20 }}>
              {activeTab === "Details" && (
                <Accordion
                  numbered={false}
                  defaultOpen={0}
                  items={
                    p.details || [
                      {
                        q: "Product source & freshness",
                        a: "Hand-picked and sourced from verified Ikorodu local suppliers this morning.",
                      },
                      {
                        q: "Safe Handling & Packaging",
                        a: "Packaged securely in hygienic food-grade wrapping to maintain optimum freshness.",
                      },
                      {
                        q: "Inspection on delivery",
                        a: "You may inspect all fresh produce before the dispatch rider leaves your gate.",
                      },
                    ]
                  }
                />
              )}

              {activeTab === "Vendor" && (
                <div>
                  <VendorCard
                    name={vendorObj.name}
                    area={vendorObj.area}
                    verified={vendorObj.verified}
                    rating={vendorObj.rating}
                    deliveryMins={vendorObj.deliveryMins}
                  />
                  <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-body)", lineHeight: 1.6 }}>
                    {vendorObj.description ||
                      "Trusted neighborhood vendor partnered with Ojuoja to deliver authentic fresh products straight to your door."}
                  </p>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {(p.reviews || [
                    { author: "Bimpe A.", text: "Very fresh and arrived on time. Rider was polite.", rating: 5, area: "Ita Elewa" },
                    { author: "Tunde O.", text: "Good quality, nicely packaged. Satisfied.", rating: 4.5, area: "Agric" },
                  ]).map((rev, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 16,
                        background: "var(--surface-card)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: 14, color: "var(--text-heading)" }}>
                            {rev.author}
                          </strong>
                          {rev.area && (
                            <span style={{ fontSize: 12, color: "var(--text-faint)", marginLeft: 8 }}>
                              ({rev.area})
                            </span>
                          )}
                        </div>
                        <Rating value={rev.rating} size={12} />
                      </div>
                      <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-body)" }}>
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More From This Vendor Recommendation */}
      <div style={{ marginTop: 88 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--text-heading)",
              margin: 0,
            }}
          >
            More essentials you might like
          </h2>
          <Icon name="arrow-right" size={20} style={{ color: "var(--text-brand)" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {moreProducts.map((x) => (
            <ProductCard
              key={x.id}
              name={x.name}
              price={x.price}
              was={x.was}
              vendor={x.vendor}
              verified={x.verified}
              rating={x.rating}
              image={x.image}
              flag={x.flag}
              favourite={favourites.includes(x.id)}
              onFavourite={(e) => {
                e.stopPropagation();
                onToggleFavourite(x.id);
              }}
              onAdd={(e) => {
                e.stopPropagation();
                onAdd(x);
              }}
              onClick={() => onSelectProduct(x)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
