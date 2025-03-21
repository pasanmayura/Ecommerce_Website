'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getProducts, deleteProduct } from '@/Services/productService';
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmationDialog from '@/components/ConfirmationDialog';
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    router.push(`/ProductEdit?id=${product.ProductID}`);
    console.log('Edit product:', product);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        const result = await deleteProduct(selectedProduct.BatchID);
        if (result.message === 'Product deleted successfully') {
          // Update the state directly to remove the deleted product
          setProducts(products.filter(product => product.BatchID !== selectedProduct.BatchID));
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setOpenDialog(false);
        setSelectedProduct(null);
      }
    }
  };

  const openConfirmationDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
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
            <button onClick={() => openConfirmationDialog(row.original)} className='delete-button'><MdDelete /></button>
          </div>
        ),
      },
    ],
    [products],
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
            <h1>Product List</h1>
            <MaterialReactTable columns={columns} data={products} />
          </div>
        </div>
      </main>
      <ConfirmationDialog
        open={openDialog}
        onClose={closeConfirmationDialog}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
      /> 
    </div>
  );
};

export default ProductList;