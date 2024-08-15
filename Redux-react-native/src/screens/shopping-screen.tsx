import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Modal, View, Image, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../components/product-item';
import { addToCart, incrementQuantity, decrementQuantity } from '../store/store';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number, count: number };
}

const ShoppingScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const cart = useSelector((state: any) => state.cart); // Access cart from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleIncrementQuantity = (productId: number) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrementQuantity = (productId: number) => {
    dispatch(decrementQuantity(productId));
  };

  const openModalAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModalAddToCart(item)}>
            <ProductItem
              productId={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              category={item.category}
              rating={item.rating}
              quantity={cart[item.id]?.quantity || 0} // Pass quantity from cart
              addToCart={handleAddToCart}
              incrementQuantity={handleIncrementQuantity}
              decrementQuantity={handleDecrementQuantity}
            />
          </TouchableOpacity>
        )}
      />

      {selectedProduct && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={{ padding: 20 }}>
            <Image source={{ uri: selectedProduct.image }} style={{ height: 200, width: 200 }} />
            <Text>{selectedProduct.title}</Text>
            <Text>{selectedProduct.description}</Text>
            <Text>${selectedProduct.price}</Text>
            <Button
              title="Add to Cart"
              onPress={() => {
                handleAddToCart(selectedProduct);
                setModalVisible(false);
              }}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ShoppingScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00CED1',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
