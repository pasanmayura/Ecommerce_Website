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
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";
import "@/styles/ViewOrder.css";

const ViewOrder = () => {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState('');
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
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
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

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

  const handlebackToOrders = () => {
    router.push('/CustomerOrders');
  };

  const closeAlert = () => {
    setAlert({ severity: '', title: '', message: '' });
  };

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>

        <div className="content">
          <h1>Customer Details</h1>
          <div className="order-details">
            <div className="order-details-row">
              <TextField
                label="First Name"
                value={order.FirstName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Last Name"
                value={order.LastName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="order-details-row">
              <TextField
                label="Email"
                value={order.Email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Mobile Number"
                value={order.MobileNumber}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="order-details-row">
              <TextField
                label="Street No"
                value={order.Street_No}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Village"
                value={order.Village}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="City"
                value={order.city}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Postal Code"
                value={order.Postal_Code}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="order-details-row">
              <TextField
                label="Order Status"
                value={updatedOrderStatus}
                onChange={(e) => setUpdatedOrderStatus(e.target.value)}
                fullWidth
                margin="normal"
                select
                InputProps={{
                  readOnly: !isEditing,
                }}
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
                select
                InputProps={{
                  readOnly: !isEditing,
                }}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </div>
          </div>
          <h2>Products</h2>
          <div className="product-details">
            {products.map((product, index) => (
              <div key={index} className="product-item">
                <TextField
                  label="Product ID"
                  value={product.ProductID}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Batch ID"
                  value={product.BatchID}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Quantity"
                  value={product.Quantity}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            ))}
          </div>
          <Button variant="contained" onClick={handlebackToOrders} style={{ marginTop: '20px', backgroundColor: '#0A2F6E', marginBottom: '20px' }}> Back To Orders </Button>
          <Button variant="contained" onClick={handleUpdateStatus} style={{ marginTop: '20px', backgroundColor: '#0A2F6E', marginLeft: '20px', marginBottom: '20px' }}> Update status </Button>
          <Button variant="contained" onClick={handleSave} style={{ marginTop: '20px', backgroundColor: '#0A2F6E', marginLeft: '20px', marginBottom: '20px' }} disabled={!isEditing}> Save </Button>
        </div>
      </main>
      {alert.message && (
        <AlertComponent
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            onClose={closeAlert}
            sx={{ width: '25%', position: 'fixed', top: '10%', left: '75%', zIndex: 9999 }}
        />
    )}  
    </div>
  );
};

export default ViewOrder;