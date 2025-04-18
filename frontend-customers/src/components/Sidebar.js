'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { FiBox, FiUsers, FiLogOut } from "react-icons/fi";
import { FiMenu, FiX } from "react-icons/fi";
import ConfirmationDialog from '@/components/ConfirmationDialog';
import "@/styles/Sidebar.css";

export const Sidebar = () => {
  const router = useRouter(); // Initialize router
  const pathname = usePathname(); // Get the current pathname
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState(null); 
  const [openDialog, setOpenDialog] = useState(false);

  const menuItems = [
    { 
      id: "manageAccount", 
      title: "Manage My Account", 
      icon: <FiUsers />, 
      subItems: [
        { title: "My Profile", link: "/MyAccount" },
        { title: "Change Password", link: "/ChangePassword" }        
      ] 
    },
    { 
      id: "myOrders", 
      title: "My Orders", 
      icon: <FiBox />, 
      subItems: [
        { title: "Completed", link: "/CompletedOrders" },
        { title: "Returns", link: "/ReturnOrders" }
      ] 
    },
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
    router.push("/HomePage");
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
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
                    {/* <span className="chevron">{expandedMenus.includes(item.id) ? <FiChevronUp /> : <FiChevronDown />}</span> */}
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
        <a className="button" onClick={() => openConfirmationDialog()}>
          <FiLogOut className="logout-icon" />
          <div className="logout">LOGOUT</div>
        </a>
      </aside>
      <ConfirmationDialog
        open={openDialog}
        onClose={closeConfirmationDialog}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to Log out ?"
      />
    </div>
  );
};
