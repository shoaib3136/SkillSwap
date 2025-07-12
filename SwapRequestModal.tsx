import React, { useState } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  currentUser: User;
  onSubmit: (data: {
    offeredSkill: string;
    requestedSkill: string;
    message: string;
  }) => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    offeredSkill: '',
    requestedSkill: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.offeredSkill && formData.requestedSkill && formData.message) {
      onSubmit(formData);
      setFormData({ offeredSkill: '', requestedSkill: '', message: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Target User Info */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
          {targetUser.profilePhoto ? (
            <img
              src={targetUser.profilePhoto}
              alt={targetUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{targetUser.name}</h3>
            <p className="text-sm text-gray-500">
              {targetUser.completedSwaps} completed swaps
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Offered Skill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You'll Offer
            </label>
            <select
              value={formData.offeredSkill}
              onChange={(e) => setFormData(prev => ({ ...prev, offeredSkill: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a skill you can teach</option>
              {currentUser.skillsOffered.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Requested Skill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Learn
            </label>
            <select
              value={formData.requestedSkill}
              onChange={(e) => setFormData(prev => ({ ...prev, requestedSkill: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a skill you want to learn</option>
              {targetUser.skillsOffered.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal;