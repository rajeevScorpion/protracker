import React, { useState } from 'react';
import { User, Mail, Briefcase, Phone } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

const AccountSettings = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    mobile: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        designation: profile.designation || '',
        company: profile.company || '',
        mobile: profile.mobile || '',
      });
    }
  }, [profile]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company/Organization
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile?.name || 'Not set'}</p>
                <p className="text-sm text-gray-500">Full Name</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile?.designation || 'Not set'}</p>
                <p className="text-sm text-gray-500">Designation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile?.company || 'Not set'}</p>
                <p className="text-sm text-gray-500">Company/Organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile?.mobile || 'Not set'}</p>
                <p className="text-sm text-gray-500">Mobile Number</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile?.email}</p>
                <p className="text-sm text-gray-500">Email Address</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default AccountSettings;
