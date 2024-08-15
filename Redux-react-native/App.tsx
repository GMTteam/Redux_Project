// App.tsx
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store, { loadCart } from './src/store/store';
import ShoppingScreen from './src/screens/shopping-screen';

const AppInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCart() as any); // Cast to any to bypass TypeScript error
  }, [dispatch]);

  return null; // This component does nothing but dispatches the async thunk
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
      <ShoppingScreen />
    </Provider>
  );
}
