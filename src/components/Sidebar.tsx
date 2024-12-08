import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  Contact2,
  Settings,
  Target
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Building2, label: 'Affiliate Profiles', path: '/affiliate-profiles' },
  { icon: Contact2, label: 'Contacts', path: '/contacts' },
  { icon: Target, label: 'Opportunities', path: '/opportunities' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Users className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold">AffiliateHub</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;