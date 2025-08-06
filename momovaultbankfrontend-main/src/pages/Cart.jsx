import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Button, Typography } from '@mui/material'
import { useCartContext } from '../Context/appstate/CartContext/CartContext'
import { Link } from 'react-router-dom'
import { Divider } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const Cart = () => {
  const {
    totalQuantities = 0,
    quoteItems = [],
    onRemove,
    totalPrice = 0,
    toggleCartItemQuanitity,
  } = useCartContext()

  const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`

  return (
    <> 
      <Box
        sx={{
          width: 500,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingLeft: 2,
          position: 'relative',
        }}
        role='presentation'
      >
        <Box>
          <Box sx={{ width: 400 }} role='presentation'>
            {/* Title */}
            <Typography variant='h3' sx={{ fontWeight: 'bold', mt: 4 }}>
              Items in Cart {' '}
              <em style={{ color: 'red' }}>
                {typeof totalQuantities === 'number' ? totalQuantities : 0}
              </em>
            </Typography>

            {/* No cart items */}
            {quoteItems.length < 1 && (
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                mt={5}
                p={4}
                borderRadius='10px'
              >
                <Typography variant='h1' gutterBottom>
                  Your cart is empty
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 8,
                    marginTop: 4,
                  }}
                >
                  
                </Box>

                <Link to='/'>
                  <Button variant='contained' size='small'>
                    Go shopping
                  </Button>
                </Link>
              </Box>
            )}

            {/* Items */}
            {Array.isArray(quoteItems) && quoteItems.length >= 1 &&
              quoteItems.map((item) => (
                <Box
                  key={item?.id || `temp-${Math.random()}`}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    {/* Product image */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img
                        src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                        alt={typeof item?.title === 'string' ? item.title : 'Product'}
                        style={{ width: 70, height: 70 }}
                      />
                    </Box>

                    {/* Price */}
                    <Typography variant='body1' sx={{ ml: 2 }}>
                      {formatPrice(item?.price)}
                    </Typography>

                    {/* Title */}
                    <Typography variant='body1' sx={{ ml: 2 }}>
                      {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
                    </Typography>

                    {/* Increment and Decrement buttons */}
                    <Box
                      sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}
                    >
                      {/* Decrement button */}
                      <IconButton
                        onClick={() => toggleCartItemQuanitity(item.id, 'dec')}
                      >
                        <RemoveIcon style={{ color: 'red' }} />
                      </IconButton>

                      {/* Count */}
                      <Typography variant='body1' sx={{ mx: 1 }}>
                        {typeof item?.quantity === 'number' ? item.quantity : 0}
                      </Typography>

                      {/* Increment button */}
                      <IconButton
                        onClick={() => toggleCartItemQuanitity(item.id, 'inc')}
                      >
                        <AddIcon style={{ color: 'green' }} />
                      </IconButton>
                    </Box>

                    {/* Delete button */}
                    <Box>
                      <IconButton onClick={() => onRemove(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))}

            {/* Total price and Checkout button */}
            {quoteItems?.length >= 1 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {formatPrice(totalPrice)}
                </Typography>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                  >
                    Checkout
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Cart