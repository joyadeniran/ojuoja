import React, { useState } from "react";
import { Breadcrumb } from "../../components/navigation/Breadcrumb.jsx";
import { SectionHeading } from "../../components/core/SectionHeading.jsx";
import { CartLine } from "../../components/commerce/CartLine.jsx";
import { Card } from "../../components/core/Card.jsx";
import { Button } from "../../components/core/Button.jsx";
import { Input } from "../../components/forms/Input.jsx";
import { Select } from "../../components/forms/Select.jsx";
import { Checkbox } from "../../components/forms/Checkbox.jsx";
import { DeliveryNote } from "../../components/commerce/DeliveryNote.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { Dialog } from "../../components/feedback/Dialog.jsx";
import { Badge } from "../../components/core/Badge.jsx";
import { Icon } from "../../components/brand/Icon.jsx";
import { AREAS } from "../data/marketData.js";

const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

export function BasketScreen({
  items,
  onQty,
  onRemove,
  onClearBasket,
  onNav,
  onCheckout,
}) {
  const [payMethod, setPayMethod] = useState("transfer");
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [selectedArea, setSelectedArea] = useState("Ita Elewa");
  const [streetAddress, setStreetAddress] = useState("12 Ita Elewa Road, near the roundabout");
  const [phoneNumber, setPhoneNumber] = useState("0803 123 4567");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 10000 || subtotal === 0 ? 0 : 700;
  const total = subtotal + delivery;

  const vendorCount = new Set(items.map((i) => i.vendor)).size;

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    if (onCheckout) {
      onCheckout({
        items,
        subtotal,
        delivery,
        total,
        address: `${streetAddress}, ${selectedArea}, Ikorodu`,
        phone: phoneNumber,
        paymentMethod: payMethod,
      });
    }
  };

  const handleOrderDismiss = () => {
    setOrderSuccess(false);
    onClearBasket();
    onNav("home");
  };

  return (
    <main style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "var(--space-8) var(--layout-gutter-resp, 16px) var(--space-14)" }}>
      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "#home",
            onClick: (e) => {
              e.preventDefault();
              onNav("home");
            },
          },
          { label: "Your Basket" },
        ]}
      />

      <div style={{ marginTop: 20 }}>
        <SectionHeading
          title="Your Basket"
          subtitle={
            items.length
              ? `${items.length} item${items.length > 1 ? "s" : ""} from ${vendorCount} verified vendor${
                  vendorCount > 1 ? "s" : ""
                } in Ikorodu`
              : "Review your items and checkout"
          }
        />
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: 40, maxWidth: 520 }}>
          <EmptyState
            title="Your basket is empty"
            message="Discover fresh vegetables, piping-hot snacks, and daily groceries trending in Ikorodu today."
            action={
              <Button badgeIcon="shopping-basket" onClick={() => onNav("home")}>
                Shop Now!
              </Button>
            }
          />
        </div>
      ) : (
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "start",
          }}
        >
          {/* Cart Items & Delivery Details */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item, index) => (
                <CartLine
                  key={`${item.name}-${index}`}
                  {...item}
                  onQty={(newQty) => onQty(index, newQty)}
                  onRemove={() => setConfirmIdx(index)}
                />
              ))}
            </div>

            {/* Delivery Address & Contact */}
            <div
              style={{
                marginTop: 36,
                padding: "clamp(16px, 3vw, 24px)",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  font: "600 11px/1 var(--font-body)",
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 16,
                }}
              >
                Delivery Address in Ikorodu
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select
                  label="Ikorodu Zone"
                  options={AREAS.filter((a) => a !== "All")}
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="0803 000 0000"
                  leadingIcon="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <Input
                  label="Street Address / Landmark"
                  placeholder="e.g. 12 Ita Elewa Road, opposite Central Mosque"
                  leadingIcon="map-pin"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <Input
                  label="Note to Rider (optional)"
                  placeholder="e.g. Call when outside the black gate"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                marginTop: 24,
                padding: 24,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  font: "600 11px/1 var(--font-body)",
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 16,
                }}
              >
                Payment Choice
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Checkbox
                  radio
                  checked={payMethod === "transfer"}
                  onChange={() => setPayMethod("transfer")}
                >
                  <strong>Instant Bank Transfer</strong> (Account details shown on order)
                </Checkbox>
                <Checkbox
                  radio
                  checked={payMethod === "cash"}
                  onChange={() => setPayMethod("cash")}
                >
                  <strong>Cash on Delivery</strong> (Pay the rider directly)
                </Checkbox>
                <Checkbox
                  radio
                  checked={payMethod === "card"}
                  onChange={() => setPayMethod("card")}
                >
                  <strong>Debit Card / POS</strong> on Rider Arrival
                </Checkbox>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="oj-basket-summary" style={{ position: "sticky", top: 96 }}>
            <Card tone="flat">
              <div
                style={{
                  font: "600 11px/1 var(--font-body)",
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                }}
              >
                Order Summary
              </div>

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 14,
                  color: "var(--text-body)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <strong>{naira(subtotal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Delivery ({selectedArea})</span>
                  <strong>{delivery === 0 ? "FREE" : naira(delivery)}</strong>
                </div>
                {delivery > 0 && (
                  <div style={{ fontSize: 12, color: "var(--oj-green-700)" }}>
                    Add {naira(10000 - subtotal)} more for free delivery!
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 16,
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: 18,
                    color: "var(--text-heading)",
                  }}
                >
                  <span>Total</span>
                  <strong style={{ color: "var(--text-brand)", fontSize: 22 }}>
                    {naira(total)}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <Button
                  block
                  size="lg"
                  badgeIcon="wallet"
                  onClick={handlePlaceOrder}
                  disabled={!streetAddress || !phoneNumber}
                >
                  Place Order
                </Button>
              </div>

              <div style={{ marginTop: 18 }}>
                <DeliveryNote icon="clock">
                  Order before <strong>6:00 PM</strong> for same-day delivery
                </DeliveryNote>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="soft" icon="shield-check">
                  Buyer Protection
                </Badge>
                <Badge tone="lime" icon="bike">
                  35–60 mins
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={confirmIdx !== null}
        title="Remove this item?"
        onClose={() => setConfirmIdx(null)}
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", width: "100%" }}>
            <Button variant="ghost" size="sm" onClick={() => setConfirmIdx(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirmIdx !== null) {
                  onRemove(confirmIdx);
                  setConfirmIdx(null);
                }
              }}
            >
              Remove
            </Button>
          </div>
        }
      >
        {confirmIdx !== null && items[confirmIdx] ? (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-body)" }}>
            <strong>{items[confirmIdx].name}</strong> will be removed from your basket.
          </p>
        ) : null}
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog
        open={orderSuccess}
        title="Order Placed Successfully!"
        onClose={handleOrderDismiss}
        footer={
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button size="md" badgeIcon="shopping-basket" onClick={handleOrderDismiss}>
              Return to Marketplace
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "var(--surface-lime)",
              color: "var(--oj-green-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icon name="bike" size={28} />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--text-heading)",
              margin: "0 0 8px",
            }}
          >
            Order Placed & Dispatched!
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-body)",
              maxWidth: "42ch",
              margin: "0 auto 20px",
              lineHeight: 1.5,
            }}
          >
            Your order of <strong>{naira(total)}</strong> is confirmed. All relevant parties have been notified in real time.
          </p>

          {/* Tripartite Live Notifications Workflow */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 20 }}>
            {/* 1. Vendor Notification */}
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                background: "var(--surface-brand-soft)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--oj-green-200)",
              }}
            >
              <div style={{ color: "var(--text-brand)", marginTop: 2 }}>
                <Icon name="store" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 13, color: "var(--oj-green-900)" }}>
                    1. Vendor Notification
                  </strong>
                  <Badge tone="brand">Alerted</Badge>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--oj-green-800)", lineHeight: 1.4 }}>
                  Kitchen/stall notified to prepare your items for immediate pickup.
                </p>
              </div>
            </div>

            {/* 2. Dispatch Notification */}
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                background: "var(--surface-lime)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ color: "var(--oj-green-900)", marginTop: 2 }}>
                <Icon name="bike" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 13, color: "var(--oj-green-900)" }}>
                    2. Dispatch Rider Notification
                  </strong>
                  <Badge tone="lime">Assigned</Badge>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--oj-green-900)", lineHeight: 1.4 }}>
                  Nearest rider in <strong>{selectedArea}</strong> assigned. Will call <strong>{phoneNumber}</strong> upon pickup.
                </p>
              </div>
            </div>

            {/* 3. Admin Notification */}
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                background: "var(--surface-raised)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ color: "var(--text-heading)", marginTop: 2 }}>
                <Icon name="shield-check" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 13, color: "var(--text-heading)" }}>
                    3. Admin Operations Notification
                  </strong>
                  <Badge tone="neutral">Recorded</Badge>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Ojawa operations logged payment ({payMethod === "transfer" ? "Bank Transfer" : payMethod === "cash" ? "Cash" : "Card"}) and delivery SLA (35–60 mins).
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              background: "var(--surface-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "left",
            }}
          >
            <div>
              <strong>Delivery Destination:</strong> {streetAddress}, {selectedArea}, Ikorodu
            </div>
          </div>
        </div>
      </Dialog>

      <style>{`
        @media (max-width: 860px) {
          .oj-basket-summary {
            position: static !important;
          }
        }
      `}</style>
    </main>
  );
}
