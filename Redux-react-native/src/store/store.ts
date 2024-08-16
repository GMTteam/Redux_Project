import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

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
      saveCartToStorage(state);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state[productId]) {
        state[productId].quantity! += 1;
        saveCartToStorage(state);
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
        saveCartToStorage(state);
      }
    },
    setCart: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
  },
});

// Thunk để tải giỏ hàng khi ứng dụng khởi động
export const loadCart = createAsyncThunk('cart/loadCart', async (_, { dispatch }) => {
  const cart = await loadCartFromStorage();
  dispatch(cartSlice.actions.setCart(cart));
});

export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// Load cart ngay khi ứng dụng khởi động
store.dispatch(loadCart());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
