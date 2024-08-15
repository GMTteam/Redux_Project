import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProductItemProps {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number, count: number };
  quantity: number;
  addToCart: (product: any) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  productId,
  title,
  price,
  image,
  category,
  rating,
  quantity,
  addToCart,
  incrementQuantity,
  decrementQuantity,
}) => {
  // Render stars based on the rating value
  const renderStars = (ratingValue: number) => {
    const roundedStars = Math.round(ratingValue);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < roundedStars) {
        stars.push(<Icon key={i} name="star" size={16} color="#ffa500" style={styles.star} />);
      } else {
        stars.push(<Icon key={i} name="star" size={16} color="#bebebe" style={styles.star} />);
      }
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(rating.rate)}
          <Text style={styles.ratingCount}>{`${rating.count}`}</Text>
        </View>
        <View style={styles.number}>
          <Text style={styles.price}>Rs. {price}</Text>
          {quantity > 0 ? (
            <View style={styles.action}>
              <TouchableOpacity onPress={() => decrementQuantity(productId)} style={styles.smallButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(productId)} style={styles.smallButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => addToCart({ productId, title, price, image, category, rating })}>
              <Text>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.category}>Category: {category}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#aaaaaa',
    marginLeft: 20,
    marginRight: 20,
  },
  image: {
    width: 110,
    height: 150,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height:30,
  },
  smallButton: {
    backgroundColor: 'transparent',
    marginRight: 5,
    marginLeft: 5,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ProductItem;
