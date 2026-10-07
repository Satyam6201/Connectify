import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-base-100 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {showSidebar && <Sidebar />}

        <main
          className={`flex-1 min-h-0 flex flex-col overflow-y-auto ${
            showSidebar ? "pb-20 lg:pb-0" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;