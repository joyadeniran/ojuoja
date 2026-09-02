import React, { useState, useMemo } from "react";
import { Breadcrumb } from "../../components/navigation/Breadcrumb.jsx";
import { SectionHeading } from "../../components/core/SectionHeading.jsx";
import { ProductCard } from "../../components/commerce/ProductCard.jsx";
import { Tag } from "../../components/core/Tag.jsx";
import { Select } from "../../components/forms/Select.jsx";
import { Checkbox } from "../../components/forms/Checkbox.jsx";
import { Pagination } from "../../components/navigation/Pagination.jsx";
import { Button } from "../../components/core/Button.jsx";
import { VendorCard } from "../../components/commerce/VendorCard.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { PRODUCTS, VENDORS, AREAS, CATEGORIES } from "../data/marketData.js";

export function CategoryScreen({
  onNav,
  onAdd,
  onSelectProduct,
  initialCategory = null,
  initialArea = "All",
  searchQuery = "",
  onToggleFavourite,
  favourites = [],
}) {
  const [page, setPage] = useState(1);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [selectedArea, setSelectedArea] = useState(initialArea || "All");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [sortBy, setSortBy] = useState("Most popular");

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (verifiedOnly && !p.verified) return false;
      if (selectedArea !== "All" && p.area !== selectedArea) return false;
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesVendor = p.vendor.toLowerCase().includes(q);
        const matchesArea = p.area.toLowerCase().includes(q);
        if (!matchesName && !matchesVendor && !matchesArea) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "Price: low to high") return a.price - b.price;
      if (sortBy === "Price: high to low") return b.price - a.price;
      if (sortBy === "Top rated") return b.rating - a.rating;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0); // Most popular
    });
  }, [verifiedOnly, freeDeliveryOnly, selectedArea, selectedCategory, searchQuery, sortBy]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetFilters = () => {
    setVerifiedOnly(false);
    setFreeDeliveryOnly(false);
    setSelectedArea("All");
    setSelectedCategory("all");
    setPage(1);
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : activeCategoryObj
    ? activeCategoryObj.title
    : "All Ikorodu Market Goods";

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
          { label: activeCategoryObj ? activeCategoryObj.title : "Groceries & Food" },
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
          title={categoryTitle}
          subtitle={
            activeCategoryObj
              ? activeCategoryObj.description
              : "Hand-picked vegetables, provisions, snacks and drinks from verified Ikorodu stalls."
          }
        />
        <div style={{ minWidth: 200 }}>
          <Select
            label="Sort by"
            options={["Most popular", "Price: low to high", "Price: high to low", "Top rated"]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 36,
          alignItems: "start",
        }}
      >
        {/* Filters Sidebar */}
        <aside
          style={{
            maxWidth: 260,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "sticky",
            top: 96,
          }}
        >
          {/* Department Filter */}
          <div>
            <div
              style={{
                font: "600 11px/1 var(--font-body)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 12,
              }}
            >
              Department
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setPage(1);
                }}
                style={{
                  textAlign: "left",
                  background: "transparent",
                  border: 0,
                  fontSize: 14,
                  cursor: "pointer",
                  color: selectedCategory === "all" ? "var(--text-brand)" : "var(--text-body)",
                  fontWeight: selectedCategory === "all" ? 600 : 400,
                  padding: "4px 0",
                }}
              >
                All Departments
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setPage(1);
                  }}
                  style={{
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    fontSize: 14,
                    cursor: "pointer",
                    color: selectedCategory === c.id ? "var(--text-brand)" : "var(--text-body)",
                    fontWeight: selectedCategory === c.id ? 600 : 400,
                    padding: "4px 0",
                  }}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Verification & Policies */}
          <div>
            <div
              style={{
                font: "600 11px/1 var(--font-body)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 12,
              }}
            >
              Filters
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Checkbox
                checked={verifiedOnly}
                onChange={(val) => {
                  setVerifiedOnly(val);
                  setPage(1);
                }}
              >
                Verified vendors only
              </Checkbox>
              <Checkbox
                checked={freeDeliveryOnly}
                onChange={(val) => {
                  setFreeDeliveryOnly(val);
                  setPage(1);
                }}
              >
                Free delivery eligible
              </Checkbox>
            </div>
          </div>

          {/* Area Filter */}
          <div>
            <div
              style={{
                font: "600 11px/1 var(--font-body)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 12,
              }}
            >
              Ikorodu Neighborhood
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AREAS.map((a) => (
                <Tag
                  key={a}
                  selected={selectedArea === a}
                  onClick={() => {
                    setSelectedArea(a);
                    setPage(1);
                  }}
                >
                  {a}
                </Tag>
              ))}
            </div>
          </div>

          {/* Top Vendor Spotlight */}
          <div style={{ paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
            <div
              style={{
                font: "600 11px/1 var(--font-body)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 12,
              }}
            >
              Featured Vendor
            </div>
            <VendorCard
              name="Ojuoja Fresh"
              area="Agric"
              verified
              rating={4.8}
              deliveryMins={40}
            />
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div style={{ flex: 1 }}>
          {displayedProducts.length === 0 ? (
            <div style={{ padding: "40px 0" }}>
              <EmptyState
                title="Nothing matches those filters"
                message="Try clearing your filters or selecting a different Ikorodu neighborhood."
                action={
                  <Button size="sm" onClick={resetFilters}>
                    Clear all filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 24,
                }}
              >
                {displayedProducts.map((p) => (
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

              {totalPages > 1 && (
                <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
                  <Pagination page={page} pages={totalPages} onChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
