import React from 'react';
import { Bell, Lock, CreditCard, Users, Mail, Database } from 'lucide-react';
import FieldsManager from './FieldsManager';

const SettingsSection = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-start gap-4 mb-6">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-6">
        <SettingsSection
          icon={Database}
          title="Custom Fields"
          description="Manage custom fields for affiliate profiles and contacts"
        >
          <FieldsManager />
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Manage how you receive notifications"
        >
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-blue-500" />
              <span>Email notifications for new partner applications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-blue-500" />
              <span>Email notifications for commission payouts</span>
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Lock}
          title="Security"
          description="Update your security preferences"
        >
          <div className="space-y-4">
            <button className="text-blue-500 hover:text-blue-700">
              Change Password
            </button>
            <button className="text-blue-500 hover:text-blue-700">
              Enable Two-Factor Authentication
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={CreditCard}
          title="Billing"
          description="Manage your billing information and view invoices"
        >
          <div className="space-y-4">
            <button className="text-blue-500 hover:text-blue-700">
              Update Payment Method
            </button>
            <button className="text-blue-500 hover:text-blue-700">
              View Billing History
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Users}
          title="Team"
          description="Manage your team members and their permissions"
        >
          <div className="space-y-4">
            <button className="text-blue-500 hover:text-blue-700">
              Invite Team Member
            </button>
            <button className="text-blue-500 hover:text-blue-700">
              Manage Roles
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Mail}
          title="Email Templates"
          description="Customize your email templates"
        >
          <div className="space-y-4">
            <button className="text-blue-500 hover:text-blue-700">
              Edit Welcome Email
            </button>
            <button className="text-blue-500 hover:text-blue-700">
              Edit Commission Report Email
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;