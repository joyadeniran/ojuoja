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
import { OnboardingModal } from "./components/Modals/OnboardingModal.jsx";
import { DashboardRouter } from "./views/dashboards/DashboardRouter.jsx";
import { Toast } from "../components/feedback/Toast.jsx";
import { PRODUCTS, PHOTO_BASE } from "./data/marketData.js";
import {
  createOrder as createSupabaseOrder,
  recordNotification as recordSupabaseNotification,
  getNotifications as getSupabaseNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
  checkSupabaseConnection,
  onAuthChange,
  getProfile,
  buildUserObject,
  signOutUser,
} from "./lib/supabase.js";

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

/**
 * Format a notification's DB timestamp into a human-readable relative string.
 * e.g. "3 mins ago", "2 hrs ago", "Yesterday"
 */
function formatNotifTime(isoString) {
  if (!isoString) return "Just now";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs !== 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Just now";
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [screenParams, setScreenParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // Onboarding modal: shown post-Google-OAuth when onboarding_complete = false
  const [onboardingUser, setOnboardingUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Check Supabase connectivity on mount
  useEffect(() => {
    checkSupabaseConnection().then((res) => {
      if (res.connected) {
        console.log("🟢 Connected to Supabase Project: mpxrsjbowjmimzctdinr");
      }
    });
  }, []);

  // ── Auth state listener ────────────────────────────────────────────────────
  // Handles: initial session restore, post-OAuth redirect, sign-out,
  // and PASSWORD_RECOVERY (when user clicks the reset-password email link).
  useEffect(() => {
    const unsubscribe = onAuthChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User arrived via password-reset link — open the set-new-password modal
        setAuthModalMode("reset-update");
        setAuthModalOpen(true);
        return;
      }

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          const user = buildUserObject(session, profile);

          // ── Onboarding gate ──────────────────────────────────────────────
          // Google OAuth users arrive with onboarding_complete = false.
          // Show the OnboardingModal before letting them into the app.
          if (user && user.onboardingComplete === false) {
            setOnboardingUser({ userId: user.id, name: user.fullName });
            // Store partial user so header doesn't flash empty
            setCurrentUser(user);
          } else {
            setCurrentUser(user);
          }

          // ── Load role-scoped notifications from DB ───────────────────────
          // Only fetch notifications once we know the user's role.
          // Do NOT load until onboarding is complete (role may be undefined).
          if (user && user.onboardingComplete !== false && user.role) {
            const notifs = await getSupabaseNotifications(user.role);
            if (notifs && notifs.length > 0) {
              setNotifications(notifs.map((n) => ({
                ...n,
                time: formatNotifTime(n.created_at),
              })));
            }
            const count = await getUnreadNotificationCount(user.role);
            setUnreadCount(count);
          }
        } else {
          setCurrentUser(null);
        }
      }

      if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setOnboardingUser(null);
        // Clear notifications on sign-out so the next user starts fresh
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return unsubscribe;
  }, []);

  // ── Sign-out handler ───────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setToast({ tone: "info", icon: "user", title: "Signed out", message: "See you soon!" });
  };

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
        onOpenAuth={() => {
          setAuthModalMode("login");
          setAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenNotifications={async () => {
          setNotificationsModalOpen(true);
          // Mark all visible notifications as read in the DB
          if (currentUser?.role) {
            await markNotificationsRead();
            setUnreadCount(0);
            // Refresh the list so is_read flags are up to date
            const notifs = await getSupabaseNotifications(currentUser.role);
            if (notifs) {
              setNotifications(notifs.map((n) => ({
                ...n,
                time: formatNotifTime(n.created_at),
              })));
            }
          } else {
            setUnreadCount(0);
          }
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
            onCheckout={async (order) => {
              // Persist order to Supabase (attach customer_id if logged in)
              try {
                await createSupabaseOrder(order, currentUser?.id || null);
              } catch (err) {
                console.info("Supabase order sync:", err);
              }

              const vendorNames = Array.from(new Set(order.items.map((i) => i.vendor))).filter(Boolean).join(", ");
              const newVendorNotif = {
                recipient: "vendor",
                title: "Kitchen Order Alert",
                message: `${order.items.length} item(s) ordered from ${vendorNames || "verified kitchens"}. Preparation started.`,
                meta: `Total: ₦${order.total.toLocaleString("en-NG")} • ${order.phone}`,
              };
              const newDispatchNotif = {
                recipient: "dispatch",
                title: "Dispatch Rider Assigned",
                message: `Delivery assigned to zone rider for ${order.address}.`,
                meta: `Customer: ${order.phone}`,
              };
              const newAdminNotif = {
                recipient: "admin",
                title: "Operations Order Logged",
                message: `Order of ₦${order.total.toLocaleString("en-NG")} confirmed via ${order.paymentMethod === "transfer" ? "Bank Transfer" : "Cash"}. SLA 35–60m active.`,
                meta: `Ref: #OJ-${Math.floor(1000 + Math.random() * 9000)}`,
              };

              // Persist role-scoped notifications to Supabase
              if (currentUser?.id) {
                // Only record if user is authenticated (RLS requires auth)
                try {
                  await Promise.all([
                    recordSupabaseNotification(newVendorNotif),
                    recordSupabaseNotification(newDispatchNotif),
                    recordSupabaseNotification(newAdminNotif),
                  ]);
                } catch (err) {
                  console.warn("Could not record notifications:", err);
                }

                // Refresh the current user's notification list from DB
                // (they only see their own role's notifications)
                if (currentUser.role) {
                  const notifs = await getSupabaseNotifications(currentUser.role);
                  if (notifs) {
                    setNotifications(notifs.map((n) => ({ ...n, time: formatNotifTime(n.created_at) })));
                  }
                  const count = await getUnreadNotificationCount(currentUser.role);
                  setUnreadCount(count);
                }
              } else {
                // Not logged in — optimistic local-only update for the checkout toast
                const timeStr = "Just now";
                setNotifications((prev) => [
                  { ...newAdminNotif, id: `a-${Date.now()}`, time: timeStr },
                  ...prev,
                ]);
              }

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

        {screen === "dashboard" && (
          <DashboardRouter
            currentUser={currentUser}
            onNav={nav}
            onSignOut={handleSignOut}
            onOpenAuth={() => {
              setAuthModalMode("login");
              setAuthModalOpen(true);
            }}
            favourites={favourites}
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
            right: 16,
            bottom: 16,
            maxWidth: "calc(100vw - 32px)",
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
        currentUser={currentUser}
        onSubmitSuccess={async (vendorData) => {
          // DB write is already done inside BecomeVendorModal.
          // Here we just record the role-scoped notifications.
          const vendorNotif = {
            recipient: "vendor",
            title: "Store Application Submitted",
            message: `${vendorData.shopName} queued for physical onboarding inspection.`,
            meta: `Zone: ${vendorData.area}`,
          };
          const adminNotif = {
            recipient: "admin",
            title: "New Vendor Application",
            message: `${vendorData.shopName} applied for verification in ${vendorData.area}.`,
            meta: `Contact: ${vendorData.phone}`,
          };

          if (currentUser?.id) {
            try {
              await Promise.all([
                recordSupabaseNotification(vendorNotif),
                recordSupabaseNotification(adminNotif),
              ]);
            } catch (err) {
              console.warn("Could not record vendor application notifications:", err);
            }

            if (currentUser.role) {
              const notifs = await getSupabaseNotifications(currentUser.role);
              if (notifs) {
                setNotifications(notifs.map((n) => ({ ...n, time: formatNotifTime(n.created_at) })));
              }
              const count = await getUnreadNotificationCount(currentUser.role);
              setUnreadCount(count);
            }
          }

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
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          // Profile will be set by onAuthStateChange — this is a secondary callback
          if (user) {
            setToast({
              tone: "success",
              icon: "user",
              title: `Welcome!`,
              message: `Signed in to Ojawa Marketplace.`,
            });
          }
          setAuthModalOpen(false);
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

      {/* ── OnboardingModal (post-Google-OAuth role wizard) ─────────────── */}
      {onboardingUser && (
        <OnboardingModal
          userId={onboardingUser.userId}
          name={onboardingUser.name}
          onDone={(updatedProfile) => {
            // Reload user with the fresh profile data from the DB
            setCurrentUser((prev) => ({
              ...prev,
              role: updatedProfile.role || "customer",
              vendorStoreName: updatedProfile.vendor_store_name || null,
              onboardingComplete: true,
            }));
            setOnboardingUser(null);
            setToast({
              tone: "success",
              icon: "check-circle",
              title: "Setup complete!",
              message: `Welcome to Ojawa. Your role: ${updatedProfile.role || "customer"}.`,
            });
          }}
        />
      )}

      <style>{`
        @keyframes oj-toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
