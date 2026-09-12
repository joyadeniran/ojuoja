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

export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export async function recordNotification(notifPayload) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          recipient: notifPayload.recipient,
          title: notifPayload.title,
          message: notifPayload.message,
          meta: notifPayload.meta,
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
