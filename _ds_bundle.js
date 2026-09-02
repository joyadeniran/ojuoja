/* @ds-bundle: {"format":4,"namespace":"OjuojaDesignSystem_fd3102","components":[{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"PatternPanel","sourcePath":"components/brand/PatternPanel.jsx"},{"name":"CartLine","sourcePath":"components/commerce/CartLine.jsx"},{"name":"CategoryCard","sourcePath":"components/commerce/CategoryCard.jsx"},{"name":"DeliveryNote","sourcePath":"components/commerce/DeliveryNote.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"VendorCard","sourcePath":"components/commerce/VendorCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Rating","sourcePath":"components/core/Rating.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Accordion","sourcePath":"components/navigation/Accordion.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"eaa7d6a22496","components/brand/Logo.jsx":"b26ab175e406","components/brand/PatternPanel.jsx":"9185b701f984","components/commerce/CartLine.jsx":"28b7a29e2918","components/commerce/CategoryCard.jsx":"8f5889d63862","components/commerce/DeliveryNote.jsx":"5b2cf4147309","components/commerce/ProductCard.jsx":"fb67a4dc933d","components/commerce/VendorCard.jsx":"19af188e906d","components/core/Badge.jsx":"1153dc428d64","components/core/Button.jsx":"f83ae3e49699","components/core/Card.jsx":"d417ea591909","components/core/IconButton.jsx":"17f691054cc7","components/core/Rating.jsx":"b21c3cae6f6d","components/core/SectionHeading.jsx":"7b2ae597240a","components/core/Tag.jsx":"fa3bdfedb81e","components/feedback/Dialog.jsx":"4280435ea009","components/feedback/EmptyState.jsx":"6baf98a590a4","components/feedback/Toast.jsx":"feef07fb6d35","components/forms/Checkbox.jsx":"7547acc9c70d","components/forms/Input.jsx":"57189c83d7a1","components/forms/QuantityStepper.jsx":"0e5cc51ee949","components/forms/SearchField.jsx":"1f08527516f1","components/forms/Select.jsx":"b5b281d170c4","components/forms/Switch.jsx":"c47824dd51d0","components/navigation/Accordion.jsx":"cd0362317980","components/navigation/Breadcrumb.jsx":"e744590cad77","components/navigation/Pagination.jsx":"ecaf69e54d4d","components/navigation/Tabs.jsx":"a217305821a7","ui_kits/shop/App.jsx":"2ac0562e5c14","ui_kits/shop/BasketScreen.jsx":"be371c951e61","ui_kits/shop/CategoryScreen.jsx":"d4ca034dc42b","ui_kits/shop/Footer.jsx":"41674e014cbf","ui_kits/shop/Header.jsx":"41b8eee3aec0","ui_kits/shop/HomeScreen.jsx":"0f9957ad0ced","ui_kits/shop/ProductScreen.jsx":"82b7b0d0ca44"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OjuojaDesignSystem_fd3102 = window.OjuojaDesignSystem_fd3102 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Ojuoja has no proprietary icon font. The set is Lucide (1.5px stroke,
   round caps), vendored to assets/icons. Icons are painted with a CSS mask
   so they inherit currentColor. */
const iconBase = () => typeof window !== "undefined" && window.OJUOJA_ICON_BASE || "assets/icons";
function Icon({
  name,
  size = 18,
  strokeAware = true,
  className = "",
  style,
  ...rest
}) {
  const url = `url("${iconBase()}/${name}.svg")`;
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    className: `oj-icon ${className}`,
    style: {
      width: size,
      height: size,
      WebkitMaskImage: url,
      maskImage: url,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const assetBase = () => typeof window !== "undefined" && window.OJUOJA_ASSET_BASE || "assets";
const FILES = {
  "full-color": "logo.svg",
  white: "logo-white.svg",
  black: "logo-black.svg"
};
const MARK_FILES = {
  "full-color": "icon.svg",
  white: "icon-white.svg",
  black: "icon-black.svg"
};
function Logo({
  variant = "full-color",
  mark = false,
  height = 28,
  className = "",
  style,
  ...rest
}) {
  const file = mark ? MARK_FILES[variant] : FILES[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `oj-logo ${className}`,
    style: {
      height,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: `${assetBase()}/${file}`,
    alt: "Ojuoja"
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/PatternPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The brand pattern: flat vertical bars of uneven width. "lime" and "green"
   are the tonal stripe fields used behind hero and promo content; "market"
   is the full-colour bar run from the guide. */
function PatternPanel({
  variant = "lime",
  as: Tag = "div",
  padded = true,
  children,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `oj-pattern oj-pattern--${variant} ${className}`,
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "oj-pattern__inner",
    style: padded ? {
      padding: "var(--space-12) var(--space-11)"
    } : undefined
  }, children));
}
Object.assign(__ds_scope, { PatternPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PatternPanel.jsx", error: String((e && e.message) || e) }); }

// components/commerce/DeliveryNote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DeliveryNote({
  icon = "bike",
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-delivery ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-delivery__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { DeliveryNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/DeliveryNote.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = "soft",
  icon,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `oj-badge oj-badge--${tone} ${className}`
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The signature Ojuoja button: a green pill whose trailing icon sits in a
   white circle, lifted straight from the "Shop Now!" CTA on ojuoja.shop. */
function Button({
  variant = "primary",
  size = "md",
  badgeIcon,
  leadingIcon,
  block = false,
  as: Tag = "button",
  children,
  className = "",
  ...rest
}) {
  const cls = ["oj-btn", `oj-btn--${variant}`, size !== "md" && `oj-btn--${size}`, block && "oj-btn--block", badgeIcon && "oj-btn--hasbadge", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: size === "lg" ? 18 : 16
  }), /*#__PURE__*/React.createElement("span", null, children), badgeIcon && /*#__PURE__*/React.createElement("span", {
    className: "oj-btn__badge"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: badgeIcon,
    size: size === "lg" ? 20 : 16
  })));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CategoryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The homepage category tile: display-face title, one line of copy, a
   photo bleeding off the bottom edge, CTA overlaid on the photo. */
function CategoryCard({
  title,
  description,
  image,
  cta = "Explore Category",
  tone = "flat",
  onClick,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `oj-catcard ${className}`,
    onClick: onClick,
    style: tone === "lime" ? {
      background: "var(--surface-lime)"
    } : undefined
  }, rest), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "oj-catcard__title"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "oj-catcard__sub"
  }, description)), image && /*#__PURE__*/React.createElement("div", {
    className: "oj-catcard__media"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "oj-catcard__cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "onbrand",
    size: "sm",
    badgeIcon: "shopping-basket"
  }, cta)));
}
Object.assign(__ds_scope, { CategoryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CategoryCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  tone = "default",
  raised = false,
  interactive = false,
  padded = true,
  children,
  className = "",
  as: Tag = "div",
  ...rest
}) {
  const cls = ["oj-card", tone !== "default" && `oj-card--${tone}`, raised && "oj-card--raised", interactive && "oj-card--interactive", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), padded ? /*#__PURE__*/React.createElement("div", {
    className: "oj-card__body"
  }, children) : children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  variant = "plain",
  size = "md",
  count,
  label,
  className = "",
  ...rest
}) {
  const cls = ["oj-iconbtn", variant !== "plain" && `oj-iconbtn--${variant}`, size !== "md" && `oj-iconbtn--${size}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    className: cls,
    style: {
      position: "relative"
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "sm" ? 16 : size === "lg" ? 22 : 18
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    className: "oj-iconbtn__count"
  }, count));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Rating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Rating({
  value = 0,
  count,
  size = 14,
  className = "",
  ...rest
}) {
  const filled = Math.round(value);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `oj-rating ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-rating__stars"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: i,
    name: "star",
    size: size,
    style: {
      opacity: i < filled ? 1 : 0.28
    }
  }))), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: "var(--weight-semibold)"
    }
  }, value.toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    className: "oj-rating__count"
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rating.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const naira = n => "₦" + Number(n).toLocaleString("en-NG");
function ProductCard({
  name,
  price,
  was,
  image,
  vendor,
  verified = false,
  rating,
  flag,
  favourite = false,
  onFavourite,
  onAdd,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `oj-product ${className}`
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "oj-product__media"
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name
  }), flag && /*#__PURE__*/React.createElement("div", {
    className: "oj-product__flags"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: flag.tone || "danger"
  }, flag.label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Save",
    onClick: onFavourite,
    className: `oj-product__fav ${favourite ? "oj-product__fav--on" : ""}`
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "oj-product__body"
  }, vendor && /*#__PURE__*/React.createElement("span", {
    className: "oj-product__vendor"
  }, vendor, verified && /*#__PURE__*/React.createElement("span", {
    className: "oj-vendor__verified"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "badge-check",
    size: 12
  }))), /*#__PURE__*/React.createElement("span", {
    className: "oj-product__name"
  }, name), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    size: 12
  }), /*#__PURE__*/React.createElement("div", {
    className: "oj-product__row"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "oj-product__price"
  }, naira(price)), was && /*#__PURE__*/React.createElement("span", {
    className: "oj-product__was"
  }, naira(was))), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "plus",
    variant: "solid",
    size: "sm",
    label: `Add ${name} to basket`,
    onClick: onAdd
  }))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/VendorCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function VendorCard({
  name,
  area,
  image,
  verified = false,
  rating,
  deliveryMins,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `oj-vendor ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-vendor__avatar"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  }) : name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "oj-vendor__name"
  }, name, verified && /*#__PURE__*/React.createElement("span", {
    className: "oj-vendor__verified"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "badge-check",
    size: 14
  }))), /*#__PURE__*/React.createElement("span", {
    className: "oj-vendor__meta"
  }, area && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 12
  }), area), deliveryMins && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bike",
    size: 12
  }), deliveryMins, " mins"))), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    size: 12
  }));
}
Object.assign(__ds_scope, { VendorCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/VendorCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  title,
  eyebrow,
  subtitle,
  align = "left",
  tone = "brand",
  level = 2,
  action,
  className = "",
  ...rest
}) {
  const Tag = `h${level}`;
  const cls = ["oj-sechead", align === "center" && "oj-sechead--center", tone !== "brand" && `oj-sechead--${tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "oj-sechead__eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement(Tag, {
    className: "oj-sechead__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "oj-sechead__sub"
  }, subtitle), action);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected = false,
  onRemove,
  icon,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    className: `oj-tag ${className}`
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "oj-tag__remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open = true,
  title,
  children,
  footer,
  tone = "plain",
  onClose,
  className = "",
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "oj-dialog__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    className: `oj-dialog ${tone === "lime" ? "oj-dialog--lime" : ""} ${className}`,
    onClick: e => e.stopPropagation()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "oj-dialog__head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-dialog__title"
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-toast__close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "oj-dialog__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "oj-dialog__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = "shopping-basket",
  title,
  message,
  action,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-empty ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-empty__mark"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26
  })), title && /*#__PURE__*/React.createElement("h3", {
    className: "oj-empty__title"
  }, title), message && /*#__PURE__*/React.createElement("p", {
    className: "oj-empty__msg"
  }, message), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ICONS = {
  success: "check",
  warning: "bell",
  danger: "x",
  info: "truck"
};
function Toast({
  tone = "success",
  title,
  message,
  onClose,
  icon,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: `oj-toast oj-toast--${tone} ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-toast__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || ICONS[tone],
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "oj-toast__body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "oj-toast__title"
  }, title), message && /*#__PURE__*/React.createElement("span", {
    className: "oj-toast__msg"
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-toast__close",
    onClick: onClose,
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  radio = false,
  children,
  className = "",
  ...rest
}) {
  const cls = ["oj-check", radio && "oj-check--radio", checked && "oj-check--checked", disabled && "oj-check--disabled", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("label", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-check__box",
    role: radio ? "radio" : "checkbox",
    "aria-checked": checked,
    "aria-disabled": disabled,
    onClick: () => !disabled && onChange && onChange(!checked)
  }, radio ? checked && /*#__PURE__*/React.createElement("span", {
    className: "oj-check__dot"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13
  })), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  shape = "pill",
  tone = "outline",
  size = "md",
  id,
  className = "",
  ...rest
}) {
  const fid = id || `oj-in-${Math.random().toString(36).slice(2, 8)}`;
  const cls = ["oj-input", tone === "filled" && "oj-input--filled", shape === "boxy" && "oj-input--boxy", size === "lg" && "oj-input--lg", error && "oj-input--invalid"].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: `oj-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "oj-field__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: cls
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    className: "oj-input__adorn"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 16
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: "oj-input__el"
  }, rest)), trailingIcon && /*#__PURE__*/React.createElement("span", {
    className: "oj-input__adorn"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 16
  }))), error ? /*#__PURE__*/React.createElement("span", {
    className: "oj-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "oj-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  unit,
  className = "",
  ...rest
}) {
  const set = n => onChange && onChange(Math.min(max, Math.max(min, n)));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-stepper ${className}`
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-stepper__btn",
    disabled: value <= min,
    onClick: () => set(value - 1),
    "aria-label": "Decrease"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "oj-stepper__val"
  }, value, unit ? ` ${unit}` : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-stepper__btn",
    disabled: value >= max,
    onClick: () => set(value + 1),
    "aria-label": "Increase"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 14
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CartLine.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const naira = n => "₦" + Number(n).toLocaleString("en-NG");
function CartLine({
  name,
  vendor,
  image,
  price,
  qty = 1,
  unit,
  onQty,
  onRemove,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-cartline ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-cartline__thumb"
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "oj-cartline__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-cartline__name"
  }, name), vendor && /*#__PURE__*/React.createElement("div", {
    className: "oj-cartline__vendor"
  }, vendor)), /*#__PURE__*/React.createElement(__ds_scope.QuantityStepper, {
    value: qty,
    unit: unit,
    onChange: onQty
  }), /*#__PURE__*/React.createElement("span", {
    className: "oj-cartline__price"
  }, naira(price * qty)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-cartline__remove",
    "aria-label": `Remove ${name}`,
    onClick: onRemove
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "trash-2",
    size: 16
  })));
}
Object.assign(__ds_scope, { CartLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CartLine.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Header search from ojuoja.shop: grey pill, magnifier on the left,
   a green circular submit on the right. */
function SearchField({
  placeholder = "Search for akara, suli kuli or corn",
  value,
  onChange,
  onSubmit,
  submit = true,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("form", _extends({
    className: `oj-search ${className}`,
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(value);
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-input__adorn"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    className: "oj-search__el",
    placeholder: placeholder,
    value: value,
    onChange: onChange
  }), submit && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-right",
    variant: "solid",
    size: "sm",
    label: "Search",
    type: "submit"
  }));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  value,
  onChange,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `oj-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "oj-field__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "oj-select"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: "oj-select__el",
    value: value,
    onChange: onChange
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: typeof o === "string" ? o : o.value,
    value: typeof o === "string" ? o : o.value
  }, typeof o === "string" ? o : o.label))), /*#__PURE__*/React.createElement("span", {
    className: "oj-select__chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  disabled = false,
  children,
  className = "",
  ...rest
}) {
  const cls = ["oj-switch", checked && "oj-switch--on", disabled && "oj-switch--disabled", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("label", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "oj-switch__track",
    role: "switch",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked)
  }, /*#__PURE__*/React.createElement("span", {
    className: "oj-switch__knob"
  })), children && /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Accordion.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* FAQ pattern from ojuoja.shop: numbered questions on hairline rules,
   chevron rotates on open. */
function Accordion({
  items = [],
  numbered = true,
  defaultOpen = null,
  className = "",
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-accordion ${className}`
  }, rest), items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `oj-accordion__item ${open === i ? "oj-accordion__item--open" : ""}`
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-accordion__head",
    "aria-expanded": open === i,
    onClick: () => setOpen(open === i ? null : i)
  }, /*#__PURE__*/React.createElement("span", null, numbered && /*#__PURE__*/React.createElement("span", {
    className: "oj-accordion__num"
  }, i + 1, "."), item.q), /*#__PURE__*/React.createElement("span", {
    className: "oj-accordion__chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "oj-accordion__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-accordion__body"
  }, item.a)))));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumb({
  items = [],
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: `oj-crumbs ${className}`
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "oj-crumbs__sep"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 13
  })), i === items.length - 1 ? /*#__PURE__*/React.createElement("span", {
    className: "oj-crumbs__current"
  }, it.label) : /*#__PURE__*/React.createElement("a", {
    href: it.href || "#"
  }, it.label))));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pagination({
  page = 1,
  pages = 1,
  onChange,
  className = "",
  ...rest
}) {
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);else if (nums[nums.length - 1] !== "gap") nums.push("gap");
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-pager ${className}`
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-pager__btn",
    disabled: page <= 1,
    onClick: () => onChange && onChange(page - 1),
    "aria-label": "Previous page"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-left",
    size: 16
  })), nums.map((n, i) => n === "gap" ? /*#__PURE__*/React.createElement("span", {
    key: `g${i}`,
    className: "oj-pager__gap"
  }, "\u2026") : /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    className: "oj-pager__btn",
    "aria-current": n === page ? "page" : undefined,
    onClick: () => onChange && onChange(n)
  }, n)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oj-pager__btn",
    disabled: page >= pages,
    onClick: () => onChange && onChange(page + 1),
    "aria-label": "Next page"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16
  })));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  variant = "pill",
  className = "",
  ...rest
}) {
  const norm = items.map(i => typeof i === "string" ? {
    value: i,
    label: i
  } : i);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: `oj-tabs ${variant === "underline" ? "oj-tabs--underline" : ""} ${className}`
  }, rest), norm.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.value,
    role: "tab",
    type: "button",
    "aria-selected": value === i.value,
    className: "oj-tabs__tab",
    onClick: () => onChange && onChange(i.value)
  }, i.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Toast
} = window.OjuojaDesignSystem_fd3102;
function App() {
  const [screen, setScreen] = React.useState("home");
  const [items, setItems] = React.useState([{
    name: "Ijebu garri (2kg)",
    vendor: "Mama T Stores",
    price: 2400,
    qty: 2,
    image: window.PHOTO + "prod-greens.png"
  }, {
    name: "Bell peppers, mixed (1kg)",
    vendor: "Ojuoja Fresh",
    price: 3200,
    qty: 1,
    image: window.PHOTO + "prod-peppers.png"
  }]);
  const [toast, setToast] = React.useState(null);
  const nav = s => {
    setScreen(s);
    window.scrollTo({
      top: 0
    });
  };
  const add = p => {
    setItems(prev => {
      const i = prev.findIndex(x => x.name === p.name);
      if (i > -1) {
        const next = [...prev];
        next[i] = {
          ...next[i],
          qty: next[i].qty + 1
        };
        return next;
      }
      return [...prev, {
        name: p.name,
        vendor: p.vendor,
        price: p.price,
        qty: 1,
        image: p.image
      }];
    });
    setToast({
      tone: "success",
      title: "Added to basket",
      message: p.name + (p.vendor ? " from " + p.vendor : "")
    });
  };
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.Header, {
    onNav: nav,
    cartCount: items.reduce((s, i) => s + i.qty, 0),
    active: screen
  }), screen === "home" && /*#__PURE__*/React.createElement(window.HomeScreen, {
    onNav: nav,
    onAdd: add
  }), screen === "category" && /*#__PURE__*/React.createElement(window.CategoryScreen, {
    onNav: nav,
    onAdd: add
  }), screen === "product" && /*#__PURE__*/React.createElement(window.ProductScreen, {
    onNav: nav,
    onAdd: add
  }), screen === "basket" && /*#__PURE__*/React.createElement(window.BasketScreen, {
    items: items,
    onNav: nav,
    onQty: (i, n) => setItems(prev => prev.map((x, j) => j === i ? {
      ...x,
      qty: n
    } : x)),
    onRemove: i => setItems(prev => prev.filter((_, j) => j !== i)),
    onCheckout: () => setToast({
      tone: "info",
      icon: "bike",
      title: "Order placed",
      message: "A rider will call you in a few minutes."
    })
  }), /*#__PURE__*/React.createElement(window.Footer, null), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      right: 24,
      bottom: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Toast, _extends({}, toast, {
    onClose: () => setToast(null)
  }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/BasketScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionHeading,
  CartLine,
  Card,
  Button,
  Input,
  Checkbox,
  DeliveryNote,
  EmptyState,
  Dialog,
  Badge
} = window.OjuojaDesignSystem_fd3102;
function BasketScreen({
  items,
  onQty,
  onRemove,
  onNav,
  onCheckout
}) {
  const [pay, setPay] = React.useState("transfer");
  const [confirm, setConfirm] = React.useState(null);
  const naira = n => "₦" + n.toLocaleString("en-NG");
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 10000 || subtotal === 0 ? 0 : 700;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "40px 32px 96px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Your Basket",
    subtitle: items.length ? `${items.length} item${items.length > 1 ? "s" : ""} from ${new Set(items.map(i => i.vendor)).size} vendor(s)` : undefined
  }), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    title: "Your basket is empty",
    message: "Start with what's trending in Ikorodu today.",
    action: /*#__PURE__*/React.createElement(Button, {
      badgeIcon: "shopping-basket",
      onClick: () => onNav("home")
    }, "Shop Now!")
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 40,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, items.map((it, i) => /*#__PURE__*/React.createElement(CartLine, _extends({
    key: i
  }, it, {
    onQty: n => onQty(i, n),
    onRemove: () => setConfirm(i)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Delivery address",
    shape: "boxy",
    leadingIcon: "map-pin",
    defaultValue: "12 Ita Elewa Road, Ikorodu"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Phone number",
    shape: "boxy",
    leadingIcon: "phone",
    defaultValue: "0803 000 0000"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    radio: true,
    checked: pay === "transfer",
    onChange: () => setPay("transfer")
  }, "Bank transfer"), /*#__PURE__*/React.createElement(Checkbox, {
    radio: true,
    checked: pay === "cash",
    onChange: () => setPay("cash")
  }, "Cash to the rider"))), /*#__PURE__*/React.createElement(Card, {
    tone: "flat"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 11px/1 var(--font-body)",
      letterSpacing: ".09em",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, "Order summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("strong", null, naira(subtotal))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Delivery"), /*#__PURE__*/React.createElement("strong", null, delivery ? naira(delivery) : "Free")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      paddingTop: 12,
      borderTop: "1px solid var(--border-subtle)",
      fontSize: 17,
      color: "var(--text-heading)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("strong", null, naira(subtotal + delivery)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    block: true,
    badgeIcon: "wallet",
    onClick: onCheckout
  }, "Place Order")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(DeliveryNote, {
    icon: "clock"
  }, "Order before ", /*#__PURE__*/React.createElement("strong", null, "6pm"), " for same-day delivery")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "soft",
    icon: "shield-check"
  }, "Buyer protection"), /*#__PURE__*/React.createElement(Badge, {
    tone: "lime",
    icon: "bike"
  }, "35\u201360 mins")))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirm !== null,
    title: "Remove this item?",
    onClose: () => setConfirm(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setConfirm(null)
    }, "Keep it"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      size: "sm",
      onClick: () => {
        onRemove(confirm);
        setConfirm(null);
      }
    }, "Remove"))
  }, confirm !== null && items[confirm] ? `${items[confirm].name} will be removed from your basket.` : ""));
}
Object.assign(window, {
  BasketScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/BasketScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/CategoryScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Breadcrumb,
  SectionHeading,
  ProductCard,
  Tag,
  Select,
  Checkbox,
  Pagination,
  Button,
  VendorCard,
  EmptyState
} = window.OjuojaDesignSystem_fd3102;
function CategoryScreen({
  onNav,
  onAdd
}) {
  const [page, setPage] = React.useState(1);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [chip, setChip] = React.useState("All");
  const all = window.PRODUCTS.concat(window.PRODUCTS.map(p => ({
    ...p,
    name: p.name + " — large",
    price: p.price + 900,
    flag: undefined,
    was: undefined
  })));
  const list = verifiedOnly ? all.filter(p => p.verified) : all;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "32px 32px 96px"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Groceries"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Groceries",
    subtitle: "Staples, produce and provisions from verified Ikorodu vendors."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Sort by",
    options: ["Most popular", "Price: low to high", "Closest vendor"]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "grid",
      gridTemplateColumns: "236px 1fr",
      gap: 32,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22,
      position: "sticky",
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 11px/1 var(--font-body)",
      letterSpacing: ".09em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginBottom: 12
    }
  }, "Vendor"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: verifiedOnly,
    onChange: setVerifiedOnly
  }, "Verified vendors only"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: false,
    onChange: () => {}
  }, "Open now"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: false,
    onChange: () => {}
  }, "Free delivery"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 11px/1 var(--font-body)",
      letterSpacing: ".09em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginBottom: 12
    }
  }, "Area"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, ["Ita Elewa", "Agric", "Sabo", "Igbogbo"].map(a => /*#__PURE__*/React.createElement(Tag, {
    key: a,
    selected: chip === a,
    onClick: () => setChip(chip === a ? "All" : a)
  }, a)))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 11px/1 var(--font-body)",
      letterSpacing: ".09em",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      margin: "14px 0 12px"
    }
  }, "Top vendor"), /*#__PURE__*/React.createElement(VendorCard, {
    name: "Ojuoja Fresh",
    area: "Agric",
    verified: true,
    rating: 4.8,
    deliveryMins: 40
  }))), /*#__PURE__*/React.createElement("div", null, list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    title: "Nothing matches those filters",
    message: "Try widening your area or turning off verified-only.",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => setVerifiedOnly(false)
    }, "Clear filters")
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, list.map((p, i) => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: i
  }, p, {
    onAdd: () => onAdd(p),
    onClick: () => onNav("product")
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pages: 6,
    onChange: setPage
  })))));
}
Object.assign(window, {
  CategoryScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/CategoryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/Footer.jsx
try { (() => {
const {
  Logo
} = window.OjuojaDesignSystem_fd3102;
const COLS = [["About us", "Pricing", "Service", "Blog", "Case studies"], ["Vendors", "Delivery areas", "Support", "Careers", "Press"], ["Terms", "Privacy", "Refunds", "Contact", "WhatsApp"]];
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-brand)",
      color: "#fff",
      paddingTop: 64,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "0 32px",
      display: "grid",
      gridTemplateColumns: "1.4fr repeat(3,1fr)",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,.82)",
      fontSize: 14,
      maxWidth: "28ch"
    }
  }, "From hidden local gems to your daily essentials, discover the best of Ikorodu's vendors, delivered straight to you."), COLS.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, col.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "rgba(255,255,255,.9)",
      fontSize: 14,
      textDecoration: "none"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "48px auto 0",
      padding: "20px 32px 0",
      borderTop: "1px solid var(--border-on-brand)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      color: "rgba(255,255,255,.8)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "All Rights Reserved"), /*#__PURE__*/React.createElement("span", null, "www.ojuoja.shop")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-white.svg",
    alt: "",
    style: {
      width: "120%",
      maxWidth: "none",
      marginBottom: -40,
      display: "block"
    }
  })));
}
Object.assign(window, {
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/Header.jsx
try { (() => {
const {
  Logo,
  Icon,
  SearchField,
  IconButton,
  Button
} = window.OjuojaDesignSystem_fd3102;
function Header({
  onNav,
  cartCount = 0,
  active = "home"
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "#fff",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max-wide)",
      margin: "0 auto",
      height: "var(--layout-header-h)",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav("home");
    },
    style: {
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 26
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 36,
      padding: "0 16px",
      border: 0,
      borderRadius: "var(--radius-pill)",
      background: "var(--surface-lime)",
      color: "var(--oj-green-900)",
      font: "600 13px/1 var(--font-body)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout-grid",
    size: 14
  }), "Categories", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 22,
      font: "500 13px/1 var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "var(--text-body)",
      textDecoration: "none"
    }
  }, "About Ojuoja"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "var(--text-body)",
      textDecoration: "none"
    }
  }, "Become a Vendor")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 340,
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    submit: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "shopping-basket",
    variant: "solid",
    label: "Basket",
    count: cartCount,
    onClick: () => onNav("basket")
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: "var(--radius-sm)",
      background: "var(--pattern-market-bars)",
      backgroundColor: "#fff",
      display: "inline-block"
    }
  }))));
}
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  SectionHeading,
  CategoryCard,
  ProductCard,
  VendorCard,
  Accordion,
  PatternPanel,
  DeliveryNote,
  Tag
} = window.OjuojaDesignSystem_fd3102;
const PHOTO = "../../assets/photography/";
const CATEGORIES = [{
  title: "Food & Snacks",
  description: "Hot plates and small chops from nearby kitchens.",
  image: PHOTO + "cat-food-snacks.png"
}, {
  title: "Groceries",
  description: "Everyday staples from the market, picked this morning.",
  image: PHOTO + "cat-groceries.png"
}, {
  title: "Drinks",
  description: "Chilled minerals, juices and water by the crate.",
  image: PHOTO + "cat-drinks.png"
}];
const PRODUCTS = [{
  name: "Fresh sweet corn (5 pcs)",
  price: 1800,
  was: 2200,
  vendor: "Mama T Stores",
  verified: true,
  rating: 4.8,
  image: PHOTO + "prod-corn.png",
  flag: {
    label: "-18%"
  }
}, {
  name: "Bell peppers, mixed (1kg)",
  price: 3200,
  vendor: "Ojuoja Fresh",
  verified: true,
  rating: 4.7,
  image: PHOTO + "prod-peppers.png"
}, {
  name: "Small chops platter",
  price: 5500,
  vendor: "Iya Basira Kitchen",
  rating: 4.6,
  image: PHOTO + "prod-snacks.png",
  flag: {
    label: "Trending",
    tone: "accent"
  }
}, {
  name: "Ugwu & efo bundle",
  price: 1200,
  vendor: "Ita Elewa Greens",
  verified: true,
  rating: 4.9,
  image: PHOTO + "prod-greens.png"
}];
const FAQS = [{
  q: "What is Ojuoja?",
  a: "Ojuoja is a marketplace that puts verified Ikorodu vendors — kitchens, groceries, drinks — in one basket and delivers to your door."
}, {
  q: "How long does delivery take?",
  a: "Most orders inside Ikorodu arrive within 35 to 60 minutes, depending on your area and the vendor's prep time."
}, {
  q: "Which areas do you cover?",
  a: "Ita Elewa, Agric, Ijede Road, Sabo, Igbogbo and Ebute today. New areas open every month."
}, {
  q: "How do I pay?",
  a: "Card, bank transfer, or cash to the rider on delivery."
}, {
  q: "How do I become a vendor?",
  a: "Register your shop, upload a valid ID and your first ten products. Verification takes two working days."
}];
function HomeScreen({
  onNav,
  onAdd
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PatternPanel, {
    variant: "lime",
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "0 32px",
      display: "grid",
      gridTemplateColumns: "1fr 0.85fr",
      alignItems: "end",
      minHeight: 460
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 72,
      paddingBottom: 72
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.02,
      letterSpacing: "-.015em",
      color: "var(--oj-green-900)",
      margin: 0
    }
  }, "Your Next Craving", /*#__PURE__*/React.createElement("br", null), "is Just Around the", /*#__PURE__*/React.createElement("br", null), "Corner."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 15,
      color: "var(--oj-green-800)",
      maxWidth: "42ch"
    }
  }, "Discover the best of Ikorodu vendors, delivered straight to you."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: "flex",
      gap: 14,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    badgeIcon: "shopping-basket",
    onClick: () => onNav("category")
  }, "Shop Now!"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNav("category")
  }, "Browse vendors"))), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "end",
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PHOTO + "hero-basket-lime.png",
    alt: "",
    style: {
      width: "100%",
      maxWidth: 420,
      display: "block"
    }
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "96px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Closer Than", /*#__PURE__*/React.createElement("br", null), "You Think")
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--text-muted)",
      maxWidth: "52ch"
    }
  }, "Explore new flavors, trends, and essentials from verified vendors across Ikorodu. Every shop on Ojuoja is checked by hand before it opens for orders."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    badgeIcon: "shopping-basket",
    onClick: () => onNav("category")
  }, "Shop Now!"), /*#__PURE__*/React.createElement(DeliveryNote, null, /*#__PURE__*/React.createElement("strong", null, "Free delivery"), " on baskets over \u20A610,000")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement(CategoryCard, _extends({
    key: c.title
  }, c, {
    onClick: () => onNav("category")
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "96px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: 2,
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Trending in Ikorodu", /*#__PURE__*/React.createElement("br", null), "this week")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    selected: true
  }, "All"), /*#__PURE__*/React.createElement(Tag, null, "Food & Snacks"), /*#__PURE__*/React.createElement(Tag, null, "Groceries"), /*#__PURE__*/React.createElement(Tag, null, "Drinks"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 24
    }
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.name
  }, p, {
    onAdd: () => onAdd(p),
    onClick: () => onNav("product")
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "96px 32px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Get the best grocery", /*#__PURE__*/React.createElement("br", null), "deals within Ikorodu."),
    subtitle: "One basket, many vendors, one delivery fee. Order before 6pm for same-day drop-off."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    badgeIcon: "shopping-basket",
    onClick: () => onNav("category")
  }, "Shop Now!"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "48px auto 0",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement(PatternPanel, {
    variant: "green",
    padded: false,
    style: {
      borderRadius: "var(--radius-md)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      height: 360
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PHOTO + "hero-basket-lime.png",
    alt: "",
    style: {
      height: "92%",
      objectFit: "contain",
      mixBlendMode: "multiply"
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 820,
      margin: "0 auto",
      padding: "96px 32px 0"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Frequently Asked", /*#__PURE__*/React.createElement("br", null), "Questions")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: FAQS,
    defaultOpen: 0
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "96px auto 0",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(VendorCard, {
    name: "Mama T Stores",
    area: "Ita Elewa",
    verified: true,
    rating: 4.9,
    deliveryMins: 35
  }), /*#__PURE__*/React.createElement(VendorCard, {
    name: "Iya Basira Kitchen",
    area: "Sabo",
    rating: 4.6,
    deliveryMins: 45
  }), /*#__PURE__*/React.createElement(VendorCard, {
    name: "Ojuoja Fresh",
    area: "Agric",
    verified: true,
    rating: 4.8,
    deliveryMins: 40
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "96px auto 96px",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement(PatternPanel, {
    variant: "market",
    padded: false,
    style: {
      height: 300,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-brand)",
      color: "#fff",
      padding: "36px 40px",
      maxWidth: 440,
      marginLeft: 56
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1.06,
      letterSpacing: "-.015em",
      color: "#fff",
      margin: 0
    }
  }, "Skip the Distance,", /*#__PURE__*/React.createElement("br", null), "Find the Flavor"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 14,
      color: "rgba(255,255,255,.86)"
    }
  }, "Ikorodu's vendors, verified and delivered. No traffic, no haggling, no wasted trip."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "onbrand",
    badgeIcon: "shopping-basket",
    onClick: () => onNav("category")
  }, "Shop Now!"))))));
}
Object.assign(window, {
  HomeScreen,
  PRODUCTS,
  CATEGORIES,
  FAQS,
  PHOTO
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/ProductScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Breadcrumb,
  Button,
  Badge,
  Rating,
  QuantityStepper,
  Tabs,
  Accordion,
  DeliveryNote,
  VendorCard,
  ProductCard,
  Icon
} = window.OjuojaDesignSystem_fd3102;
function ProductScreen({
  onNav,
  onAdd
}) {
  const [qty, setQty] = React.useState(2);
  const [tab, setTab] = React.useState("Details");
  const p = window.PRODUCTS[0];
  const naira = n => "₦" + n.toLocaleString("en-NG");
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "32px 32px 96px"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Groceries",
      href: "#"
    }, {
      label: p.name
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 56,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--pattern-lime-stripe)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 420
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: "",
    style: {
      width: "78%",
      objectFit: "contain"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      gap: 12
    }
  }, [window.PHOTO + "prod-corn.png", window.PHOTO + "prod-greens.png", window.PHOTO + "prod-peppers.png"].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 84,
      height: 84,
      borderRadius: "var(--radius-media)",
      overflow: "hidden",
      background: "var(--surface-card)",
      border: i === 0 ? "2px solid var(--border-brand)" : "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: s,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "soft",
    icon: "badge-check"
  }, "Verified vendor"), /*#__PURE__*/React.createElement(Badge, {
    tone: "lime",
    icon: "bike"
  }, "35 mins"), /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "-18%")), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 16,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1.06,
      letterSpacing: "-.015em",
      color: "var(--text-heading)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: 4.8,
    count: 212
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "Sold by ", p.vendor)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: "flex",
      alignItems: "baseline",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 32,
      color: "var(--text-brand)"
    }
  }, naira(p.price)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: "var(--text-faint)",
      textDecoration: "line-through"
    }
  }, naira(p.was))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 15,
      color: "var(--text-muted)",
      maxWidth: "46ch"
    }
  }, "Picked this morning at Ikorodu market and kept in the shade until your rider arrives. Sold in bundles of five, husk on."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty,
    unit: "bundles"
  }), /*#__PURE__*/React.createElement(Button, {
    badgeIcon: "shopping-basket",
    onClick: () => {
      onAdd(p);
      onNav("basket");
    }
  }, "Add to Basket"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leadingIcon: "heart"
  }, "Save")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(DeliveryNote, null, /*#__PURE__*/React.createElement("strong", null, "Free delivery"), " within Ikorodu on baskets over \u20A610,000")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "underline",
    items: ["Details", "Vendor", "Reviews"],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 18
    }
  }, tab === "Details" && /*#__PURE__*/React.createElement(Accordion, {
    numbered: false,
    defaultOpen: 0,
    items: [{
      q: "What's in the bundle",
      a: "Five ears of sweet corn, husk on, roughly 1.4kg in total."
    }, {
      q: "Storage",
      a: "Keep in the husk in a cool place and use within three days."
    }, {
      q: "Returns",
      a: "Tell the rider before they leave and we replace it on the next run."
    }]
  }), tab === "Vendor" && /*#__PURE__*/React.createElement(VendorCard, {
    name: "Mama T Stores",
    area: "Ita Elewa",
    verified: true,
    rating: 4.9,
    deliveryMins: 35
  }), tab === "Reviews" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, [["Bimpe A.", "Corn was still warm from the sun. Rider called ahead."], ["Tunde O.", "Second order this week. Good price for five."]].map(([n, t]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      padding: 16,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 14,
      color: "var(--text-heading)"
    }
  }, n), /*#__PURE__*/React.createElement(Rating, {
    value: 5,
    size: 12
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, t)))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 28,
      color: "var(--text-brand)",
      margin: 0
    }
  }, "More from this vendor"), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 24
    }
  }, window.PRODUCTS.map((x, i) => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: i
  }, x, {
    onAdd: () => onAdd(x)
  }))))));
}
Object.assign(window, {
  ProductScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/ProductScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.PatternPanel = __ds_scope.PatternPanel;

__ds_ns.CartLine = __ds_scope.CartLine;

__ds_ns.CategoryCard = __ds_scope.CategoryCard;

__ds_ns.DeliveryNote = __ds_scope.DeliveryNote;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.VendorCard = __ds_scope.VendorCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
