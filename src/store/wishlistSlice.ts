import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistState } from "@/store/types";

const WISHLIST_KEY = "shopsphere_wishlist";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrate(state) {
      state.items = loadWishlist();
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.items.indexOf(action.payload);
      if (idx === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(idx, 1);
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem(WISHLIST_KEY);
    },
  },
});

export const { hydrate, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlist = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;
export const selectIsWishlisted = (id: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.includes(id);
