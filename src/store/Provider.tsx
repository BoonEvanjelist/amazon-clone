"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { hydrate as hydrateCart } from "@/store/cartSlice";
import { hydrate as hydrateAuth } from "@/store/authSlice";
import { hydrate as hydrateWishlist } from "@/store/wishlistSlice";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateCart());
    store.dispatch(hydrateAuth());
    store.dispatch(hydrateWishlist());
  }, []);
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}
