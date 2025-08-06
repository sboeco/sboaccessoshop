import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import axiosInstance from '@/api/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FaUser, 
  FaShoppingBag, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaEye,
  FaSpinner
} from 'react-icons/fa';

const UserProfile = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: '',
    userEmail: '',
    phoneNumber: '',
  });
  const [originalProfileData, setOriginalProfileData] = useState({});

  useEffect(() => {
    if (auth?.user) {
      const userData = {
        userName: auth.user.userName || '',
        userEmail: auth.user.userEmail || '',
        phoneNumber: auth.user.phoneNumber || '',
      };
      setProfileData(userData);
      setOriginalProfileData(userData);
    }
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // This would be your actual API endpoint for fetching user orders
      const response = await axiosInstance.get('/api/user/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for demonstration
      setOrders([
        {
          id: 'ORD-123456',
          date: '2024-01-15',
          status: 'Delivered',
          total: 299.99,
          items: [
            { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
            { name: 'Phone Case', quantity: 2, price: 50.00 }
          ]
        },
        {
          id: 'ORD-123457',
          date: '2024-01-20',
          status: 'Processing',
          total: 149.99,
          items: [
            { name: 'Bluetooth Speaker', quantity: 1, price: 149.99 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axiosInstance.put('/api/user/profile', profileData);
      setOriginalProfileData(profileData);
      setEditMode(false);
      // You might want to update the auth context here as well
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(originalProfileData);
    setEditMode(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile and view your orders</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <FaUser />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FaShoppingBag />
              My Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FaUser className="text-momoBlue" />
                    Profile Information
                  </CardTitle>
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      variant="outline"
                      size="sm"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <FaSave className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={profileData.userName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    value={profileData.userEmail}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaShoppingBag className="text-momoBlue" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-momoBlue" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-2">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className="text-lg font-bold text-momoBlue mt-1">
                              E{order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>E{item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">
                            <FaEye className="mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;