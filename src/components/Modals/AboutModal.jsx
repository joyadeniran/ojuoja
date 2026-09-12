import React from "react";
import { Dialog } from "../../../components/feedback/Dialog.jsx";
import { Button } from "../../../components/core/Button.jsx";
import { Logo } from "../../../components/brand/Logo.jsx";

export function AboutModal({ open, onClose, onBrowseVendors }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="The Story of Ojawa"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>Ikorodu, Lagos State</span>
          <Button
            size="sm"
            badgeIcon="shopping-basket"
            onClick={() => {
              onClose();
              onBrowseVendors();
            }}
          >
            Explore Marketplace
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18, color: "var(--text-body)", fontSize: 14, lineHeight: 1.6 }}>
        <div
          style={{
            padding: "20px",
            background: "var(--surface-lime)",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
          }}
        >
          <Logo height={32} />
          <p
            style={{
              margin: "12px 0 0",
              fontFamily: "var(--font-display)",
              fontSize: 19,
              color: "var(--oj-green-900)",
              fontWeight: 700,
            }}
          >
            "From hidden local gems to your daily essentials, discover the best of Ikorodu's vendors, delivered straight to you."
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 6px", color: "var(--text-heading)", fontSize: 15 }}>
            What does "Ojawa" mean?
          </h4>
          <p style={{ margin: 0 }}>
            "Ojawa" is Yoruba — <em>ọjà wá</em>, meaning <strong>"the market has arrived"</strong>.
            The logo mark retains the traditional Yoruba sub-dot on the <strong>Ọ</strong> and paints it brand yellow;
            that dot is the brand's smallest and proudest signature.
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 6px", color: "var(--text-heading)", fontSize: 15 }}>
            Checked by Hand
          </h4>
          <p style={{ margin: 0 }}>
            No random drop-shippers or unverified listings. Every vendor on Ojawa is physically inspected in their
            Ikorodu market stall or kitchen before their products go live. When you buy sweet corn from Mama T or small
            chops from Iya Basira, you know exactly where it's coming from.
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 6px", color: "var(--text-heading)", fontSize: 15 }}>
            One Basket, Multiple Local Shops
          </h4>
          <p style={{ margin: 0 }}>
            Order vegetables from Ita Elewa, drinks from Ebute, and hot jollof from Sabo in one single checkout.
            Our dedicated motorcycle riders pick up from each shop and bundle them straight to your door in 35–60 minutes.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
