// src/store/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Định nghĩa Product và CartState như đã nêu
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
}

interface CartState {
  [key: number]: Product;
}

const initialState: CartState = {};

// Thực hiện lưu trữ trạng thái giỏ hàng vào AsyncStorage
const saveCartToStorage = async (cart: CartState) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

// Thực hiện tải trạng thái giỏ hàng từ AsyncStorage
const loadCartFromStorage = async (): Promise<CartState> => {
  try {
    const cartData = await AsyncStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : {};
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return {};
  }
};

// Tạo slice cho cart
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (state[product.id]) {
        state[product.id].quantity! += 1;
      } else {
        state[product.id] = { ...product, quantity: 1 };
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state[productId]) {
        state[productId].quantity! += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state[productId]) {
        if (state[productId].quantity! > 1) {
          state[productId].quantity! -= 1;
        } else {
          delete state[productId];
        }
      }
    },
  },
});

export const loadCart = createAsyncThunk('cart/loadCart', loadCartFromStorage);
export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export default store;
