'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { getCategories, deleteCategory } from '@/Services/categoryService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";

type Category = {
  CategoryID: string;
  Category_Name: string;
  AdminID: string;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleEdit = (product: Category) => {
    // Implement your edit logic here
    console.log('Edit product:', product);
  };

  const handleDelete = async (category: Category) => {
    // Implement your delete logic here
    console.log('Delete category:', category);
    const result = await deleteCategory(category.CategoryID);
    if (result.message === 'Category deleted successfully') {
      setCategories(categories.filter(c => c.CategoryID !== category.CategoryID));
    } else {
      alert(result.message);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'CategoryID',
        header: 'Category ID',
        size: 100,
      },
      {
        accessorKey: 'Category_Name',
        header: 'Category Name',
        size: 100,
      },
      {
        accessorKey: 'AdminID',
        header: 'Admin ID',
        size: 100,
      },
      {
        accessorKey: 'update',
        header: 'Update',
        size: 25,
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleEdit(row.original)} className="edit-button"><MdEdit /></button>  
            <button onClick={() => handleDelete(row.original)} className="delete-button"><MdDelete /></button>
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
          <h1>Manage Categories</h1>
          <div className="table-content">
            <p>Categories List</p>
            <MaterialReactTable columns={columns} data={categories} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default CategoryList;