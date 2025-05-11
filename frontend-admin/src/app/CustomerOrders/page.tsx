'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { AiOutlineFileSearch } from "react-icons/ai";
import { getOrders } from '@/Services/orderService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/CustomerOrders.css";

type Orders = {
  OrderID: string;
  Total_Amount: string;
  PaymentStatus: string;
  OrderDate: Date;
  OrderStatus: string;
  CustomerID: string;
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Orders>[]>(
    () => [
      {
        accessorKey: 'OrderID',
        header: 'Order ID',
        size: 100,
      },
      {
        accessorKey: 'Total_Amount',
        header: 'Total Amount',
        size: 100,
        Cell: ({ cell }) => `Rs.${cell.getValue<string>()}`,
      },
      {
        accessorKey: 'PaymentStatus',
        header: 'Payment Status',
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return (
            <span className={`payment-status ${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'OrderDate',
        header: 'Order Date',
        size: 100,
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: 'OrderStatus',
        header: 'Order Status',
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return (
            <span className={`order-status ${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'CustomerID',
        header: 'Customer ID',
        size: 100,
      },
      {
        accessorKey: 'Actions',
        header: 'Actions',
        size: 20,
        Cell: ({ row }) => (
          <button 
            className="view-order-btn"
            onClick={() => router.push(`/ViewOrder?orderId=${row.original.OrderID}`)}
          >
            <AiOutlineFileSearch size={20} />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="customer-orders">
      <Header />
      <main className="customer-orders-main-content">
        <div className="customer-orders-sidebar-section">
          <Sidebar />
        </div>
        <div className="customer-orders-content-area">
          <div className="customer-orders-page-header">
            <h1 className='page-title'>Customer Orders</h1>
          </div>
          <div className="customer-orders-table-container">
            <MaterialReactTable 
              columns={columns} 
              data={orders} 
              enableColumnFilters
              enableGlobalFilter
              enablePagination
              muiTablePaperProps={{
                elevation: 0,
                className: 'customer-orders-table-paper'
              }}
            />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default CustomerOrders;