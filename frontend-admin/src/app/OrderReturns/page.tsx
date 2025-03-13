'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { AiOutlineFileSearch } from "react-icons/ai";
import { getOrderReturns } from '@/Services/orderService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";
import "@/styles/Structure.css";

type OrderReturns = {
  ReturnID: string;
  OrderID: string;
  CustomerName: string;
  ReturnDate: Date;
  Status: string;  
};

const OrderReturns = () => {
  const [OrderReturns, setOrderReturns] = useState<OrderReturns[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderReturns = async () => {
      const data = await getOrderReturns();
      setOrderReturns(data);
    };

    fetchOrderReturns();
  }, []);

  const columns = useMemo<MRT_ColumnDef<OrderReturns>[]>(
    () => [
      {
        accessorKey: 'ReturnID',
        header: 'Return ID',
        size: 100,
      },
      {
        accessorKey: 'OrderID',
        header: 'Order ID',
        size: 100,
      },
      {
        accessorKey: 'CustomerName',
        header: 'Customer Name',
        size: 150,
      },
      {
        accessorKey: 'ReturnDate',
        header: 'Return Date',
        size: 100,
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        size: 100,
      },
      {
        accessorKey: 'Actions',
        header: 'Actions',
        size: 20,
        Cell: ({ row }) => (
          <button style={{ backgroundColor: '#0A2F6E', borderRadius: 50, width: '60px', height: '30px' }} onClick={() => router.push(`/ViewOrderReturn?orderId=${row.original.OrderID}`)}>
            <AiOutlineFileSearch color='white' size={20} />
          </button>
        ),
      },
    ],
    [OrderReturns],
  );

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Order Returns</h1>
          <div className="table-content">
            <MaterialReactTable columns={columns} data={OrderReturns} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default OrderReturns;