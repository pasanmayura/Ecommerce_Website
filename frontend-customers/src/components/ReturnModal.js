'use client';

import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import '@/styles/ReturnModal.css';

const ReturnModal = ({ open, onClose, onSubmit, products, selectedProduct }) => {
  const [selectedProductId, setSelectedProductId] = useState(selectedProduct?.id || '');
  const [reason, setReason] = useState('');

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedProductId || !reason) {
      alert('Please select a product and provide a reason for the return.');
      return;
    }

    const returnData = {
      productId: selectedProductId,
      reason,
    };

    onSubmit(returnData);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      className="return-modal"
    >
      <Box className="return-modal-content">
        <Typography 
          variant="h6" 
          component="h2" 
          className="return-modal-title"
        >
          Return Request
        </Typography>

        <TextField
          select
          label="Select Product"
          value={selectedProductId}
          onChange={handleProductChange}
          fullWidth
          margin="normal"
          className="return-modal-field"
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Reason for Return"
          value={reason}
          onChange={handleReasonChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          className="return-modal-field"
        />

        <Box className="return-modal-actions">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            className="return-modal-button"
          >
            Submit
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={onClose}
            className="return-modal-button"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReturnModal;