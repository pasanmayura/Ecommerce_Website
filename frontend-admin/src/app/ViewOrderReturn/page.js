'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { viewOrderReturnById, updateOrderReturnStatus } from '@/Services/orderService';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AlertComponent from '@/components/AlertComponent';
import "@/styles/ViewOrderReturns.css";

const ViewOrderReturn = () => {
  const [orderReturn, setOrderReturn] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedOrderReturnStatus, setUpdatedOrderReturnStatus] = useState('');
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const searchParams = useSearchParams();
  const orderReturnId = searchParams.get('orderReturnId');
  const router = useRouter();

  useEffect(() => {
    const fetchOrderReturn = async () => {
      if (orderReturnId) {
        const data = await viewOrderReturnById(orderReturnId);
        if (data.length > 0) {
          const { OrderReturnID, OrderID, ReturnStatus, OrderReturnDate, Email, MobileNumber, Reason } = data[0];
          setOrderReturn({ OrderReturnID, OrderID, ReturnStatus, OrderReturnDate, Email, MobileNumber, Reason });
          setUpdatedOrderReturnStatus(ReturnStatus);
          setProducts(data.map(item => ({
            ProductID: item.ProductID,
            ProductName: item.Product_Name,
            SellingPrice: item.Selling_Price,
            Quantity: item.Quantity
          })));
        }
      }
    };

    fetchOrderReturn();
  }, [orderReturnId]);

  if (!orderReturn) {
    return <div>Loading...</div>;
  }

  const handleBackToOrderReturns = () => {
    router.push('/OrderReturns');
  };

  const handleUpdateStatus = () => {
    setIsEditing(true);
  };

    const handleSave = async () => {
        try {
        await updateOrderReturnStatus(orderReturnId, updatedOrderReturnStatus);
        setOrderReturn(prevOrderReturn => ({
            ...prevOrderReturn,
            ReturnStatus: updatedOrderReturnStatus
        }));
        setIsEditing(false);
        setAlert({ severity: 'success', title: 'Success', message: 'Order return status updated successfully' });
        } catch (error) {
        setAlert({ severity: 'error', title: 'Error', message: error.message });
        }
    };

    const closeAlert = () => {
       setAlert({ severity: '', title: '', message: '' });
    };


  return (
    <div className="ViewOrderReturn">
      <Header />
      <main className="ViewOrderReturn-main-content">
        <div className="ViewOrderReturn-sidebar-section">
          <Sidebar />
        </div>

        <div className="ViewOrderReturn-content">
          <h1>Order Return Details</h1>
          <div className="order-details">
            <div className="order-details-row">
              <TextField
                label="Order Return ID"
                value={orderReturn.OrderReturnID}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Order ID"
                value={orderReturn.OrderID}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="order-details-row">
              <TextField
                label="Return Status"
                value={updatedOrderReturnStatus}
                onChange={e => setUpdatedOrderReturnStatus(e.target.value)}
                select
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: !isEditing,
                }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <TextField
                label="Order Return Date"
                value={new Date(orderReturn.OrderReturnDate).toLocaleDateString()}
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
                value={orderReturn.Email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Mobile Number"
                value={orderReturn.MobileNumber}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="order-details-row">
              <TextField
                label="Reason"
                value={orderReturn.Reason}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
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
                  label="Product Name"
                  value={product.ProductName}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Selling Price"
                  value={product.SellingPrice}
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
            <div className="action-buttons">
              <Button variant="contained" onClick={handleBackToOrderReturns} style={{ backgroundColor: '#0A2F6E' }}> Back To Order Returns </Button>
              <Button variant="contained" onClick={handleUpdateStatus} style={{ backgroundColor: '#0A2F6E' }}> Update Status </Button>
              <Button variant="contained" onClick={handleSave} style={{ backgroundColor: '#0A2F6E' }} disabled={!isEditing}> Save </Button>
            </div>
        </div>
      </main> 
      {alert.message && (
        <AlertComponent 
            severity={alert.severity} 
            title={alert.title} 
            onClose={closeAlert}
            sx={{ width: '25%', position: 'fixed', top: '10%', left: '75%', zIndex: 9999 }}
        />
      )} 
    </div>
  );
};

export default ViewOrderReturn;