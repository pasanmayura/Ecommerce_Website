'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { getCategories, deleteCategory } from '@/Services/categoryService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import "@/styles/Register.css"; 
import "@/styles/CategoryList.css";

type Category = {
  CategoryID: string;
  Category_Name: string;
  AdminID: string;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    router.push(`/CategoryEdit?id=${category.CategoryID}`);
    console.log('Edit category:', category);
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        const result = await deleteCategory(selectedCategory.CategoryID);
        if (result.message === 'Category deleted successfully') {
          setCategories(categories.filter(c => c.CategoryID !== selectedCategory.CategoryID));
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setOpenDialog(false);
        setSelectedCategory(null);
      }
    }
  };

  const openConfirmationDialog = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
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
            <button onClick={() => openConfirmationDialog(row.original)} className="delete-button"><MdDelete /></button>
          </div>
        ),
      },
    ],
    [categories],
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
      <ConfirmationDialog
        open={openDialog}
        onClose={closeConfirmationDialog}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default CategoryList;