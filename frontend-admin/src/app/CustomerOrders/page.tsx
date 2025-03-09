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
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";
import "@/styles/Structure.css";

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
      },
      {
        accessorKey: 'PaymentStatus',
        header: 'Payment Status',
        size: 100,
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
          <button onClick={() => router.push(`/ViewOrder?orderId=${row.original.OrderID}`)}>
            <AiOutlineFileSearch color='blue' size={20} />
          </button>
        ),
      },
    ],
    [orders],
  );

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Customer Orders</h1>
          <div className="table-content">
            <MaterialReactTable columns={columns} data={orders} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default CustomerOrders;