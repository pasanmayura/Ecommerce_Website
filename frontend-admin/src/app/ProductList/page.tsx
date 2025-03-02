'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getProducts } from '@/Services/productService';
import { MdEdit, MdDelete } from "react-icons/md";
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
  BatchID: string;
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

  const handleEdit = (product: Product) => {
    // Implement your edit logic here
    console.log('Edit product:', product);
  };

  const handleDelete = (product: Product) => {
    // Implement your delete logic here
    console.log('Delete product:', product);
  };

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
        size: 100,
      },
      {
        accessorKey: 'BatchID',
        header: 'Batch ID',
        size: 100,
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
        size: 100,
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
      {
        accessorKey: 'update',
        header: 'Update',
        size: 25,
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleEdit(row.original)} className='edit-button'><MdEdit /></button>  
            <button onClick={() => handleDelete(row.original)} className='delete-button'><MdDelete /></button>
          </div>
        ),
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
          
          <div className="table-content">
            <h1>Manage Products</h1>
            <p>Product List</p>
            <MaterialReactTable columns={columns} data={products} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default ProductList;