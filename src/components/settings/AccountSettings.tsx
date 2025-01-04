import React, { useState } from 'react';
import { User, Mail, Briefcase, Phone } from 'lucide-react';
import { useAuthState } from '../../hooks/useAuthState';

interface UserProfile {
  name: string;
  designation: string;
  company: string;
  mobile: string;
  email: string;
}

const AccountSettings = () => {
  const { user } = useAuthState();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    designation: 'Software Engineer',
    company: 'Tech Corp',
    mobile: '+1234567890',
    email: user?.email || '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      // TODO: Implement profile update logic
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // TODO: Implement password change logic with OTP
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleEmailChange = async () => {
    try {
      // TODO: Implement email change logic
      setIsChangingEmail(false);
    } catch (error) {
      console.error('Failed to change email:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Profile Information</h3>
        </div>
        <div className="p-4 space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
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
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-500">Full Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{profile.designation}</p>
                    <p className="text-sm text-gray-500">Designation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{profile.company}</p>
                    <p className="text-sm text-gray-500">Company/Organization</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{profile.mobile}</p>
                    <p className="text-sm text-gray-500">Mobile Number</p>
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Account Settings</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{profile.email}</p>
                <p className="text-sm text-gray-500">Email Address</p>
              </div>
            </div>
            <button
              onClick={() => setIsChangingEmail(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
