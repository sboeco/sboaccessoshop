import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useCartContext } from '@/Context/appstate/CartContext/CartContext';
import { Header } from '@/components';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { onAdd } = useCartContext();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/products/${productId}`);
        const productData = response.data.product;

        setProduct({
          id: productData._id,
          name: productData.name,
          price: productData.price,
          description: productData.description,
          images: productData.images || [],
          color: productData.colors || [],
        });

        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      onAdd(
        {
          ...product,
          selectedColor,
          images: product.images || [],
        },
        quantity
      );
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      onAdd(
        {
          ...product,
          selectedColor,
          images: product.images || [],
        },
        quantity
      );
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center text-xl">No such product found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden bg-white p-4">
              <img
                src={product.images[currentImageIndex] || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2
                      ${currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600">E {product.price}</p>
            <p className="text-gray-600">{product.description}</p>

            {/* Color Selection */}
            {product.color?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Select Color</h3>
                <div className="flex gap-2">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2
                        ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={handleDecrement} className="px-3 py-1 border-r hover:bg-gray-100">
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button onClick={handleIncrement} className="px-3 py-1 border-l hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
    </div>
  );
};

export default ProductDetails;
              border: '2px solid #ccc',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
              {product.name}
            </Typography>

            <Divider sx={{ marginBottom: '16px' }} />

            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
              E{product.price}
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: '24px', lineHeight: '1.6' }}>
              {product.description}
            </Typography>

            {/* Color Selection */}
            {product.color && product.color.length > 0 && (
              <FormControl component="fieldset" sx={{ marginBottom: '24px' }}>
                <Typography variant="body1" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  Select Color:
                </Typography>
                <RadioGroup row value={selectedColor} onChange={handleColorChange}>
                  {product.color.map((color) => (
                    <FormControlLabel
                      key={color}
                      value={color}
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Box
                          sx={{
                            backgroundColor: color,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            border: selectedColor === color ? '2px solid #1976d2' : '1px solid #ccc',
                            cursor: 'pointer',
                          }}
                        />
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {/* Quantity Selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                gap: '12px',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Quantity:
              </Typography>
              <IconButton onClick={handleDecrement} sx={{ backgroundColor: '#f0f0f0', padding: '8px' }}>
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ minWidth: '36px', textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton onClick={handleIncrement} sx={{ backgroundColor: '#f0f0f0', padding: '8px' }}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* Action Buttons */}
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              sx={{
                backgroundColor: '#FF6F61',
                color: '#fff',
                '&:hover': { backgroundColor: '#e55a4f' },
                marginBottom: '16px',
                width: '100%',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleBuyNow}
              sx={{
                width: '100%',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              Buy Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductDetails;
