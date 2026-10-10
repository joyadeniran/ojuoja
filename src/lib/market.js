import { useEffect, useState } from "react";
import { PRODUCTS, VENDORS } from "../data/marketData.js";
import { getProducts, getVendors } from "./supabase.js";

/**
 * Shared marketplace store (vendors + products).
 *
 * Why this exists: screens used to import the static VENDORS/PRODUCTS arrays,
 * so vendors created in the database never appeared. A previous attempt to
 * read the DB fell back to the static list on any hiccup, which made real
 * vendors vanish and reappear. Here:
 *   - state starts from the local seed,
 *   - a successful DB read REPLACES it with seed + live rows,
 *   - a failed read keeps whatever we already had (never downgrades),
 *   - one module-level cache is shared by every screen (no per-screen flicker).
 */
let state = { vendors: VENDORS, products: PRODUCTS, loaded: false };
const listeners = new Set();
let inflight = null;

function emit(next) {
  state = { ...state, ...next };
  listeners.forEach((l) => l(state));
}

export function refreshMarket() {
  if (inflight) return inflight;
  inflight = Promise.all([getVendors(), getProducts()])
    .then(([vendors, products]) => {
      emit({
        vendors: vendors || state.vendors,
        products: products || state.products,
        loaded: true,
      });
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useMarket() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    listeners.add(setSnapshot);
    setSnapshot(state);
    refreshMarket();
    // Re-sync when the tab regains focus so newly approved vendors show up.
    const onFocus = () => refreshMarket();
    window.addEventListener("focus", onFocus);
    return () => {
      listeners.delete(setSnapshot);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return snapshot;
}
