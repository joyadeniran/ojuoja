import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, VENDORS } from "../data/marketData.js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://mpxrsjbowjmimzctdinr.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weHJzamJvd2ptaW16Y3RkaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTkzMDgsImV4cCI6MjEwMjk3NTMwOH0.-z5A8-2LLLMXIcZwwGRulytbaFESgmhinnYee2U97nw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Required for OAuth redirect handling
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SESSION & AUTH STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current active session (returns null if not logged in).
 * Call this on app mount to restore session from localStorage.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

/**
 * Subscribe to auth state changes.
 * Callback receives (event, session) where event is one of:
 *   INITIAL_SESSION | SIGNED_IN | SIGNED_OUT | TOKEN_REFRESHED | PASSWORD_RECOVERY
 * Returns the unsubscribe function — call it in useEffect cleanup.
 */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a user's profile row from public.profiles.
 * The DB trigger creates this automatically on sign-up.
 */
export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Could not fetch profile:", error.message);
    return null;
  }
  return data;
}

/**
 * Upsert profile data (e.g. after OAuth where name may be updated).
 */
export async function upsertProfile(userId, updates) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.warn("Could not upsert profile:", error.message);
    return null;
  }
  return data;
}

/**
 * Build a normalised user object from a Supabase session + profile row.
 * This is what the rest of the app stores in `currentUser`.
 */
export function buildUserObject(session, profile) {
  const user = session?.user;
  if (!user) return null;

  const metaName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "";
  const metaAvatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "";

  return {
    id: user.id,
    email: user.email || profile?.email || "",
    phone: user.phone || profile?.phone || "",
    fullName: profile?.full_name || metaName || "Ojawa Member",
    role: profile?.role || "customer",
    avatarUrl: profile?.avatar_url || metaAvatar || "",
    provider: user.app_metadata?.provider || "email",
    // Onboarding gate — false means the OnboardingModal must be shown
    onboardingComplete: profile?.onboarding_complete ?? true,
    // Vendor-specific: the exact store name used to match against order items
    vendorStoreName: profile?.vendor_store_name || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: SIGN-UP (email or phone + password)
// ─────────────────────────────────────────────────────────────────────────────

export async function signUpUser({ email, phone, password, fullName, role = "customer" }) {
  try {
    const credentials = email ? { email, password } : { phone, password };

    const { data, error } = await supabase.auth.signUp({
      ...credentials,
      options: {
        data: { full_name: fullName || "", role },
      },
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: SIGN-IN (email or phone + password)
// ─────────────────────────────────────────────────────────────────────────────

export async function signInUser({ email, phone, password }) {
  try {
    const credentials = email ? { email, password } : { phone, password };
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: GOOGLE OAUTH
// ─────────────────────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://ojuoja.vercel.app/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: PASSWORD RESET
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send a password reset email. The email contains a link that redirects back
 * to the app with `#access_token=...&type=recovery` in the URL hash.
 */
export async function sendPasswordReset(email) {
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://ojuoja.vercel.app/";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Update the user's password. Call after the user arrives from the reset email
 * and the PASSWORD_RECOVERY session event has fired.
 */
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: SIGN-OUT
// ─────────────────────────────────────────────────────────────────────────────

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTIVITY
// ─────────────────────────────────────────────────────────────────────────────

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase
      .from("products")
      .select("count", { count: "exact", head: true });
    if (error && error.code !== "PGRST116" && error.code !== "42P01") {
      console.warn("Supabase connection check warning:", error.message);
    }
    return { connected: true, error: null };
  } catch (err) {
    console.warn("Supabase connection offline or unreachable:", err.message);
    return { connected: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.info("Using local products catalogue:", error.message);
      return PRODUCTS;
    }
    if (!data || data.length === 0) return PRODUCTS;
    return data;
  } catch (err) {
    console.warn("Error fetching products, using local fallback:", err);
    return PRODUCTS;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: VENDORS
// ─────────────────────────────────────────────────────────────────────────────

export async function getVendors() {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) return VENDORS;
    return data;
  } catch {
    return VENDORS;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export async function createOrder(orderPayload, userId = null) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: userId || null,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          delivery_fee: orderPayload.delivery,
          total: orderPayload.total,
          delivery_address: orderPayload.address,
          phone: orderPayload.phone,
          payment_method: orderPayload.paymentMethod,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Could not insert order into Supabase, recorded locally:", error.message);
      return { success: true, localOnly: true, data: orderPayload };
    }
    return { success: true, localOnly: false, data };
  } catch (err) {
    console.warn("Order recorded locally:", err);
    return { success: true, localOnly: true, data: orderPayload };
  }
}

/**
 * Fetch all orders for the currently logged-in user.
 */
export async function getUserOrders() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: VENDOR APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function submitVendorApplication(vendorPayload, userId = null) {
  try {
    const { data, error } = await supabase
      .from("vendor_applications")
      .insert([
        {
          shop_name: vendorPayload.shopName,
          owner_name: vendorPayload.ownerName,
          phone: vendorPayload.phone,
          area: vendorPayload.area,
          category: vendorPayload.category,
          status: "under_review",
          applicant_id: userId || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Could not record vendor application:", error.message);
      return { success: true, localOnly: true, data: vendorPayload };
    }
    return { success: true, localOnly: false, data };
  } catch (err) {
    console.warn("Vendor application saved locally:", err);
    return { success: true, localOnly: true, data: vendorPayload };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// DATA: NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch notifications scoped to the current user's role.
 *
 * - admin: sees ALL notifications (no filter)
 * - vendor / dispatch / customer: sees only notifications where
 *     recipient = their role  OR  recipient = 'all'  OR  user_id = their uid
 *
 * Returns null on error or when unauthenticated.
 */
export async function getNotifications(userRole) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !userRole) return null;

    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // Admins see everything; RLS enforces this server-side too.
    // For non-admins the RLS policy already gates rows, but we also
    // add a client-side filter as defence-in-depth.
    if (userRole !== "admin") {
      query = query.or(`recipient.eq.${userRole},recipient.eq.all,user_id.eq.${user.id}`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Could not fetch notifications:", error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.warn("getNotifications error:", err);
    return null;
  }
}

/**
 * Returns the count of unread notifications for the current user's role.
 * Used to drive the notification bell badge.
 */
export async function getUnreadNotificationCount(userRole) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !userRole) return 0;

    let query = supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (userRole !== "admin") {
      query = query.or(`recipient.eq.${userRole},recipient.eq.all,user_id.eq.${user.id}`);
    }

    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Mark notifications as read for the current user.
 * Pass an array of notification IDs, or omit to mark all visible ones as read.
 */
export async function markNotificationsRead(ids = []) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    let query = supabase
      .from("notifications")
      .update({ is_read: true });

    if (ids.length > 0) {
      query = query.in("id", ids);
    }
    // RLS UPDATE policy ensures the user can only mark their own-role notifications
    const { error } = await query;
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Record a new notification. Requires the caller to be authenticated.
 * recipient: 'vendor' | 'dispatch' | 'admin' | 'customer' | 'all'
 * userId (optional): target a specific user in addition to the role
 */
export async function recordNotification(notifPayload) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    // Require auth — anonymous notification inserts are blocked by RLS
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          recipient: notifPayload.recipient,
          title: notifPayload.title,
          message: notifPayload.message,
          meta: notifPayload.meta || null,
          user_id: notifPayload.userId || null,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD DATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// ── Admin ─────────────────────────────────────────────────────────────────────

/** Admin: platform-wide aggregate statistics (via platform_stats view) */
export async function getPlatformStats() {
  const { data, error } = await supabase.from("platform_stats").select("*").single();
  if (error) {
    // Fallback counts using direct queries if view not yet created
    const [usersRes, ordersRes, vendorsRes, appsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id, total", { count: "exact" }),
      supabase.from("vendors").select("id", { count: "exact", head: true }),
      supabase.from("vendor_applications").select("id", { count: "exact", head: true }).eq("status", "under_review"),
    ]);
    const revenue = (ordersRes.data || []).reduce((s, o) => s + (o.total || 0), 0);
    return {
      total_users: usersRes.count || 0,
      total_vendors: vendorsRes.count || 0,
      total_orders: ordersRes.count || 0,
      total_revenue: revenue,
      pending_applications: appsRes.count || 0,
      verified_vendors: 0,
      pending_orders: 0,
    };
  }
  return data;
}

/** Admin: fetch all user profiles, ordered by creation date */
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

/** Admin: update a user's role */
export async function updateProfileRole(userId, role) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/** Admin: suspend (disable) a user by setting role to 'suspended'.
 *  The DashboardRouter and all data helpers treat 'suspended' as no-access.
 */
export async function suspendProfile(userId) {
  return updateProfileRole(userId, "suspended");
}

/** Admin: restore (unsuspend) a user by resetting their role to 'customer'. */
export async function restoreProfile(userId) {
  return updateProfileRole(userId, "customer");
}

/** Admin: fetch all orders across the platform */
export async function getAllOrders({ limit = 50, status = null } = {}) {
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

/** Admin: update an order's status */
export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/** Admin: fetch all vendor applications */
export async function getAllVendorApplications() {
  const { data, error } = await supabase
    .from("vendor_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

/** Admin: fetch all marketplace vendors from database */
export async function getAllVendors() {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return VENDORS;
    return data;
  } catch {
    return VENDORS;
  }
}

/** Admin: toggle a vendor's verified badge */
export async function toggleVendorVerification(vendorId, currentVerified) {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .update({ verified: !currentVerified })
      .eq("id", vendorId)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: comprehensive approval of a vendor application.
 * 1. Sets vendor_applications status to 'approved'.
 * 2. Generates vendor slug & inserts into public.vendors.
 * 3. Initializes vendor_store_settings.
 * 4. Upgrades applicant profile to role='vendor', vendor_store_name, vendor_id, onboarding_complete=true.
 * 5. Sends celebratory notification to applicant & audit log to admin.
 */
export async function approveVendorApplication(app) {
  try {
    const slugBase = (app.shop_name || "vendor")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const vendorId = slugBase || `vendor-${Date.now()}`;

    // 1. Update application status
    const { error: appError } = await supabase
      .from("vendor_applications")
      .update({ status: "approved" })
      .eq("id", app.id);
    if (appError) console.warn("Application status update note:", appError.message);

    // 2. Insert or upsert vendor record
    const vendorPayload = {
      id: vendorId,
      name: app.shop_name,
      area: app.area || "Ita Elewa",
      verified: true,
      rating: 4.9,
      delivery_mins: 35,
      tagline: `${app.category || "General Store"} • ${app.area || "Ikorodu"}`,
      description: `Verified merchant in ${app.area || "Ikorodu"}. Contact: ${app.phone || "N/A"}.`,
      owner_id: app.applicant_id || null,
    };

    const { data: vendorData, error: vendorError } = await supabase
      .from("vendors")
      .upsert([vendorPayload])
      .select()
      .single();
    if (vendorError) {
      console.warn("Vendors table upsert warning:", vendorError.message);
    }

    // 3. If there is an applicant user, upgrade their profile & store settings
    if (app.applicant_id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "vendor",
          vendor_store_name: app.shop_name,
          vendor_id: vendorId,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", app.applicant_id);
      if (profileError) console.warn("Profile role upgrade note:", profileError.message);

      // Initialize store settings
      const { error: settingsError } = await supabase
        .from("vendor_store_settings")
        .upsert([
          {
            vendor_id: vendorId,
            owner_id: app.applicant_id,
            is_open: true,
            opens_at: "08:00",
            closes_at: "22:00",
            banner_message: `Welcome to ${app.shop_name}! Open and delivering across ${app.area || "Ikorodu"}.`,
          },
        ]);
      if (settingsError) console.warn("Store settings init note:", settingsError.message);

      // Send congratulations notification to vendor
      try {
        await recordSupabaseNotification({
          recipient: "vendor",
          user_id: app.applicant_id,
          title: "Vendor Application Approved! 🎉",
          message: `Congratulations! Your shop "${app.shop_name}" has been approved and verified. You now have full access to your Vendor Dashboard.`,
          meta: `Zone: ${app.area || "Ikorodu"}`,
        });
      } catch (err) {
        console.warn("Notification error:", err);
      }
    }

    // Admin audit notification
    try {
      await recordSupabaseNotification({
        recipient: "admin",
        title: "Vendor Store Activated",
        message: `${app.shop_name} (${app.owner_name}) has been approved and activated in ${app.area}.`,
        meta: `ID: ${vendorId}`,
      });
    } catch {}

    return { success: true, vendorId, vendor: vendorData || vendorPayload };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Admin: reject a vendor application */
export async function rejectVendorApplication(appId, notes = "") {
  try {
    const { data, error } = await supabase
      .from("vendor_applications")
      .update({ status: "rejected", notes })
      .eq("id", appId)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Admin: update vendor application status (delegates to approveVendorApplication if approved) */
export async function updateApplicationStatus(appId, status, notes = "", appData = null) {
  if (status === "approved" && appData) {
    return approveVendorApplication(appData);
  }
  const { data, error } = await supabase
    .from("vendor_applications")
    .update({ status, notes })
    .eq("id", appId)
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ── Vendor ────────────────────────────────────────────────────────────────────

/**
 * Vendor: fetch orders that contain items from this vendor's store.
 * Since items is a JSONB array, we use contains filtering.
 */
export async function getVendorOrders(vendorName) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return [];
  // Filter client-side: orders where at least one item.vendor === vendorName
  return (data || []).filter((order) =>
    (order.items || []).some((item) =>
      (item.vendor || "").toLowerCase() === vendorName.toLowerCase()
    )
  );
}

/** Vendor: compute quick stats from their orders */
export function computeVendorStats(orders, vendorName) {
  const myOrders = orders.filter((o) =>
    (o.items || []).some((item) => (item.vendor || "").toLowerCase() === vendorName.toLowerCase())
  );
  const revenue = myOrders.reduce((sum, o) => {
    const vendorItems = (o.items || []).filter(
      (item) => (item.vendor || "").toLowerCase() === vendorName.toLowerCase()
    );
    return sum + vendorItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  }, 0);
  const productCounts = {};
  myOrders.forEach((o) => {
    (o.items || [])
      .filter((item) => (item.vendor || "").toLowerCase() === vendorName.toLowerCase())
      .forEach((item) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + (item.qty || 1);
      });
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    totalOrders: myOrders.length,
    totalRevenue: revenue,
    avgOrderValue: myOrders.length ? Math.round(revenue / myOrders.length) : 0,
    topProducts,
    pendingOrders: myOrders.filter((o) => o.status === "pending").length,
    completedOrders: myOrders.filter((o) => o.status === "completed").length,
  };
}

/** Vendor: get or upsert their store settings */
export async function getVendorStoreSettings(vendorId) {
  const { data } = await supabase
    .from("vendor_store_settings")
    .select("*")
    .eq("vendor_id", vendorId)
    .single();
  return data;
}

export async function updateVendorStoreSettings(vendorId, settings) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("vendor_store_settings")
    .upsert({
      vendor_id: vendorId,
      owner_id: user?.id,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ── Customer ──────────────────────────────────────────────────────────────────

/** Customer: fetch their own order history */
export async function getMyOrders() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

/** Customer: update their own profile (name, phone) */
export async function updateMyProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

