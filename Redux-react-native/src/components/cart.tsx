import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, Button } from 'react-native';
import { incrementQuantity, decrementQuantity, RootState } from '../store/store';

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  return (
    <View>
      {Object.values(cart).map((item) => (
        <View key={item.id} style={{ padding: 10 }}>
          <Text>{item.title}</Text>
          <Text>${item.price}</Text>
          <Text>Số lượng: {item.quantity}</Text>
          <Button title="+" onPress={() => dispatch(incrementQuantity(item.id))} />
          <Button title="-" onPress={() => dispatch(decrementQuantity(item.id))} />
        </View>
      ))}
    </View>
  );
};

export default Cart;
