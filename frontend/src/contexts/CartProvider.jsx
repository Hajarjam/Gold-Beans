import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import CartContext from "./CartContext";

const LEGACY_CART_KEY = "cart_items";
const GUEST_CART_KEY = "cart_items_guest";

function parseStoredCart(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getClientIdentifier(user) {
  if (!user) return null;
  return user._id || user.id || user.email || null;
}

export function CartProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const clientIdentifier = getClientIdentifier(user);

  // Storage key is user-scoped when authenticated, otherwise browser guest cart.
  const storageKey = useMemo(() => {
    if (isAuthenticated && clientIdentifier) {
      return `cart_items_client_${clientIdentifier}`;
    }
    return GUEST_CART_KEY;
  }, [isAuthenticated, clientIdentifier]);

  const [items, setItems] = useState([]);
  const [hydratedKey, setHydratedKey] = useState(null);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Load client-specific cart whenever auth identity/storage key changes.
  useEffect(() => {
    if (authLoading) return;

    let raw = localStorage.getItem(storageKey);

    // Migrate legacy global cart key once to the currently active client key.
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_CART_KEY);
      if (legacy) {
        localStorage.setItem(storageKey, legacy);
        localStorage.removeItem(LEGACY_CART_KEY);
        raw = legacy;
      }
    }

    setItems(parseStoredCart(raw));
    setHydratedKey(storageKey);
  }, [storageKey, authLoading]);

  // Persist only after the current storage key has been hydrated.
  useEffect(() => {
    if (authLoading) return;
    if (hydratedKey !== storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey, hydratedKey, authLoading]);

  function addToCart(product) {
    setItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((item) => item._id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function updateQty(product, quantity) {
    setItems((prev) =>
      prev.map((item) =>
        item._id === product._id ? { ...item, qty: quantity } : item
      )
    );
  }

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeFromCart, clearCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
}


