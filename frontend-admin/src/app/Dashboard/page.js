'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import CardComponent from '@/components/CardComponent';
import SalesChart from '@/components/salesChart';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getDashboardDetails, getSalesChart } from '@/Services/dashboardService';
import "@/styles/Dashboard.css";

const Dashboard = () => {
  const [details, setDetails] = useState({});
  const [salesData, setSalesData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getDashboardDetails();
      setDetails(data);
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      const data = await getSalesChart();
      setSalesData(data);
    };

    fetchSalesData();
  }, []);

  const handleLowStockClick = () => {
    router.push('/LowStockDetails');
  };

  const cardDetails = [
    { title: 'Pending Orders', value: details.PendingOrders, description: 'Total number of pending orders', icon: '📋' },
    { title: 'Total Revenue', value: `Rs.${details.TotalRevenue}`, description: 'Total revenue from paid orders', icon: '💰' },
    { title: 'Total Customers', value: details.TotalCustomers, description: 'Total number of customers', icon: '👥' },
    { title: 'Total Products', value: details.TotalProducts, description: 'Total number of products', icon: '📦' },
    { title: 'Pending Returns', value: details.PendingOrderReturns, description: 'Total number of pending order returns', icon: '↩️' },
    { 
      title: 'Low Stock Products', 
      value: details.NoOfLowStockProducts, 
      description: 'Click To See Details', 
      onClick: handleLowStockClick,
      icon: '⚠️'
    },
  ];

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-container">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <div className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          
          <div className="stats-grid">
            <Grid container spacing={3}>
              {cardDetails.map((detail, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CardComponent 
                    title={detail.title} 
                    value={detail.value} 
                    description={detail.description} 
                    onClick={detail.onClick}
                    icon={detail.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          
          <div className="sales-chart-container">
            <div className="chart-header">
              <h2>Sales Overview</h2>
              <p>Revenue for the past 7 days</p>
            </div>
            <div className="chart-wrapper">
              <SalesChart data={salesData} />
            </div>
          </div>
        </div>
      </main> 
    </div>
  );
};

export default Dashboard;