export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    avatar?: string;
  } | null;
  token: string | null;
  isLoading: boolean;
}

export interface WishlistState {
  items: string[]; // product ids
}
