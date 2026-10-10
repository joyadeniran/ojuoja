# Paystack Webhook Edge Function

This Edge Function securely handles automated payment confirmations from Paystack.

---

## What It Does
1. Receives real-time payment events from Paystack (`POST https://<project-ref>.supabase.co/functions/v1/paystack-webhook`).
2. Validates the incoming **HMAC-SHA512 signature** (`x-paystack-signature`) against your `PAYSTACK_SECRET_KEY`.
3. When `event === "charge.success"`:
   - Matches the order in `public.orders` using `payment_reference`.
   - Sets `payment_status = 'paid'`.
   - Advances order status to `'in_progress'`.
   - Generates notifications for **Admin**, **Vendor(s)**, and **Customer**.
4. Returns `200 OK` to Paystack to acknowledge receipt.

---

## 1. Set the Paystack Secret Key in Supabase
In your **Supabase Dashboard** -> **Project Settings** -> **Edge Functions** -> **Secrets**:
Add a secret:
- **Name**: `PAYSTACK_SECRET_KEY`
- **Value**: `sk_test_...` (or `sk_live_...`)

Or via the Supabase CLI:
```bash
npx supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

---

## 2. Deploy the Edge Function
Run in your project root:
```bash
npx supabase functions deploy paystack-webhook --no-verify-jwt
```
> **IMPORTANT:** You must include `--no-verify-jwt` because Paystack webhooks do not carry Supabase user JWT tokens. Security is verified directly by the cryptographic HMAC SHA512 signature.

---

## 3. Register the Webhook in Paystack
1. Log in to [Paystack Dashboard](https://dashboard.paystack.com).
2. Go to **Settings** -> **API Keys & Webhooks**.
3. In the **Webhook URL** field, enter:
   ```
   https://mpxrsjbowjmimzctdinr.supabase.co/functions/v1/paystack-webhook
   ```
4. Click **Save Changes**.
5. Test a transaction using the Test Card or Test Bank Transfer in the checkout to see real-time automatic confirmation!
