'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import CardComponent from '@/components/CardComponent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getDashboardDetails } from '@/Services/dashboardService';
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";

const Dashboard = () => {
  const [details, setDetails] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getDashboardDetails();
      setDetails(data);
    };

    fetchDetails();
  }, []);

  const cardDetails = [
    { title: 'Pending Orders', value: details.PendingOrders, description: 'Total number of pending orders' },
    { title: 'Total Revenue', value: `Rs.${details.TotalRevenue}`, description: 'Total revenue from paid orders' },
    { title: 'Total Customers', value: details.TotalCustomers, description: 'Total number of customers' },
    { title: 'Total Products', value: details.TotalProducts, description: 'Total number of products' },
    { title: 'Pending Order Returns', value: details.PendingOrderReturns, description: 'Total number of pending order returns' },
    { title: 'Low Stock Products', value: details.NoOfLowStockProducts, description: 'Total number of low stock products' },
  ];

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Dashboard</h1>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {cardDetails.map((detail, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CardComponent 
                    title={detail.title} 
                    value={detail.value} 
                    description={detail.description} 
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </main>  
    </div>
  );
};

export default Dashboard;
