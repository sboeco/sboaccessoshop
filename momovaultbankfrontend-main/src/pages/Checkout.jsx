import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import { useCartContext } from '../Context/appstate/CartContext/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { quoteItems = [], totalPrice = 0, handleCheckout } = useCartContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckout(formData);
    navigate('/confirmation');
  };

  // Add formatter helper
  const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Shipping Details</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    label="Shipping Address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={quoteItems.length === 0}
                  >
                    Place Order
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {Array.isArray(quoteItems) && quoteItems.map((item) => (
              <Box key={item?.id || `temp-${Math.random()}`} sx={{ display: 'flex', mb: 2 }}>
                <img
                  src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                  alt={typeof item?.title === 'string' ? item.title : 'Product'}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {typeof item?.quantity === 'number' ? item.quantity : 0} × {formatPrice(item?.price)}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {formatPrice(Number(item?.price || 0) * Number(item?.quantity || 0))}
                </Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="h6">
                Total: {formatPrice(totalPrice)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;