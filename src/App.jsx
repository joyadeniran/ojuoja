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
import { AuthModal } from "./components/Modals/AuthModal.jsx";
import { NotificationCenterModal } from "./components/Modals/NotificationCenterModal.jsx";
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
    vendor: "Ojawa Fresh",
    price: 3200,
    qty: 1,
    image: PHOTO_BASE + "prod-peppers.png",
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    recipient: "vendor",
    title: "Kitchen Order Prepared",
    message: "Mama T Stores dispatched 2 items for Ita Elewa delivery.",
    meta: "Prep SLA: 12 mins",
    time: "3 mins ago",
  },
  {
    id: "notif-2",
    recipient: "dispatch",
    title: "Rider Assigned (Ita Elewa)",
    message: "Rider Segun picked up parcel at Sabo Market for delivery to Agric.",
    meta: "Est. delivery: 28 mins",
    time: "10 mins ago",
  },
  {
    id: "notif-3",
    recipient: "admin",
    title: "Daily Operations Status",
    message: "All 18 verified Ikorodu kitchens and grocery stalls online & active.",
    meta: "Platform Health: 100%",
    time: "35 mins ago",
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(3);

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
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenNotifications={() => {
          setNotificationsModalOpen(true);
          setUnreadCount(0);
        }}
        unreadNotificationsCount={unreadCount}
        currentUser={currentUser}
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
            onCheckout={(order) => {
              const vendorNames = Array.from(new Set(order.items.map((i) => i.vendor))).filter(Boolean).join(", ");
              const timeStr = "Just now";
              const newVendorNotif = {
                id: `v-${Date.now()}`,
                recipient: "vendor",
                title: "Kitchen Order Alert",
                message: `${order.items.length} item(s) ordered from ${vendorNames || "verified kitchens"}. Preparation started.`,
                meta: `Total: ₦${order.total.toLocaleString("en-NG")} • ${order.phone}`,
                time: timeStr,
              };
              const newDispatchNotif = {
                id: `d-${Date.now()}`,
                recipient: "dispatch",
                title: "Dispatch Rider Assigned",
                message: `Delivery assigned to zone rider for ${order.address}.`,
                meta: `Customer: ${order.phone}`,
                time: timeStr,
              };
              const newAdminNotif = {
                id: `a-${Date.now()}`,
                recipient: "admin",
                title: "Operations Order Logged",
                message: `Order of ₦${order.total.toLocaleString("en-NG")} confirmed via ${order.paymentMethod === "transfer" ? "Bank Transfer" : "Cash"}. SLA 35–60m active.`,
                meta: `Ref: #OJ-${Math.floor(1000 + Math.random() * 9000)}`,
                time: timeStr,
              };

              setNotifications((prev) => [newVendorNotif, newDispatchNotif, newAdminNotif, ...prev]);
              setUnreadCount((c) => c + 3);

              setToast({
                tone: "success",
                icon: "bike",
                title: "Order & Dispatch Active!",
                message: `Vendor, dispatch rider & ops notified for ${order.address}.`,
              });
            }}
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
          const timeStr = "Just now";
          const vendorNotif = {
            id: `v-app-${Date.now()}`,
            recipient: "vendor",
            title: "Store Application Submitted",
            message: `${vendorData.shopName} queued for physical onboarding inspection.`,
            meta: `Zone: ${vendorData.area}`,
            time: timeStr,
          };
          const adminNotif = {
            id: `a-app-${Date.now()}`,
            recipient: "admin",
            title: "New Vendor Application",
            message: `${vendorData.shopName} applied for verification in ${vendorData.area}.`,
            meta: `Contact: ${vendorData.phone}`,
            time: timeStr,
          };
          setNotifications((prev) => [vendorNotif, adminNotif, ...prev]);
          setUnreadCount((c) => c + 2);

          setToast({
            tone: "success",
            icon: "store",
            title: "Application received",
            message: `${vendorData.shopName} recorded for verification in ${vendorData.area}.`,
          });
        }}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setToast({
            tone: "success",
            icon: "user",
            title: `Welcome, ${user.fullName}!`,
            message: `Signed in as ${user.role === "vendor" ? "Vendor Partner" : user.role === "dispatch" ? "Dispatch Rider" : "Shopper"}.`,
          });
        }}
      />

      <NotificationCenterModal
        open={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications}
        onClear={() => {
          setNotifications([]);
          setUnreadCount(0);
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
