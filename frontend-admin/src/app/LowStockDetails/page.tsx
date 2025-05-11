'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from 'next/navigation';
import { getLowStockProducts } from '@/Services/dashboardService';
import Button from '@mui/material/Button';
import { Typography, CircularProgress, Box, Chip } from '@mui/material';
import { MdArrowBack, MdWarning, MdInventory } from "react-icons/md";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/LowStockDetails.css";

type LowStockProduct = {
  ProductID: string;
  Product_Name: string;
  Category_Name: string;
  Threshold: number;
  TotalStock: number;
};

const LowStockDetails = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const data = await getLowStockProducts();
        setLowStockProducts(data);
      } catch (error) {
        console.error("Failed to fetch low stock products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const getStockStatus = (totalStock: number, threshold: number) => {
    const ratio = totalStock / threshold;
    if (ratio <= 0.5) return 'critical';
    if (ratio <= 0.8) return 'warning';
    return 'low';
  };

  const columns = useMemo<MRT_ColumnDef<LowStockProduct>[]>(
    () => [
      {
        accessorKey: 'ProductID',
        header: 'ID',
        size: 80,
      },
      {
        accessorKey: 'Product_Name',
        header: 'Product Name',
        size: 200,
        Cell: ({ row }) => (
          <div className="product-name">{row.original.Product_Name}</div>
        ),
      },
      {
        accessorKey: 'Category_Name',
        header: 'Category',
        size: 150,
      },
      {
        accessorKey: 'Threshold',
        header: 'Threshold',
        size: 100,
        Cell: ({ row }) => (
          <div className="threshold-value">{row.original.Threshold}</div>
        ),
      },
      {
        accessorKey: 'TotalStock',
        header: 'Current Stock',
        size: 130,
        Cell: ({ row }) => {
          const status = getStockStatus(row.original.TotalStock, row.original.Threshold);
          return (
            <Chip 
              label={row.original.TotalStock}
              className={`stock-chip ${status}`}
              icon={<MdInventory />}
            />
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        Cell: ({ row }) => {
          const status = getStockStatus(row.original.TotalStock, row.original.Threshold);
          const percentLeft = Math.round((row.original.TotalStock / row.original.Threshold) * 100);
          
          return (
            <div className={`status-indicator ${status}`}>
              <MdWarning className="status-icon" />
              <span>{status === 'critical' ? 'Critical' : status === 'warning' ? 'Warning' : 'Low'}</span>
              <div className="percentage-bar">
                <div 
                  className="percentage-fill"
                  style={{ width: `${percentLeft}%` }}
                ></div>
              </div>
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleBack = () => {
    router.push('/Dashboard');
  };

  return (
    <div className="low-stock-page">
      <Header />
      <main className="low-stock-main">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="low-stock-content">
          <div className="low-stock-header">
            <div className="header-left">
              <Typography variant="h4" className="low-stock-title">
                Low Stock Products
              </Typography>
              <Typography variant="subtitle1" className="low-stock-subtitle">
                Items requiring immediate attention
              </Typography>
            </div>
            <Button 
              variant="contained" 
              startIcon={<MdArrowBack />}
              onClick={handleBack} 
              className="back-button"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="summary-stats">
            <div className="stat-card critical">
              <div className="stat-icon"><MdWarning /></div>
              <div className="stat-content">
                <div className="stat-value">{lowStockProducts.filter(p => getStockStatus(p.TotalStock, p.Threshold) === 'critical').length}</div>
                <div className="stat-label">Critical</div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon"><MdWarning /></div>
              <div className="stat-content">
                <div className="stat-value">{lowStockProducts.filter(p => getStockStatus(p.TotalStock, p.Threshold) === 'warning').length}</div>
                <div className="stat-label">Warning</div>
              </div>
            </div>
            <div className="stat-card low">
              <div className="stat-icon"><MdWarning /></div>
              <div className="stat-content">
                <div className="stat-value">{lowStockProducts.filter(p => getStockStatus(p.TotalStock, p.Threshold) === 'low').length}</div>
                <div className="stat-label">Low</div>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            {loading ? (
              <Box className="loading-container">
                <CircularProgress />
                <Typography variant="body1" className="loading-text">
                  Loading inventory data...
                </Typography>
              </Box>
            ) : (
              <MaterialReactTable 
                columns={columns} 
                data={lowStockProducts}
                enableColumnFilters
                enableSorting
                enableTopToolbar
                enableBottomToolbar
                enablePagination
                initialState={{
                  sorting: [
                    { id: 'TotalStock', desc: false },
                  ],
                }}
                muiTableProps={{
                  sx: {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  },
                }}
                muiTableHeadCellProps={{
                  sx: {
                    fontWeight: 'bold',
                    backgroundColor: '#f7f9fc',
                  }
                }}
              />
            )}
          </div>
        </div>
      </main> 
    </div>
  );
};

export default LowStockDetails;