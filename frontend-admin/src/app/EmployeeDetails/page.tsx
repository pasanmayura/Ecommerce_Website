'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getEmployee } from '@/Services/employeeService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import "@/styles/EmployeeDetails.css";

type Employee = {
  AdminID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
};

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getEmployee();
        setEmployees(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employee data');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'AdminID',
        header: 'Admin ID',
        size: 100,
      },
      {
        accessorKey: 'FirstName',
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'LastName',
        header: 'Last Name', // Fixed the typo from "Last ID" to "Last Name"
        size: 150,
      },
      {
        accessorKey: 'Email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'PhoneNumber',
        header: 'Phone Number',
        size: 150,
      },
      {
        accessorKey: 'Role',
        header: 'Role',
        size: 120,
      },
    ],
    [],
  );

  return (
    <div className="EmployeeDetails-page">
      <Header />
      <main className="EmployeeDetails-main-layout">
        <div className="EmployeeDetails-sidebar-container">
          <Sidebar />
        </div>
        
        <div className="EmployeeDetails-content-container">
          <div className="page-header">
            <h1 className='page-title'>Employee List</h1>
          </div>
          
          <div className="EmployeeDetails-table-container">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <MaterialReactTable 
              columns={columns} 
              data={employees} 
              state={{ isLoading }}
              enableTopToolbar={true}
              enableBottomToolbar={true}
              enableColumnFilters={true}
              enableGlobalFilter={true}
              enablePagination={true}
              muiTableContainerProps={{ className: 'data-table' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDetails;