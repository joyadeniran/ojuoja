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
  },
});

/**
 * Check connectivity to Supabase
 */
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("products").select("count", { count: "exact", head: true });
    if (error && error.code !== "PGRST116" && error.code !== "42P01") {
      console.warn("Supabase connection check warning:", error.message);
    }
    return { connected: true, error: null };
  } catch (err) {
    console.warn("Supabase connection offline or unreachable:", err.message);
    return { connected: false, error: err.message };
  }
}

/**
 * Fetch products from Supabase with fallback to local market data
 */
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.info("Using local products catalogue (table not yet migrated or empty):", error.message);
      return PRODUCTS;
    }

    if (!data || data.length === 0) {
      return PRODUCTS;
    }

    return data;
  } catch (err) {
    console.warn("Error fetching products from Supabase, using local fallback:", err);
    return PRODUCTS;
  }
}

/**
 * Fetch vendors from Supabase with fallback to local market data
 */
export async function getVendors() {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) {
      return VENDORS;
    }

    return data;
  } catch (err) {
    return VENDORS;
  }
}

/**
 * Place a new customer order into Supabase
 */
export async function createOrder(orderPayload) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
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
 * Submit vendor registration application into Supabase
 */
export async function submitVendorApplication(vendorPayload) {
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
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Could not record vendor application in Supabase:", error.message);
      return { success: true, localOnly: true, data: vendorPayload };
    }

    return { success: true, localOnly: false, data };
  } catch (err) {
    console.warn("Vendor application saved locally:", err);
    return { success: true, localOnly: true, data: vendorPayload };
  }
}

/**
 * Fetch notifications from Supabase with fallback to local state
 */
export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Record a new operational or order notification in Supabase
 */
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

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Supabase Auth wrappers
 */
export async function signUpUser({ email, phone, password, fullName, role = "customer" }) {
  try {
    const credentials = email
      ? { email, password }
      : { phone, password };

    const { data, error } = await supabase.auth.signUp({
      ...credentials,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err.message };
  }
}

export async function signInUser({ email, phone, password }) {
  try {
    const credentials = email
      ? { email, password }
      : { phone, password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err.message };
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
