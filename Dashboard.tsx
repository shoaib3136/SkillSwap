import React from 'react';
import { Star, Calendar, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User, SwapRequest } from '../types';

interface DashboardProps {
  currentUser: User;
  swapRequests: SwapRequest[];
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, swapRequests, users }) => {
  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const acceptedRequests = swapRequests.filter(req => req.status === 'accepted');
  const completedRequests = swapRequests.filter(req => req.status === 'completed');

  const stats = [
    {
      label: 'Rating',
      value: currentUser.rating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Completed Swaps',
      value: currentUser.completedSwaps,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Pending Requests',
      value: pendingRequests.length,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Active Users',
      value: users.filter(u => u.isPublic && !u.isBanned).length,
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const recentActivity = [
    ...swapRequests
      .filter(req => req.requesterId === currentUser.id || req.recipientId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-blue-100 mb-4">
          Ready to continue your skill-sharing journey? Check out what's happening in your network.
        </p>
        <Link 
          to="/browse"
          className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Discover New Skills
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills You Offer</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skillsOffered.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills You Want</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skillsWanted.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link 
            to="/profile"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit Profile
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((request) => {
                const isRequester = request.requesterId === currentUser.id;
                const otherUser = users.find(u => u.id === (isRequester ? request.recipientId : request.requesterId));
                
                return (
                  <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      request.status === 'completed' ? 'bg-green-500' :
                      request.status === 'accepted' ? 'bg-blue-500' :
                      request.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {isRequester ? `You requested ${request.requestedSkill}` : `${otherUser?.name} wants ${request.requestedSkill}`}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{request.status}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
          <Link 
            to="/swaps"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Swaps
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;