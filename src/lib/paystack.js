/**
 * Paystack inline checkout (cards, bank transfer, USSD).
 * Set VITE_PAYSTACK_PUBLIC_KEY (pk_test_… / pk_live_…) in .env to enable.
 *
 * NOTE: the public key can only START a payment. Treat `paid` orders as
 * "reported paid" until verified server-side (Paystack webhook / verify API
 * with the SECRET key, which must never ship in the browser).
 */
export const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
export const paystackEnabled = Boolean(PAYSTACK_KEY);

let scriptPromise = null;
function loadScript() {
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load Paystack. Check your connection."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Open the Paystack popup. Resolves with { reference } on success,
 * rejects with Error("cancelled") if the customer closes it.
 * `amountNaira` is in naira; converted to kobo here.
 */
export async function payWithPaystack({ email, amountNaira, phone, metadata = {} }) {
  if (!paystackEnabled) throw new Error("Online payment is not configured yet.");
  if (!email) throw new Error("An email address is required for online payment.");
  await loadScript();

  const reference = `OJ-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email,
      amount: Math.round(amountNaira * 100),
      currency: "NGN",
      ref: reference,
      metadata: { phone, ...metadata },
      callback: (res) => resolve({ reference: res.reference || reference }),
      onClose: () => reject(new Error("cancelled")),
    });
    handler.openIframe();
  });
}
