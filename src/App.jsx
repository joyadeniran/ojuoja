import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomeScreen } from "./views/HomeScreen.jsx";
import { CategoryScreen } from "./views/CategoryScreen.jsx";
import { ProductScreen } from "./views/ProductScreen.jsx";
import { BasketScreen } from "./views/BasketScreen.jsx";
import { VendorDirectoryScreen } from "./views/VendorDirectoryScreen.jsx";
import { BecomeVendorModal } from "./components/Modals/BecomeVendorModal.jsx";
import { AboutModal } from "./components/Modals/AboutModal.jsx";
import { Toast } from "../components/feedback/Toast.jsx";
import { PRODUCTS, PHOTO_BASE } from "./data/marketData.js";

const STORAGE_KEY_BASKET = "ojuoja_basket_v1";
const STORAGE_KEY_FAVS = "ojuoja_favs_v1";

const DEFAULT_BASKET = [
  {
    id: "prod-5",
    name: "Ijebu garri (2kg bag)",
    vendor: "Mama T Stores",
    price: 2400,
    qty: 2,
    image: PHOTO_BASE + "prod-greens.png",
  },
  {
    id: "prod-2",
    name: "Bell peppers, mixed (1kg)",
    vendor: "Ojuoja Fresh",
    price: 3200,
    qty: 1,
    image: PHOTO_BASE + "prod-peppers.png",
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [screenParams, setScreenParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);

  // Basket state with localStorage
  const [basket, setBasket] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BASKET);
      return saved ? JSON.parse(saved) : DEFAULT_BASKET;
    } catch {
      return DEFAULT_BASKET;
    }
  });

  // Favourites state with localStorage
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : ["prod-1", "prod-3"];
    } catch {
      return ["prod-1", "prod-3"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BASKET, JSON.stringify(basket));
    } catch {}
  }, [basket]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favourites));
    } catch {}
  }, [favourites]);

  // Handle toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Navigation function
  const nav = (newScreen, params = {}) => {
    setScreen(newScreen);
    setScreenParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    nav("product");
  };

  const handleAddToBasket = (product, quantity = 1) => {
    setBasket((prev) => {
      const idx = prev.findIndex((item) => item.name === product.name);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + quantity };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          vendor: product.vendor,
          price: product.price,
          qty: quantity,
          image: product.image,
        },
      ];
    });

    setToast({
      tone: "success",
      icon: "shopping-basket",
      title: "Added to basket",
      message: `${quantity > 1 ? `${quantity}x ` : ""}${product.name}${
        product.vendor ? ` from ${product.vendor}` : ""
      }`,
    });
  };

  const handleToggleFavourite = (productId) => {
    setFavourites((prev) => {
      const isFav = prev.includes(productId);
      const updated = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      const prod = PRODUCTS.find((p) => p.id === productId);
      setToast({
        tone: "info",
        icon: "heart",
        title: isFav ? "Removed from saved" : "Saved for later",
        message: prod ? prod.name : "",
      });
      return updated;
    });
  };

  const handleSearchSubmit = (query) => {
    if (!query) return;
    nav("category");
  };

  const totalCartCount = basket.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Top Header */}
      <Header
        onNav={nav}
        cartCount={totalCartCount}
        active={screen}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenVendorModal={() => setVendorModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && screen !== "category") {
            nav("category");
          }
        }}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Screen Views */}
      <div style={{ flex: 1 }}>
        {screen === "home" && (
          <HomeScreen
            onNav={nav}
            onAdd={handleAddToBasket}
            onSelectProduct={handleSelectProduct}
            onToggleFavourite={handleToggleFavourite}
            favourites={favourites}
          />
        )}

        {screen === "category" && (
          <CategoryScreen
            onNav={nav}
            onAdd={handleAddToBasket}
            onSelectProduct={handleSelectProduct}
            initialCategory={screenParams.categoryId}
            initialArea={screenParams.area || "All"}
            searchQuery={searchQuery}
            onToggleFavourite={handleToggleFavourite}
            favourites={favourites}
          />
        )}

        {screen === "product" && (
          <ProductScreen
            product={selectedProduct}
            onNav={nav}
            onAdd={handleAddToBasket}
            onSelectProduct={handleSelectProduct}
            onToggleFavourite={handleToggleFavourite}
            favourites={favourites}
          />
        )}

        {screen === "basket" && (
          <BasketScreen
            items={basket}
            onNav={nav}
            onQty={(idx, newQty) =>
              setBasket((prev) => prev.map((item, j) => (j === idx ? { ...item, qty: newQty } : item)))
            }
            onRemove={(idx) => setBasket((prev) => prev.filter((_, j) => j !== idx))}
            onClearBasket={() => setBasket([])}
            onCheckout={(order) =>
              setToast({
                tone: "info",
                icon: "bike",
                title: "Order confirmed!",
                message: `Rider assigned for delivery to ${order.address}.`,
              })
            }
          />
        )}

        {screen === "vendors" && (
          <VendorDirectoryScreen
            onNav={nav}
            onOpenVendorModal={() => setVendorModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom Footer */}
      <Footer
        onNav={nav}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenVendorModal={() => setVendorModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 9999,
            animation: "oj-toast-in 200ms cubic-bezier(.2,.8,.3,1)",
          }}
        >
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Modals */}
      <AboutModal
        open={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        onBrowseVendors={() => nav("category")}
      />

      <BecomeVendorModal
        open={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        onSubmitSuccess={(vendorData) => {
          setToast({
            tone: "success",
            icon: "store",
            title: "Application received",
            message: `${vendorData.shopName} recorded for verification in ${vendorData.area}.`,
          });
        }}
      />

      <style>{`
        @keyframes oj-toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
