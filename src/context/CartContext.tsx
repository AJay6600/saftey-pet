import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// Using `any` for Product since API uses `_id` and mock uses `id`
interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const getProductId = (p: any) => p._id || p.id;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("petsafety_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("petsafety_cart", JSON.stringify(newItems));
  };

  const addToCart = useCallback((product: any) => {
    setItems((prev) => {
      const targetId = getProductId(product);
      const existing = prev.find((i) => getProductId(i.product) === targetId);
      const updated = existing
        ? prev.map((i) =>
            getProductId(i.product) === targetId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem("petsafety_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => getProductId(i.product) !== productId);
      localStorage.setItem("petsafety_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(productId);
      setItems((prev) => {
        const updated = prev.map((i) =>
          getProductId(i.product) === productId ? { ...i, quantity } : i,
        );
        localStorage.setItem("petsafety_cart", JSON.stringify(updated));
        return updated;
      });
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => save([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
