import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const cart = useSelector((state: any) => state.cart);
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
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              quantity={cart[item.id]?.quantity || 0}
              addToCart={handleAddToCart}
              incrementQuantity={handleIncrementQuantity}
              decrementQuantity={handleDecrementQuantity}
            />
          </TouchableOpacity>
        )}
        style={{ opacity: modalVisible ? 0.5 : 1 }}
      />

      {selectedProduct && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
              <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} resizeMode='contain'/>
              <View style={styles.descriptionRow}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    handleAddToCart(selectedProduct);
                    // closeModal();
                  }}
                >
                  <Ionicons name="cart-outline"  style={styles.icon} />
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 110,
    height: 180,
    marginBottom: 10,
  },
  descriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    
  },
  descriptionLabel: {
    fontSize: 15,
    color: 'black',
  },
  descriptionText: {
    fontSize: 15,
    textAlign: 'left',
    flexShrink: 1,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  addToCartButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 10,
    width: '55%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
    fontSize: 25,
    color: "#fff",
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#bebebe',
    borderRadius: 10,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
