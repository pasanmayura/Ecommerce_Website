'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Search, Filter, Download, AlertTriangle } from 'lucide-react';
import Button from '@mui/material/Button';
import { getInventoryReport } from '@/Services/ReportService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '@/styles/InventoryReport.css';
 

const InventoryReport = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'product_name', direction: 'ascending' });

  // Fetch data from the backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventoryReport(); // Fetch data from the backend
        setInventory(data); // Set the fetched data to the inventory state
        setFilteredInventory(data); // Initialize filtered inventory
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let results = inventory;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(item =>
        item.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ProductID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(item => item.Category_Name === categoryFilter);
    }

    // Apply stock status filter
    if (stockStatusFilter !== 'all') {
      if (stockStatusFilter === 'low') {
        results = results.filter(item => item.Stock_Quantity < item.Threshold);
      } else if (stockStatusFilter === 'normal') {
        results = results.filter(item => item.Stock_Quantity >= item.Threshold);
      }
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredInventory(results);
  }, [inventory, searchTerm, categoryFilter, stockStatusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const getStockStatusClass = (item) => {
    return item.Stock_Quantity < item.Threshold ? 'low-stock' : 'normal-stock';
  };

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(inventory.map(item => item.Category_Name))];

  // Calculate summary stats
  const totalProducts = filteredInventory.length;
  const lowStockProducts = filteredInventory.filter(item => item.Stock_Quantity < item.Threshold).length;
  const totalInventoryValue = filteredInventory.reduce((acc, item) => acc + (item.Stock_Quantity * item.Buying_Price), 0).toFixed(2);
  const potentialRevenue = filteredInventory.reduce((acc, item) => acc + (item.Stock_Quantity * item.Selling_Price), 0).toFixed(2);

  const handleExport = () => {
    // Convert table data to CSV
    const headers = [
      'Product ID',
      'Product Name',
      'Category',
      'Stock',
      'Threshold',
      'Buying Price',
      'Selling Price',
      'Batches',
    ];
    const rows = filteredInventory.map(item => [
      item.ProductID,
      item.Product_Name,
      item.CategoryID,
      item.Stock_Quantity,
      item.Threshold,
      Number(item.Buying_Price || 0).toFixed(2), // Ensure Buying_Price is a number
      Number(item.Selling_Price || 0).toFixed(2), // Ensure Selling_Price is a number
      item.BatchID,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create a downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'InventoryReport.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Inventory Report', 14, 20);

    // Add table
    const headers = [['Product ID', 'Product Name', 'Category', 'Stock', 'Threshold', 'Buying Price', 'Selling Price', 'Batches']];
    const rows = filteredInventory.map(item => [
      item.ProductID,
      item.Product_Name,
      item.Category_Name,
      item.Stock_Quantity,
      item.Threshold,
      Number(item.Buying_Price || 0).toFixed(2), // Ensure Buying_Price is a number
      Number(item.Selling_Price || 0).toFixed(2), // Ensure Selling_Price is a number
      item.BatchID,
    ]);

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: rows,
    });

    // Save the PDF
    doc.save('Inventory_Report.pdf');
  };

  return (
    <div className="inventory-report-page">
      <Header isHomePage={false} />

      <main className="inventoryreport-content">
        <div className="inventoryreport-sidebar">
          <Sidebar />
        </div>
        <div className="page-header">
          <h1 className="page-title">Inventory Report</h1>
          <div className="action-buttons">
          <Button
              variant="contained"
              className="export-btn"
              startIcon={<Download size={16} />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              className="export-btn"
              startIcon={<Download size={16} />}
              onClick={handleDownloadPDF} // Attach the PDF download function
            >
              Export PDF
            </Button>
          </div>
        </div>

        <div className="inventory-summary">
          <div className="inventoryreport-summary-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="inventoryreport-summary-card warning">
            <h3>Low Stock Items</h3>
            <p>{lowStockProducts}</p>
            {lowStockProducts > 0 && <AlertTriangle className="alert-icon" size={20} />}
          </div>
          <div className="inventoryreport-summary-card">
            <h3>Inventory Value</h3>
            <p>Rs.{totalInventoryValue}</p>
          </div>
          <div className="inventoryreport-summary-card">
            <h3>Potential Revenue</h3>
            <p>Rs.{potentialRevenue}</p>
          </div>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Stock Status:</label>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="low">Low Stock</option>
                <option value="normal">Normal Stock</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading inventory data...</p>
          </div>
        ) : (
          <>
            {filteredInventory.length === 0 ? (
              <div className="no-results">
                <p>No products match your search criteria.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('ProductID')}>
                        Product ID{getSortIndicator('ProductID')}
                      </th>
                      <th onClick={() => handleSort('Product_Name')}>
                        Product Name{getSortIndicator('Product_Name')}
                      </th>
                      <th onClick={() => handleSort('Category_Name')}>
                        Category{getSortIndicator('Category_Name')}
                      </th>
                      <th onClick={() => handleSort('Stock_Quantity')}>
                        Stock{getSortIndicator('Stock_Quantity')}
                      </th>
                      <th onClick={() => handleSort('Threshold')}>
                        Threshold{getSortIndicator('Threshold')}
                      </th>
                      <th onClick={() => handleSort('Buying_Price')}>
                        Buy Price{getSortIndicator('Buying_Price')}
                      </th>
                      <th onClick={() => handleSort('Selling_Price')}>
                        Sell Price{getSortIndicator('Selling_Price')}
                      </th>
                      <th>Batches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={`${item.ProductID}-${item.BatchID}`} className={getStockStatusClass(item)}>
                        <td>{item.ProductID}</td>
                        <td>{item.Product_Name}</td>
                        <td>{item.Category_Name}</td>
                        <td className="stock-cell">
                          <span className={`stock-badge ${item.Stock_Quantity < item.Threshold ? 'low' : 'normal'}`}>
                            {item.Stock_Quantity}
                          </span>
                        </td>
                        <td>{item.Threshold}</td>
                        <td>Rs.{Number(item.Buying_Price || 0).toFixed(2)}</td> 
                        <td>Rs.{Number(item.Selling_Price || 0).toFixed(2)}</td>
                        <td>{item.BatchID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default InventoryReport;