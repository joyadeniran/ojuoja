// ==============================================================================
// PAYSTACK WEBHOOK — SUPABASE EDGE FUNCTION
// Verifies and confirms online customer payments, marks orders as 'paid',
// and triggers dispatch/vendor preparation notifications.
// ==============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Verify HMAC-SHA512 signature from Paystack
async function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
  secretKey: string
): Promise<boolean> {
  if (!signature || !secretKey) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const hex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex.toLowerCase() === signature.toLowerCase();
}

Deno.serve(async (req: Request) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
    return new Response(
      JSON.stringify({ error: "Server configuration missing supabase keys" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // 1. Read raw body and signature
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // 2. Validate HMAC signature if secret key is configured
  if (paystackSecret) {
    const isValid = await verifyPaystackSignature(rawBody, signature, paystackSecret);
    if (!isValid) {
      console.warn("Invalid Paystack webhook signature:", signature);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    console.warn(
      "⚠️ WARNING: PAYSTACK_SECRET_KEY is not set. Webhook received without signature verification."
    );
  }

  // 3. Parse JSON payload
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { event, data } = payload;
  console.log(`Received Paystack event: ${event}`, { reference: data?.reference, amount: data?.amount });

  // We are interested in successful charges
  if (event === "charge.success" && data?.status === "success") {
    const reference = data.reference;
    const amountKobo = data.amount;
    const amountNaira = amountKobo ? amountKobo / 100 : 0;
    const customerEmail = data.customer?.email || "";
    const customerPhone = data.metadata?.phone || data.customer?.phone || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Find the matching order by payment_reference
    const { data: orders, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_reference", reference)
      .limit(1);

    if (findError) {
      console.error("Error querying orders by reference:", findError.message);
    }

    let order = orders && orders.length > 0 ? orders[0] : null;

    if (!order) {
      console.warn(`Order with payment_reference '${reference}' not found in database.`);
      // Optional fallback: attempt lookup if metadata has order_id
      if (data.metadata?.order_id) {
        const { data: byId } = await supabase
          .from("orders")
          .select("*")
          .eq("id", data.metadata.order_id)
          .single();
        if (byId) order = byId;
      }
    }

    if (order) {
      // 5. Update the order to paid & advance status to in_progress if still pending
      const nextStatus = order.status === "pending" ? "in_progress" : order.status;

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_method: "paystack",
          status: nextStatus,
          payment_reference: reference,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error(`Failed to update order #${order.id}:`, updateError.message);
      } else {
        console.log(`✅ Order #${order.id} confirmed paid via Paystack (₦${amountNaira}).`);

        // 6. Record Notifications
        const orderRef = `#OJ-${String(order.id).padStart(5, "0")}`;

        // Admin Notification
        await supabase.from("notifications").insert([
          {
            recipient: "admin",
            title: "Online Payment Confirmed! 💳",
            message: `₦${amountNaira.toLocaleString("en-NG")} confirmed via Paystack for order ${orderRef}.`,
            meta: `Ref: ${reference}`,
            is_read: false,
          },
        ]);

        // Customer Notification (if registered customer)
        if (order.customer_id) {
          await supabase.from("notifications").insert([
            {
              recipient: "customer",
              user_id: order.customer_id,
              title: "Payment Received! 🎉",
              message: `Your payment of ₦${amountNaira.toLocaleString("en-NG")} for order ${orderRef} was received. Delivery preparation started.`,
              meta: `Ref: ${reference}`,
              is_read: false,
            },
          ]);
        }

        // Vendor Notification for each vendor involved
        const vendorNames = Array.from(
          new Set(
            (order.items || [])
              .map((i: any) => i.vendor)
              .filter(Boolean)
          )
        );

        for (const vendorName of vendorNames) {
          await supabase.from("notifications").insert([
            {
              recipient: "vendor",
              title: "Order Paid & Ready for Prep",
              message: `Order ${orderRef} (${order.delivery_address}) is verified paid online. Please prepare items.`,
              meta: `Vendor: ${vendorName}`,
              is_read: false,
            },
          ]);
        }
      }
    }
  }

  // 7. Always acknowledge Paystack with 200 OK
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
