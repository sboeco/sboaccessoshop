import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';
import Confetti from 'react-confetti';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <p className="text-gray-600 mb-2">
              Thank you for your order! We've received your request and will process it shortly.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono font-semibold text-momoBlue">{orderNumber}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-momoBlue mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• We'll contact you to confirm delivery details</li>
              <li>• Your order will be prepared and shipped</li>
              <li>• Estimated delivery: 2-5 business days</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/home" className="block">
              <Button className="w-full bg-momoBlue hover:bg-blue-700">
                <FaHome className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link to="/profile" className="block">
              <Button variant="outline" className="w-full">
                <FaShoppingBag className="mr-2" />
                View My Orders
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t">
            <p>Need help? Contact us at support@sboaccessories.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;