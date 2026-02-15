
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  FileText, 
  Flag, 
  Users, 
  Tags, 
  CreditCard,
  LogOut,
} from 'lucide-react';
import { logout } from '../store';

const SidebarLink: React.FC<{ to: string; icon: any; children: React.ReactNode }> = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive 
          ? 'bg-[#FF8533] text-white shadow-lg' 
          : 'text-gray-500 hover:bg-orange-50 hover:text-[#FF8533]'
      }`
    }
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className=" text-sm">{children}</span>
  </NavLink>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm z-20">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-12 h-12">
              <img src="images/logo.png" alt="" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FE8031] to-[#721E94]">
              Modaksha App
            </span>
          </div>

          <nav className="space-y-1">
            <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
            <SidebarLink to="/posts" icon={FileText}>Post Management</SidebarLink>
            <SidebarLink to="/reports" icon={Flag}>Report Management</SidebarLink>
            <SidebarLink to="/users" icon={Users}>User Management</SidebarLink>
            <SidebarLink to="/recharges" icon={CreditCard}>Recharge Management</SidebarLink>
            <SidebarLink to="/categories" icon={Tags}>Category Management</SidebarLink>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-[#721E94] backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 ">
            <h1 className="text-xl  font-semibold text-white ">Admin Dashboard</h1>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
