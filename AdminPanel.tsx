import React, { useState } from 'react';
import { Shield, Users, MessageSquare, Ban, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';
import { User, SwapRequest, AdminMessage } from '../types';

interface AdminPanelProps {
  users: User[];
  swapRequests: SwapRequest[];
  onUpdateUser: (user: User) => void;
  onUpdateRequest: (requestId: string, updates: Partial<SwapRequest>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  swapRequests,
  onUpdateUser,
  onUpdateRequest
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'swaps' | 'messages'>('users');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'update'
  });

  const activeUsers = users.filter(u => !u.isBanned && u.role !== 'admin');
  const bannedUsers = users.filter(u => u.isBanned);
  const pendingSwaps = swapRequests.filter(req => req.status === 'pending');
  const activeSwaps = swapRequests.filter(req => req.status === 'accepted');
  const completedSwaps = swapRequests.filter(req => req.status === 'completed');

  const handleBanUser = (user: User) => {
    onUpdateUser({ ...user, isBanned: true });
  };

  const handleUnbanUser = (user: User) => {
    onUpdateUser({ ...user, isBanned: false });
  };

  const handleCancelSwap = (requestId: string) => {
    onUpdateRequest(requestId, {
      status: 'cancelled',
      updatedAt: new Date()
    });
  };

  const handleSendMessage = () => {
    // In a real app, this would send a platform-wide message
    console.log('Sending platform message:', messageForm);
    setShowMessageModal(false);
    setMessageForm({ title: '', content: '', type: 'info' });
  };

  const stats = [
    {
      label: 'Active Users',
      value: activeUsers.length,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Banned Users',
      value: bannedUsers.length,
      icon: Ban,
      color: 'text-red-600 bg-red-100'
    },
    {
      label: 'Pending Swaps',
      value: pendingSwaps.length,
      icon: MessageSquare,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Active Swaps',
      value: activeSwaps.length,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-1">Manage users, monitor swaps, and send platform messages</p>
        </div>
        <button
          onClick={() => setShowMessageModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'users', label: 'User Management' },
            { key: 'swaps', label: 'Swap Monitoring' },
            { key: 'messages', label: 'Platform Messages' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Active Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="h-8 w-8 rounded-full object-cover mr-3" />
                          ) : (
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.skillsOffered.length} offered, {user.skillsWanted.length} wanted
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.rating.toFixed(1)} ⭐
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBanUser(user)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Ban User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Banned Users */}
          {bannedUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Ban className="h-5 w-5 text-red-600 mr-2" />
                  Banned Users
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {bannedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Ban className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnbanUser(user)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Unban
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="space-y-6">
          {/* Swap Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Swaps</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingSwaps.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Swaps</h3>
              <p className="text-3xl font-bold text-blue-600">{activeSwaps.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Swaps</h3>
              <p className="text-3xl font-bold text-green-600">{completedSwaps.length}</p>
            </div>
          </div>

          {/* Recent Swaps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Swap Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {swapRequests.slice(0, 10).map(request => {
                const requester = users.find(u => u.id === request.requesterId);
                const recipient = users.find(u => u.id === request.recipientId);
                
                return (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {requester?.name} → {recipient?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.offeredSkill} for {request.requestedSkill}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                        {(request.status === 'pending' || request.status === 'accepted') && (
                          <button
                            onClick={() => handleCancelSwap(request.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Messages</h2>
            <p className="text-gray-600 mb-6">
              Send important announcements and updates to all platform users.
            </p>
            <button
              onClick={() => setShowMessageModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Compose New Message
            </button>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send Platform Message</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                <select
                  value={messageForm.type}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="update">Platform Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message content"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageForm.title || !messageForm.content}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;