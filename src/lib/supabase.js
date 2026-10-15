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
    preferredArea: profile?.preferred_area || "",
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

/** Map a DB product row (snake_case) to the shape the UI components expect. */
export function normalizeProduct(p) {
  if (!p) return p;
  const image = p.image || "";
  return {
    ...p,
    was: p.was ?? p.was_price ?? null,
    vendorId: p.vendorId ?? p.vendor_id ?? null,
    reviewsCount: p.reviewsCount ?? p.reviews_count ?? 0,
    rating: Number(p.rating) || 4.8,
    image,
    thumbnails: p.thumbnails && p.thumbnails.length ? p.thumbnails : image ? [image] : [],
    details: Array.isArray(p.details) ? p.details : [],
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    flag: p.flag || null,
    verified: p.verified ?? true,
  };
}

/** Map a DB vendor row (snake_case) to the shape the UI components expect. */
export function normalizeVendor(v) {
  if (!v) return v;
  return {
    ...v,
    deliveryMins: v.deliveryMins ?? v.delivery_mins ?? 35,
    rating: Number(v.rating) || 4.8,
    imageUrl: v.imageUrl ?? v.image_url ?? null,
  };
}

/** Combine local seed data with live DB rows; DB rows win on matching id. */
function mergeById(local, remote) {
  const map = new Map(local.map((x) => [x.id, x]));
  remote.forEach((x) => map.set(x.id, { ...(map.get(x.id) || {}), ...x }));
  return Array.from(map.values());
}

/**
 * Marketplace products = local seed catalogue + every available product that
 * vendors have uploaded. Never returns *only* the seed once DB rows exist, and
 * never drops DB rows when a request fails (callers keep the previous list).
 * Returns null on a failed request so the caller can keep what it already has.
 */
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.info("Could not load products from Supabase:", error.message);
      return null;
    }
    const live = (data || []).filter((p) => p.is_available !== false).map(normalizeProduct);
    // Hidden/unavailable DB products must also hide the seed copy with that id.
    const hidden = new Set((data || []).filter((p) => p.is_available === false).map((p) => p.id));
    return mergeById(PRODUCTS.filter((p) => !hidden.has(p.id)), live);
  } catch (err) {
    console.warn("Error fetching products:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: VENDORS
// ─────────────────────────────────────────────────────────────────────────────

/** Marketplace vendors = local seed + every vendor row in the DB (null on failure). */
export async function getVendors() {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.info("Could not load vendors from Supabase:", error.message);
      return null;
    }
    return mergeById(VENDORS, (data || []).map(normalizeVendor));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export async function createOrder(orderPayload, userId = null) {
  try {
    const base = {
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
    };
    const withPayment = {
      ...base,
      payment_reference: orderPayload.paymentReference || null,
      payment_status: orderPayload.paymentStatus || "unpaid",
    };

    let { data, error } = await supabase.from("orders").insert([withPayment]).select();
    // Payment columns missing (migration not applied yet) → retry without them
    if (error && /payment_(reference|status)/.test(error.message || "")) {
      ({ data, error } = await supabase.from("orders").insert([base]).select());
    }

    if (error) {
      // Nothing is stored locally, so never report success on a failed insert —
      // otherwise the customer sees "confirmed" and the order silently vanishes.
      console.warn("Could not insert order into Supabase:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Order insert failed:", err);
    return { success: false, error: err.message };
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
      // Do NOT report success here — nothing is stored anywhere else, so a
      // swallowed error means the application is silently lost.
      console.warn("Could not record vendor application:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Vendor application failed:", err);
    return { success: false, error: err.message };
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
 *
 * Preferred path: the `approve_vendor_application` Postgres function (see
 * supabase/migration_v3_vendor_payments.sql) which performs every write in ONE
 * transaction — vendor row, profile upgrade, store settings, notification and
 * the status flip to 'approved'.
 *
 * Fallback (migration not applied yet): the same steps from the client, but the
 * status update is now verified. Previously a blocked/0-row UPDATE was ignored,
 * so the application stayed 'under_review' and re-appeared on every admin login.
 */
export async function approveVendorApplication(app) {
  try {
    const rpc = await supabase.rpc("approve_vendor_application", { p_app_id: app.id });
    if (!rpc.error) {
      const vendor = rpc.data || null;
      return { success: true, vendorId: vendor?.id, vendor };
    }
    // 42883 / PGRST202 = function does not exist → use the client fallback
    const missingFn = rpc.error.code === "42883" || rpc.error.code === "PGRST202";
    if (!missingFn) return { success: false, error: rpc.error.message };

    return await approveVendorApplicationClientSide(app);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function approveVendorApplicationClientSide(app) {
  try {
    const slugBase = (app.shop_name || "vendor")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const vendorId = slugBase || `vendor-${Date.now()}`;

    // 1. Update application status FIRST and verify a row was really changed.
    //    (RLS silently filters rows: no error, but also no update.)
    const { data: updatedRows, error: appError } = await supabase
      .from("vendor_applications")
      .update({ status: "approved" })
      .eq("id", app.id)
      .select("id");
    if (appError) return { success: false, error: appError.message };
    if (!updatedRows || updatedRows.length === 0) {
      return {
        success: false,
        error:
          "The database refused to update this application (check that your account has role 'admin' and run migration_v3_vendor_payments.sql).",
      };
    }

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
      // Roll the status back so the request is not lost.
      await supabase.from("vendor_applications").update({ status: "under_review" }).eq("id", app.id);
      return { success: false, error: `Could not create vendor: ${vendorError.message}` };
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
      // (was calling an undefined `recordSupabaseNotification`, so it always threw)
      try {
        await recordNotification({
          recipient: "vendor",
          userId: app.applicant_id,
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
      await recordNotification({
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


// ─────────────────────────────────────────────────────────────────────────────
// VENDOR TOOLS: own vendor record, products, media, sales analytics
// ─────────────────────────────────────────────────────────────────────────────

/** The logged-in vendor's `vendors` row (resolved by profile.vendor_id, then owner_id). */
export async function getMyVendor() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles").select("vendor_id, vendor_store_name, full_name, preferred_area, role").eq("id", user.id).single();

  let vendorRow = null;

  if (profile?.vendor_id) {
    const { data } = await supabase.from("vendors").select("*").eq("id", profile.vendor_id).maybeSingle();
    if (data) vendorRow = data;
  }
  if (!vendorRow) {
    const { data: owned } = await supabase
      .from("vendors").select("*").eq("owner_id", user.id).order("created_at").limit(1);
    if (owned && owned[0]) vendorRow = owned[0];
  }
  if (!vendorRow && profile?.vendor_store_name) {
    const { data: byName } = await supabase
      .from("vendors").select("*").ilike("name", profile.vendor_store_name).limit(1);
    if (byName && byName[0]) vendorRow = byName[0];
  }

  // If vendor row exists, ensure owner_id and profile.vendor_id are linked
  if (vendorRow) {
    if (!vendorRow.owner_id) {
      await supabase.from("vendors").update({ owner_id: user.id }).eq("id", vendorRow.id);
      vendorRow.owner_id = user.id;
    }
    if (!profile.vendor_id) {
      await supabase.from("profiles").update({ vendor_id: vendorRow.id, vendor_store_name: vendorRow.name }).eq("id", user.id);
    }
    return normalizeVendor(vendorRow);
  }

  // If user has role 'vendor' but no vendors table row exists yet, auto-provision it
  if (profile?.role === "vendor") {
    const storeName = profile.vendor_store_name || profile.full_name || "My Store";
    const slug = storeName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `vendor-${Date.now()}`;
    const newVendor = {
      id: slug,
      name: storeName,
      area: profile.preferred_area || "Ita Elewa",
      verified: true,
      rating: 4.8,
      delivery_mins: 35,
      tagline: `${storeName} • Verified Merchant`,
      description: `Verified merchant in ${profile.preferred_area || "Ikorodu"}.`,
      owner_id: user.id,
    };
    const { data: created } = await supabase.from("vendors").upsert([newVendor]).select().single();
    if (created) {
      await supabase.from("profiles").update({ vendor_id: created.id, vendor_store_name: storeName }).eq("id", user.id);
      return normalizeVendor(created);
    }
  }

  return null;
}

/** Vendor: update public store profile (name/tagline/description/banner image…). */
export async function updateVendorProfile(vendorId, updates) {
  const { data, error } = await supabase
    .from("vendors").update(updates).eq("id", vendorId).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: normalizeVendor(data) };
}

/** Upload an image to the public `ojawa-media` bucket under the user's own folder. */
export async function uploadMedia(file, folder = "products") {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!file) return { success: false, error: "No file selected" };
  if (!file.type?.startsWith("image/")) return { success: false, error: "Please choose an image file" };
  if (file.size > 5 * 1024 * 1024) return { success: false, error: "Image must be smaller than 5MB" };

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("ojawa-media").upload(path, file, {
    cacheControl: "31536000", upsert: false, contentType: file.type,
  });
  if (error) return { success: false, error: error.message };
  const { data } = supabase.storage.from("ojawa-media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}

/** Vendor: all products (including hidden ones) belonging to this vendor. */
export async function getVendorProducts(vendorId) {
  if (!vendorId) return [];
  const { data, error } = await supabase
    .from("products").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false });
  if (error) return [];
  return (data || []).map(normalizeProduct);
}

/** Vendor: create or update a product. `vendor` is the vendors row. */
export async function saveVendorProduct(form, vendor) {
  const isNew = !form.id;
  const price = Math.round(Number(form.price));
  if (!form.name?.trim()) return { success: false, error: "Product name is required" };
  if (!price || price < 1) return { success: false, error: "Enter a valid price" };

  const row = {
    id: form.id || `p-${vendor.id}-${Date.now().toString(36)}`,
    name: form.name.trim(),
    category: form.category || "groceries",
    price,
    was_price: form.was_price ? Math.round(Number(form.was_price)) : null,
    vendor: vendor.name,
    vendor_id: vendor.id,
    area: vendor.area,
    verified: vendor.verified ?? true,
    image: form.image || null,
    thumbnails: form.image ? [form.image] : null,
    unit: form.unit?.trim() || null,
    description: form.description?.trim() || null,
    stock: form.stock === "" || form.stock == null ? null : Math.max(0, Math.round(Number(form.stock))),
    is_available: form.is_available !== false,
  };
  if (row.was_price && row.was_price > price) {
    row.flag = { label: `-${Math.round(((row.was_price - price) / row.was_price) * 100)}%`, tone: "danger" };
  } else {
    row.was_price = null;
    row.flag = null;
  }

  let query = isNew
    ? supabase.from("products").insert([row])
    : supabase.from("products").update(row).eq("id", row.id);
  let { data, error } = await query.select();
  // Older DBs without stock/is_available columns → retry without them
  if (error && /(stock|is_available)/.test(error.message || "")) {
    const { stock, is_available, ...legacy } = row;
    query = isNew ? supabase.from("products").insert([legacy]) : supabase.from("products").update(legacy).eq("id", row.id);
    ({ data, error } = await query.select());
  }
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Not allowed to save this product" };
  return { success: true, data: normalizeProduct(data[0]) };
}

export async function deleteVendorProduct(productId) {
  const { data, error } = await supabase.from("products").delete().eq("id", productId).select("id");
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Product not found or not yours" };
  return { success: true };
}

/** Vendor: revenue per day for the last `days` days + best-selling products (from orders). */
export function computeSalesSeries(orders, vendorName, days = 7) {
  const name = (vendorName || "").toLowerCase();
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    series.push({ key: d.toDateString(), label: d.toLocaleDateString("en-NG", { weekday: "short" }), revenue: 0, orders: 0 });
  }
  orders.forEach((o) => {
    if (o.status === "cancelled") return;
    const key = new Date(o.created_at).toDateString();
    const bucket = series.find((s) => s.key === key);
    if (!bucket) return;
    const mine = (o.items || []).filter((i) => (i.vendor || "").toLowerCase() === name);
    if (!mine.length) return;
    bucket.orders += 1;
    bucket.revenue += mine.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  });
  return series;
}

// ─────────────────────────────────────────────────────────────────────────────
// WALLET & WITHDRAWALS (server-enforced via RPC — see migration_v3)
// ─────────────────────────────────────────────────────────────────────────────

export async function getVendorWallet() {
  const { data, error } = await supabase.rpc("vendor_wallet");
  if (error) return { error: error.message, available: 0, earned: 0, withdrawn: 0, pending_withdrawals: 0, gross: 0, commission_pct: 10 };
  return data;
}

export async function getPayoutAccount(vendorId) {
  if (!vendorId) return null;
  const { data } = await supabase.from("vendor_payout_accounts").select("*").eq("vendor_id", vendorId).maybeSingle();
  return data || null;
}

export async function savePayoutAccount(vendorId, account) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!/^\d{10}$/.test((account.account_number || "").trim())) {
    return { success: false, error: "Account number must be 10 digits (NUBAN)" };
  }
  if (!account.bank_name?.trim() || !account.account_name?.trim()) {
    return { success: false, error: "Bank name and account name are required" };
  }
  const { data, error } = await supabase.from("vendor_payout_accounts").upsert({
    vendor_id: vendorId, owner_id: user.id,
    bank_name: account.bank_name.trim(), account_number: account.account_number.trim(),
    account_name: account.account_name.trim(), updated_at: new Date().toISOString(),
  }).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function requestWithdrawal(amount) {
  const { data, error } = await supabase.rpc("request_withdrawal", { p_amount: Math.round(Number(amount)) });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getMyWithdrawals() {
  const { data, error } = await supabase
    .from("withdrawal_requests").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) return [];
  return data || [];
}

/** Admin: every withdrawal request. */
export async function getAllWithdrawals() {
  const { data, error } = await supabase
    .from("withdrawal_requests").select("*, vendors(name)").order("created_at", { ascending: false }).limit(200);
  if (error) {
    const plain = await supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false }).limit(200);
    return plain.data || [];
  }
  return data || [];
}

/** Admin: mark a withdrawal as paid (after sending the transfer) or rejected. */
export async function processWithdrawal(id, status, notes = "") {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .update({ status, notes, processed_at: new Date().toISOString() })
    .eq("id", id).eq("status", "pending").select();
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Request already processed or not permitted" };
  return { success: true, data: data[0] };
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICANT VIEW: status of my own vendor applications
// ─────────────────────────────────────────────────────────────────────────────
export async function getMyVendorApplications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("vendor_applications").select("*").eq("applicant_id", user.id).order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

/** Upload an avatar and save it on the profile. */
export async function uploadAvatar(file) {
  const up = await uploadMedia(file, "avatars");
  if (!up.success) return up;
  const res = await updateMyProfile({ avatar_url: up.url });
  if (!res.success) return res;
  return { success: true, url: up.url };
}
