import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, User as UserIcon, MessageSquare } from 'lucide-react';
import { User, SwapRequest } from '../types';
import SwapRequestModal from './SwapRequestModal';

interface BrowseProps {
  users: User[];
  currentUser: User;
  onCreateSwapRequest: (request: Omit<SwapRequest, 'id'>) => void;
}

const Browse: React.FC<BrowseProps> = ({ users, currentUser, onCreateSwapRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all unique skills from all users
  const allSkills = Array.from(new Set(
    users.flatMap(user => [...user.skillsOffered, ...user.skillsWanted])
  )).sort();

  // Filter users based on search criteria
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkill = selectedSkill === '' ||
      user.skillsOffered.includes(selectedSkill) ||
      user.skillsWanted.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  const handleContactUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreateSwapRequest = (data: {
    offeredSkill: string;
    requestedSkill: string;
    message: string;
  }) => {
    if (selectedUser) {
      onCreateSwapRequest({
        requesterId: currentUser.id,
        recipientId: selectedUser.id,
        offeredSkill: data.offeredSkill,
        requestedSkill: data.requestedSkill,
        message: data.message,
        status: 'pending',
        createdAt: new Date()
      });
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Skills</h1>
        <p className="text-gray-600 mt-1">Discover talented people and find the skills you need</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skill, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            {/* User Header */}
            <div className="flex items-center space-x-3 mb-4">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                {user.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">{user.rating}</span>
                <span className="text-sm text-gray-500">({user.completedSwaps} swaps)</span>
              </div>
              {user.availability.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Available
                </div>
              )}
            </div>

            {/* Skills Offered */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Offers</h4>
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{user.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Wants</h4>
              <div className="flex flex-wrap gap-1">
                {user.skillsWanted.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsWanted.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{user.skillsWanted.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Contact Button */}
            <button
              onClick={() => handleContactUser(user)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          targetUser={selectedUser}
          currentUser={currentUser}
          onSubmit={handleCreateSwapRequest}
        />
      )}
    </div>
  );
};

export default Browse;