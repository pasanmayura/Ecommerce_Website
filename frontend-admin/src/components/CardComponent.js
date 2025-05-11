import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '@/styles/CardComponent.css';

const CardComponent = ({ title, value, description, onClick, icon }) => {
  return (
    <Card 
      className={`stat-card-dashboard ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
      elevation={3}
    >
      <CardContent className="card-content">
        <div className="card-header">
          <div className="card-icon">{icon}</div>
          <Typography className="card-title" variant="h6" component="div">
            {title}
          </Typography>
        </div>
        <Typography className="card-value" variant="h4" component="div">
          {value || '0'}
        </Typography>
        <Typography className="card-description" color="text.secondary">
          {description}
        </Typography>
        {onClick && (
          <div className="click-indicator">
            <span>View details</span>
            <span className="arrow">→</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardComponent;