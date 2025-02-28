"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartBar, faBoxOpen, faClipboardList, faShoppingCart, 
    faUser, faFileAlt, faUserCircle 
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/Sidebar.module.css";  

export const Sidebar = () => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <aside className={styles.sidebar}>  
            <nav className={styles.navigation}>
                <div className={styles.navSection}>
                    <h3 onClick={() => toggleSection("dashboard")}>
                        <FontAwesomeIcon icon={faChartBar} /> Dashboard
                    </h3>
                    {openSections.dashboard && (
                        <ul>
                            <li><Link href="/mostSold">Most Sold</Link></li>
                            <li>Return Requests</li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("manageProducts")}>
                        <FontAwesomeIcon icon={faBoxOpen} /> Manage Products
                    </h3>
                    {openSections.manageProducts && (
                        <ul>
                            <li><Link href="/addProducts">Add Products</Link></li>
                            <li><Link href="/productList">Product List</Link></li>
                            <li><Link href="/addCategory">Add Category</Link></li>
                            <li><Link href="/categoryList">Category List</Link></li>
                            <li><Link href="/addBatch">Add Batch</Link></li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("inventoryUpdate")}>
                        <FontAwesomeIcon icon={faClipboardList} /> Inventory Update
                    </h3>
                    {openSections.inventoryUpdate && (
                        <ul>
                            <li>Update Stock</li>
                            <li>Update Products</li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("orders")}>
                        <FontAwesomeIcon icon={faShoppingCart} /> Orders
                    </h3>
                    {openSections.orders && (
                        <ul>
                            <li>Customer Orders</li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("employee")}>
                        <FontAwesomeIcon icon={faUser} /> Employee
                    </h3>
                    {openSections.employee && (
                        <ul>
                            <li><Link href="/addEmployee">Add Employee</Link></li>
                            <li><Link href="/employeeDetails">Employee Details</Link></li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("generateReports")}>
                        <FontAwesomeIcon icon={faFileAlt} /> Generate Reports
                    </h3>
                    {openSections.generateReports && (
                        <ul>
                            <li>Inventory Reports</li>
                            <li>Low Stock Reports</li>
                        </ul>
                    )}

                    <h3 onClick={() => toggleSection("profile")}>
                        <FontAwesomeIcon icon={faUserCircle} /> Profile
                    </h3>
                    {openSections.profile && (
                        <ul>
                            <li>Edit Profile</li>
                            <li>Log out</li>
                        </ul>
                    )}
                </div>
            </nav>
        </aside>
    );
};
