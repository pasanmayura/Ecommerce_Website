'use client';

import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReviewModal from '@/components/ReviewModal';
import '@/styles/OrderCard.css';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (review) => {
    console.log('Review submitted:', review);
    // Add logic to send the review to the backend
  };

  // Get appropriate status icon
  const getStatusIcon = () => {
    switch (order.status) {
      case 'Pending':
        return <WatchLaterIcon />;
      case 'Processing':
        return <PendingIcon />;
      case 'Shipped':
        return <LocalShippingIcon />;
      case 'Completed':
        return <CheckCircleIcon />;
      case 'Delivered':
        return <RateReviewIcon />;
      default:
        return null;
    }
  };

  // Get appropriate chip color
  const getStatusColor = () => {
    switch (order.status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'primary';
      case 'Shipped':
        return 'secondary';
      case 'Completed':
        return 'success';
      case 'Delivered':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format status text
  const formatStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'Pending';
      case 'Completed':
        return 'Completed';
      case 'Delivered':
        return 'To Be Reviewed';
      default:
        return status;
    }
  };

  const getDirectImageUrl = (url) => {
    if (url && url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    }
    return url;
};

  return (
    <Card className="order-card">
      <CardHeader
        avatar={
          <Avatar className={`status-avatar ${order.status}`}>
            {getStatusIcon()}
          </Avatar>
        }
        title={
          <Typography variant="h6">
            Order #{order.id}
          </Typography>
        }
        subheader={`Ordered on ${new Date(order.date).toLocaleDateString()}`}
        action={
          <Chip 
            label={formatStatus(order.status)} 
            color={getStatusColor()} 
            variant="outlined" 
            className="status-chip"
          />
        }
      />
      
      <CardContent>
        <Typography variant="body2" color="text.secondary" className="order-summary">
          {order.products.length === 1 
            ? '1 product' 
            : `${order.products.length} products`}
          
          <Typography component="span" className="order-total">
            Total: Rs.{order.total}
          </Typography>
        </Typography>
      </CardContent>
      
      <CardActions disableSpacing className="card-actions">
        {order.status === 'Delivered' && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RateReviewIcon />}
            size="small"
            className="review-button"
            onClick={() => handleReviewClick(order.products[0])}
          >
            Write Review
          </Button>
        )}
        
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show products"
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Order Items:
          </Typography>
          
          {order.products.map((product, index) => (
            <Box key={product.id} className="order-product-item">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <Avatar
                    src={getDirectImageUrl(product.image)}
                    alt={product.name}
                    variant="rounded"
                    className="order-product-image"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{product.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {product.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">
                    Rs.{product.price}
                  </Typography>
                </Grid>
              </Grid>
              {index < order.products.length - 1 && <Divider className="product-divider" />}
            </Box>
          ))}
          
          <Box className="order-totals">
            <Typography component="span" className="order-total">
                Total: Rs.{Number(order.total || 0).toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        product={{ ...selectedProduct, orderId: order.id }}
      />
    </Card>
  );
};

export default OrderCard;
