'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { getCategories, deleteCategory, addCategory, updateCategory } from '@/Services/categoryService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
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
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false); 
  const [openEditModal, setOpenEditModal] = useState(false); 
  const [Category_Name, setCategory_Name] = useState(''); 
  const [CategoryID, setCategoryID] = useState(''); 
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddNew = () => {
    setCategory_Name('');
    setOpenAddModal(true); 
  };

  const handleEdit = (category: Category) => {
    setCategoryID(category.CategoryID);
    setCategory_Name(category.Category_Name);
    setOpenEditModal(true); 
  };

  const handleAddCategory = async () => {
    if (!Category_Name) {
      setAlertMessage('Category Name is required');
      return;
    }

    try {
      const result = await addCategory(Category_Name);
      if (result.message === 'Category added successfully') {
        setCategories([...categories, { CategoryID: result.CategoryID, Category_Name, AdminID: 'Admin' }]);
        setAlertMessage('');
        setCategory_Name('');
        setOpenAddModal(false); 
      } else {
        setAlertMessage(result.message);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setAlertMessage('Failed to add category. Please try again.');
    }
  };

  const handleUpdateCategory = async () => {
    if (!Category_Name) {
      setAlertMessage('Category Name is required');
      return;
    }

    try {
      const result = await updateCategory(CategoryID, Category_Name);
      if (result.message === 'Category updated successfully') {
        setCategories(categories.map(cat => 
          cat.CategoryID === CategoryID ? { ...cat, Category_Name } : cat
        ));
        setAlertMessage('');
        setOpenEditModal(false); 
      } else {
        setAlertMessage(result.message);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setAlertMessage('Failed to update category. Please try again.');
    }
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

  const columns = useMemo<MRT_ColumnDef<Category>[]>(() => [
    {
      accessorKey: 'CategoryID',
      header: 'CategoryID',
      size: 150,
    },
    {
      accessorKey: 'Category_Name',
      header: 'Category Name',
      size: 200,
    },
    {
      accessorKey: 'AdminID',
      header: 'Admin',
      size: 100,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 120,
      Cell: ({ row }) => (
        <div className="action-buttons">
          <button 
            onClick={() => handleEdit(row.original)} 
            className="edit-button" 
            title="Edit Category"
          >
            <MdEdit />
          </button>  
          <button 
            onClick={() => openConfirmationDialog(row.original)} 
            className="delete-button"
            title="Delete Category"
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="category-list-page">
      <Header />
      <main className="category-list-main">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="category-content">
          <div className="category-header">
            <h1 className='page-title'>Categories</h1>
            <button className="add-category-button" onClick={handleAddNew}>
              <MdAdd className="add-icon" />
              Add New Category
            </button>
          </div>
          
          <div className="table-container">
            {loading ? (
              <div className="loading-spinner">Loading categories...</div>
            ) : (
              <MaterialReactTable 
                columns={columns} 
                data={categories} 
                enableColumnFilters
                enableSorting
                enableTopToolbar
                enableBottomToolbar
                enablePagination
              />
            )}
          </div>
        </div>
      </main> 

      {/* Add Category Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={Category_Name}
            onChange={(e) => setCategory_Name(e.target.value)}
            error={!!alertMessage}
            helperText={alertMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        
          <DialogContent>
            <TextField
              fullWidth
              label="Category ID"
              value={CategoryID}
              disabled
              margin="normal" 
            />
            <TextField
              fullWidth
              label="Category Name"
              value={Category_Name}
              onChange={(e) => setCategory_Name(e.target.value)}
              margin="normal" 
              sx={{ mt: 3 }} 
            />
          </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleUpdateCategory} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

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