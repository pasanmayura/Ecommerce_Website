import {Header} from "@/components/Header"; 
import {Sidebar} from "@/components/Sidebar";
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";

const MostSold = () => {
  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>

        <div className="content">
          <h1>Test</h1>
          <div className="form"></div>
        </div>
      </main>  
    </div>
  );
};

export default MostSold; // ✅ Default export
