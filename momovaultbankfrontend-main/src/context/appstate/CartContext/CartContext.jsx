import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [quoteItems, setQuoteItems] = useState(() => {
    const savedItems = localStorage.getItem('quoteItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [qty, setQty] = useState({});

  // Update totals whenever quoteItems changes
  useEffect(() => {
    let newTotalPrice = 0;
    let newTotalQuantities = 0;

    quoteItems.forEach((item) => {
      newTotalPrice += item.price * item.quantity;
      newTotalQuantities += item.quantity;
    });

    setTotalPrice(newTotalPrice);
    setTotalQuantities(newTotalQuantities);
  }, [quoteItems]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
  }, [quoteItems]);

  const onAdd = (product, quantity) => {
    if (!product || !product.id) {
      setErrorMessage('Invalid product');
      return;
    }

    setQuoteItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          title: product.name || 'Untitled Product', // Changed from product.title to product.name
          price: parseFloat(product.price) || 0,
          quantity,
          selectedImage: product.images?.[0] || null,
          selectedColor: product.selectedColor,
        },
      ];
    });

    setSuccessMessage(`${quantity} ${product.name || 'item'} added to the cart.`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const incQty = (productId) => {
    setQty((prevQty) => ({
      ...prevQty,
      [productId]: (prevQty[productId] || 1) + 1,
    }));
  };

  const decQty = (productId) => {
    setQty((prevQty) => ({
      ...prevQty,
      [productId]: Math.max((prevQty[productId] || 1) - 1, 1),
    }));
  };

  const onRemove = (product) => {
    if (!product || !product.id) return;
    setQuoteItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id)
    );
  };

  const toggleCartItemQuanitity = (id, value) => {
    setQuoteItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity =
            value === 'inc' ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleCheckout = async (customerData) => {
    try {
      const order = {
        items: quoteItems,
        totalAmount: totalPrice,
        customerData,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };
      
      // Here you would send the order to your backend
      // await axiosInstance.post('/api/orders', order);
      
      // Clear cart only after successful order
      setQuoteItems([]);
      setSuccessMessage('Order placed successfully!');
      return true;
    } catch (error) {
      setErrorMessage('Failed to place order. Please try again.');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        setShowCart,
        showCart,
        quoteItems,
        successMessage,
        setSuccessMessage,
        toggleCartItemQuanitity,
        errorMessage,
        setErrorMessage,
        totalQuantities,
        totalPrice,
        qty,
        onRemove,
        incQty,
        decQty,
        onAdd,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// Move PropTypes outside component
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

