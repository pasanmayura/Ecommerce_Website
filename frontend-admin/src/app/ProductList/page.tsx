'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getProducts } from '@/Services/productService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";

type Product = {
  ProductID: string;
  Product_Name: string;
  Description: string;
  Threshold: number;
  Buying_Price: number;
  Selling_Price: number;
  Stock_Quantity: number;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'ProductID',
        header: 'Product ID',
        size: 100,
      },
      {
        accessorKey: 'Product_Name',
        header: 'Product Name',
        size: 150,
      },
      {
        accessorKey: 'Buying_Price',
        header: 'Buying Price',
        size: 100,
      },
      {
        accessorKey: 'Selling_Price',
        header: 'Selling Price',
        size: 100,
      },
      {
        accessorKey: 'Description',
        header: 'Description',
        size: 200,
      },
      {
        accessorKey: 'Stock_Quantity',
        header: 'Stock Quantity',
        size: 100,
      },
      {
        accessorKey: 'Threshold',
        header: 'Threshold',
        size: 100,
      },
    ],
    [],
  );

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>
        <div className="content">
          <h1>Manage Products</h1>
          <div className="table-content">
            <p>Product List</p>
            <MaterialReactTable columns={columns} data={products} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default ProductList;