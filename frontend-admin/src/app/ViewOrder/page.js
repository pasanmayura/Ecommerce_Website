'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { viewOrderbyId, updateOrderStatus } from '@/Services/orderService';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AlertComponent from '@/components/AlertComponent';
import { BiArrowBack } from 'react-icons/bi';
import { MdModeEdit, MdSave } from 'react-icons/md';
import "@/styles/ViewOrder.css";

const ViewOrder = () => {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState('');
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const data = await viewOrderbyId(orderId);
          if (data.length > 0) {
            const { FirstName, LastName, Email, MobileNumber, Street_No, Village, city, Postal_Code, OrderStatus, PaymentStatus } = data[0];
            setOrder({ FirstName, LastName, Email, MobileNumber, Street_No, Village, city, Postal_Code, OrderStatus, PaymentStatus });
            setUpdatedOrderStatus(OrderStatus);
            setUpdatedPaymentStatus(PaymentStatus);
            setProducts(data.map(item => ({
              ProductID: item.ProductID,
              BatchID: item.BatchID,
              Quantity: item.Quantity
            })));
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          setAlert({ severity: 'error', title: 'Error', message: 'Failed to load order details' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateOrderStatus(orderId, updatedOrderStatus, updatedPaymentStatus);
      setOrder(prevOrder => ({
        ...prevOrder,
        OrderStatus: updatedOrderStatus,
        PaymentStatus: updatedPaymentStatus
      }));
      setIsEditing(false);
      setAlert({ severity: 'success', title: 'Success', message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      setAlert({ severity: 'error', title: 'Error', message: 'Error updating order status' });
    }
  };

  const handleBackToOrders = () => {
    router.push('/CustomerOrders');
  };

  const closeAlert = () => {
    setAlert({ severity: '', title: '', message: '' });
  };

  if (loading) {
    return (
      <div className="view-order">
        <Header />
        <main className="ViewOrder-main-content">
          <div className="ViewOrder-sidebar-section">
            <Sidebar />
          </div>
          <div className="ViewOrder-content-area">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="view-order">
        <Header />
        <main className="ViewOrder-main-content">
          <div className="ViewOrder-sidebar-section">
            <Sidebar />
          </div>
          <div className="ViewOrder-content-area">
            <div className="error-container">
              <p>Order not found or could not be loaded.</p>
              <Button 
                variant="contained" 
                onClick={handleBackToOrders} 
                className="btn back-btn"
              >
                <BiArrowBack /> Back to Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="view-order">
      <Header />
      <main className="ViewOrder-main-content">
        <div className="ViewOrder-sidebar-section">
          <Sidebar />
        </div>

        <div className="ViewOrder-content-area">
          <div className="ViewOrder-page-header">
            <h1>Order Details</h1>
            <div className="order-id">Order ID: #{orderId}</div>
          </div>

          <div className="card customer-details">
            <div className="card-header">
              <h2>Customer Information</h2>
            </div>
            <div className="card-body">
              <div className="details-row">
                <TextField
                  label="First Name"
                  value={order.FirstName || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
                <TextField
                  label="Last Name"
                  value={order.LastName || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
              </div>
              <div className="details-row">
                <TextField
                  label="Email"
                  value={order.Email || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
                <TextField
                  label="Mobile Number"
                  value={order.MobileNumber || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
              </div>
            </div>
          </div>

          <div className="card shipping-details">
            <div className="card-header">
              <h2>Shipping Address</h2>
            </div>
            <div className="card-body">
              <div className="details-row address-row">
                <TextField
                  label="Street No"
                  value={order.Street_No || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
                <TextField
                  label="Village"
                  value={order.Village || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
                <TextField
                  label="City"
                  value={order.city || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
                <TextField
                  label="Postal Code"
                  value={order.Postal_Code || ''}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  className="text-field"
                />
              </div>
            </div>
          </div>

          <div className="card ViewOrder-status">
            <div className="card-header">
              <h2>Order Status</h2>
              {!isEditing ? (
                <Button 
                  variant="outlined" 
                  onClick={handleUpdateStatus}
                  className="edit-btn"
                  startIcon={<MdModeEdit />}
                >
                  Edit Status
                </Button>
              ) : null}
            </div>
            <div className="card-body">
              <div className="details-row">
                <TextField
                  label="Order Status"
                  value={updatedOrderStatus}
                  onChange={(e) => setUpdatedOrderStatus(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  select
                  InputProps={{ readOnly: !isEditing }}
                  className={`text-field status-field ${isEditing ? 'editable' : ''}`}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  label="Payment Status"
                  value={updatedPaymentStatus}
                  onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  select
                  InputProps={{ readOnly: !isEditing }}
                  className={`text-field status-field ${isEditing ? 'editable' : ''}`}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              </div>
              {isEditing && (
                <div className="save-btn-container">
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    className="save-btn"
                    startIcon={<MdSave />}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="card product-list">
            <div className="card-header">
              <h2>Products</h2>
            </div>
            <div className="card-body">
              {products.length === 0 ? (
                <p className="no-products">No products found for this order.</p>
              ) : (
                products.map((product, index) => (
                  <div key={index} className="product-item">
                    <TextField
                      label="Product ID"
                      value={product.ProductID || ''}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className="text-field"
                    />
                    <TextField
                      label="Batch ID"
                      value={product.BatchID || ''}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className="text-field"
                    />
                    <TextField
                      label="Quantity"
                      value={product.Quantity || ''}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className="text-field"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="actions-container">
            <Button 
              variant="contained" 
              onClick={handleBackToOrders}
              className="back-btn"
              startIcon={<BiArrowBack />}
            >
              Back To Orders
            </Button>
          </div>
        </div>
      </main>
      
      {alert.message && (
        <AlertComponent
          severity={alert.severity}
          title={alert.title}
          message={alert.message}
          onClose={closeAlert}
          sx={{ 
            width: '350px', 
            position: 'fixed', 
            top: '24px', 
            right: '24px', 
            zIndex: 9999 
          }}
        />
      )}  
    </div>
  );
};

export default ViewOrder;