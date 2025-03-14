'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getLowStockProducts } from '@/Services/dashboardService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";

type LowStockProduct = {
  ProductID: string;
  Product_Name: string;
  Category_Name: string;
  Threshold: number;
  TotalStock: number;
};

const LowStockDetails = () => {
    const [LowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      const data = await getLowStockProducts();
      setLowStockProducts(data);
    };

    fetchLowStockProducts();
  }, []);

  const columns = useMemo<MRT_ColumnDef<LowStockProduct>[]>(
    () => [
      {
        accessorKey: 'ProductID',
        header: 'Product ID',
        size: 100,
      },
      {
        accessorKey: 'Product_Name',
        header: 'Product Name',
        size: 100,
      },
      {
        accessorKey: 'Category_Name',
        header: 'Category Name',
        size: 100,
      },
      {
        accessorKey: 'Threshold',
        header: 'Threshold',
        size: 100,
      },
      {
        accessorKey: 'TotalStock',
        header: 'Total Stock',
        size: 100,
      },
    ],
    [LowStockProducts],
  );

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>
        <div className="content">
          <h1></h1>
          <div className="table-content">
            <p>Low Stock Product List</p>
            <MaterialReactTable columns={columns} data={LowStockProducts} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default LowStockDetails;