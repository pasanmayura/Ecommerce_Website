'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdRefresh, MdFilterList, MdOutlineAssignmentReturn } from "react-icons/md";
import { getOrderReturns } from '@/Services/orderService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Tooltip,
  LinearProgress
} from '@mui/material';
import "@/styles/OrderReturns.css";

type OrderReturn = {
  ReturnID: string;
  OrderID: string;
  CustomerName: string;
  ReturnDate: Date;
  Status: string;
};

const OrderReturns = () => {
  const [orderReturns, setOrderReturns] = useState<OrderReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOrderReturns = async () => {
    try {
      setLoading(true);
      const data = await getOrderReturns();
      setOrderReturns(data);
    } catch (error) {
      console.error("Failed to fetch order returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderReturns();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchOrderReturns();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Get counts for the summary cards
  const totalReturns = orderReturns.length;
  const pendingReturns = orderReturns.filter(r => r.Status === 'Pending').length;
  const processedReturns = orderReturns.filter(r => r.Status === 'Processed').length;
  const rejectedReturns = orderReturns.filter(r => r.Status === 'Rejected').length;

  // Get status chip styling
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return { color: '#ff9800', bgColor: '#fff3e0' };
      case 'processed':
        return { color: '#4caf50', bgColor: '#e8f5e9' };
      case 'rejected':
        return { color: '#f44336', bgColor: '#ffebee' };
      default:
        return { color: '#607d8b', bgColor: '#eceff1' };
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const columns = useMemo<MRT_ColumnDef<OrderReturn>[]>(
    () => [
      {
        accessorKey: 'ReturnID',
        header: 'Return ID',
        size: 120,
      },
      {
        accessorKey: 'OrderID',
        header: 'Order ID',
        size: 120,
      },
      {
        accessorKey: 'CustomerName',
        header: 'Customer',
        size: 200,
      },
      {
        accessorKey: 'ReturnDate',
        header: 'Return Date',
        size: 150,
        Cell: ({ row }) => (
          <Typography variant="body2">
            {formatDate(row.original.ReturnDate)}
          </Typography>
        ),
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const { color, bgColor } = getStatusStyles(status);
          
          return (
            <Chip 
              label={status}
              className="status-chip"
              sx={{ 
                backgroundColor: bgColor,
                color: color,
                borderColor: `${color}30`,
                '& .MuiChip-label': { fontWeight: 500 }
              }}
              variant="outlined"
              size="small"
            />
          );
        },
      },
      {
        accessorKey: 'Actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <Tooltip title="View Return Details" arrow>
            <Button
              variant="contained"
              className="view-button"
              onClick={() => router.push(`/ViewOrderReturn?orderReturnId=${row.original.ReturnID}`)}
              startIcon={<AiOutlineFileSearch />}
              size="small"
            >
              View
            </Button>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  return (
    <div className="order-returns-page">
      <Header />
      <main className="order-returns-main">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="returns-content">
          <Box className="page-header">
            <Box className="header-title-section">
              <Typography variant="h4" className="page-title">
                Order Returns
              </Typography>
              <Typography variant="body1" className="page-description">
                Manage customer returns and refunds
              </Typography>
            </Box>
            <Box className="header-actions">
              <Button 
                variant="outlined" 
                startIcon={<MdRefresh className={refreshing ? 'spin' : ''} />}
                onClick={refreshData}
                disabled={loading || refreshing}
                className="refresh-button"
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} className="summary-cards">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="summary-card total">
                <CardContent className="card-content">
                  <Box className="card-icon total">
                    <MdOutlineAssignmentReturn />
                  </Box>
                  <Box className="card-data">
                    <Typography variant="h4" className="card-value">
                      {totalReturns}
                    </Typography>
                    <Typography variant="body2" className="card-label">
                      Total Returns
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="summary-card pending">
                <CardContent className="card-content">
                  <Box className="card-icon pending">
                    <MdOutlineAssignmentReturn />
                  </Box>
                  <Box className="card-data">
                    <Typography variant="h4" className="card-value">
                      {pendingReturns}
                    </Typography>
                    <Typography variant="body2" className="card-label">
                      Pending
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="summary-card processed">
                <CardContent className="card-content">
                  <Box className="card-icon processed">
                    <MdOutlineAssignmentReturn />
                  </Box>
                  <Box className="card-data">
                    <Typography variant="h4" className="card-value">
                      {processedReturns}
                    </Typography>
                    <Typography variant="body2" className="card-label">
                      Processed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="summary-card rejected">
                <CardContent className="card-content">
                  <Box className="card-icon rejected">
                    <MdOutlineAssignmentReturn />
                  </Box>
                  <Box className="card-data">
                    <Typography variant="h4" className="card-value">
                      {rejectedReturns}
                    </Typography>
                    <Typography variant="body2" className="card-label">
                      Rejected
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Table */}
          <Box className="table-section">
            {loading ? (
              <Box className="loading-state">
                <LinearProgress />
                <Typography variant="body1" className="loading-text">
                  Loading order returns...
                </Typography>
              </Box>
            ) : (
              <Card className="table-card">
                <CardContent className="table-container">
                  <MaterialReactTable 
                    columns={columns} 
                    data={orderReturns}
                    enableColumnFilters
                    enableSorting
                    enableTopToolbar
                    enableBottomToolbar
                    enablePagination
                    initialState={{
                      density: 'compact',
                      sorting: [
                        { id: 'ReturnDate', desc: true }
                      ],
                    }}
                    muiTableProps={{
                      sx: {
                        boxShadow: 'none',
                        border: 'none',
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: 'bold',
                        backgroundColor: '#f7f9fc',
                      }
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        </div>
      </main>
    </div>
  );
};

export default OrderReturns;