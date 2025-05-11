import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  // Dialog style constants
  const dialogStyles = {
    paper: {
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      maxWidth: '500px',
      width: '100%'
    }
  };

  const titleStyles = {
    backgroundColor: '#0A2F6E',
    color: 'white',
    padding: '16px 24px',
    fontWeight: 600,
    fontSize: '20px'
  };

  const contentStyles = {
    padding: '24px 24px 16px',
    backgroundColor: '#f9fafc'
  };

  const contentTextStyles = {
    color: '#333',
    fontSize: '16px',
    marginBottom: '8px',
    lineHeight: 1.6
  };

  const actionsStyles = {
    padding: '12px 24px 20px',
    backgroundColor: '#f9fafc',
    justifyContent: 'flex-end',
    borderTop: '1px solid #eaedf3'
  };

  const cancelButtonStyles = {
    borderRadius: '6px',
    textTransform: 'none',
    padding: '8px 16px',
    fontWeight: 500,
    color: '#555',
    backgroundColor: '#e9ecf2',
    boxShadow: 'none',
    marginRight: '12px',
    '&:hover': {
      backgroundColor: '#d8dce4',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    }
  };

  const confirmButtonStyles = {
    borderRadius: '6px',
    textTransform: 'none',
    padding: '8px 20px',
    fontWeight: 500,
    color: 'white',
    backgroundColor: '#e74c3c',
    boxShadow: '0 2px 5px rgba(231, 76, 60, 0.3)',
    '&:hover': {
      backgroundColor: '#c0392b',
      boxShadow: '0 4px 8px rgba(231, 76, 60, 0.4)'
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ style: dialogStyles.paper }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle style={titleStyles}>
        {title}
      </DialogTitle>
      <DialogContent style={contentStyles}>
        <DialogContentText style={contentTextStyles}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={actionsStyles}>
        <Button 
          onClick={onClose} 
          style={{
            borderRadius: '6px',
            textTransform: 'none',
            padding: '8px 16px',
            fontWeight: 500,
            color: '#555',
            backgroundColor: '#e9ecf2',
            boxShadow: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#d8dce4';
            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#e9ecf2';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          style={{
            borderRadius: '6px',
            textTransform: 'none',
            padding: '8px 20px',
            fontWeight: 500,
            color: 'white',
            backgroundColor: '#e74c3c',
            boxShadow: '0 2px 5px rgba(231, 76, 60, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c0392b';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(231, 76, 60, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#e74c3c';
            e.currentTarget.style.boxShadow = '0 2px 5px rgba(231, 76, 60, 0.3)';
          }}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;