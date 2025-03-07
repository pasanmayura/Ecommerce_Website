'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname
import { FiGrid, FiBox, FiUsers, FiShoppingCart } from "react-icons/fi";
import { FiClipboard, FiChevronDown, FiChevronUp, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { FaSyncAlt } from "react-icons/fa";
import "@/styles/Sidebar.css";

export const Sidebar = () => {
  const router = useRouter(); // Initialize router
  const pathname = usePathname(); // Get the current pathname
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState(null); // Add state for active submenu item

  const menuItems = [
    { 
      id: "dashboard", 
      title: "Dashboard", 
      icon: <FiGrid />, 
      subItems: [
        { title: "Most Sold Items", link: "/MostSold" },
        { title: "Customer Returns", link: "/CustomerReturns" }        
      ] 
    },
    { 
      id: "manage-products", 
      title: "Manage Products", 
      icon: <FiBox />, 
      subItems: [
        { title: "Add Products", link: "/AddProducts" },
        { title: "Product List", link: "/ProductList" },
        { title: "Add Category", link: "/AddCategory" },
        { title: "Category List", link: "/CategoryList" },
        { title: "Add Batch", link: "/AddBatch" }
      ] 
    },
    { 
      id: "orders", 
      title: "Orders", 
      icon: <FiShoppingCart />, 
      subItems: [
        { title: "Customer Orders", link: "/CustomerOrders" }
      ] 
    },
    { 
      id: "employees", 
      title: "Employees", 
      icon: <FiUsers />, 
      subItems: [
        { title: "Add Employee", link: "/AddEmployee" },
        { title: "Employee Details", link: "/EmployeeDetails" }
      ] 
    },
    { 
      id: "reports", 
      title: "Reports", 
      icon: <FiClipboard />, 
      subItems: [
        { title: "Inventory Report", link: "/InventoryReport" },
        { title: "Low Stock Report", link: "/LowStockReport" }
      ] 
    }
  ];

  useEffect(() => {
    // Set the active submenu item based on the current pathname
    menuItems.forEach(item => {
      item.subItems.forEach(subItem => {
        if (subItem.link === pathname) {
          setActiveSubItem(subItem.title);
          setExpandedMenus(prev => [...prev, item.id]); // Expand the parent menu
        }
      });
    });
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubItemClick = (link, title) => {
    setActiveSubItem(title); // Set the active submenu item
    router.push(link); // Navigate to the subitem page
  };

  const handleLogout = () => {
    console.log("Logging out...");
    sessionStorage.clear();
    router.push("/LoginAdmin");
  };

  return (
    <div className="sidebar-container">
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-content">          
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button 
                    className="menu-btn" 
                    onClick={() => toggleSubmenu(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.title}</span>
                    <span className="chevron">{expandedMenus.includes(item.id) ? <FiChevronUp /> : <FiChevronDown />}</span>
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <ul className="submenu">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.title}>
                          <button 
                            className={`submenu-btn ${activeSubItem === subItem.title ? 'active' : ''}`} 
                            onClick={() => handleSubItemClick(subItem.link, subItem.title)}
                          >
                            {subItem.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <a className="button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <div className="logout">LOGOUT</div>
        </a>
      </aside>
    </div>
  );
};
