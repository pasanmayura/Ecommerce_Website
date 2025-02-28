'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getEmployee } from '@/Services/employeeService';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

type Employee = {
  AdminID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
};

const EmployeeDetails = () => {
  const [EmployeeDetails, setEmployeeDetails] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await getEmployee();
      setEmployeeDetails(data);
    };

    fetchEmployee();
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
            size: 100,
        },
        {
            accessorKey: 'LastName',
            header: 'Last ID',
            size: 100,
        },

        {
            accessorKey: 'Email',
            header: 'Email',
            size: 100,
        },
        {
            accessorKey: 'PhoneNumber',
            header: 'Phone Number',
            size: 100,
        },
        {
            accessorKey: 'Role',
            header: 'Role',
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
          <h1>Employee</h1>
          <div className="table-content">
            <p>Employee List</p>
            <MaterialReactTable columns={columns} data={EmployeeDetails} />
          </div>
        </div>
      </main> 
    </div>
  );
};

export default EmployeeDetails;