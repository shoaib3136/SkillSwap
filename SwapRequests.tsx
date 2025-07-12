import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Star, MessageSquare, Trash2, User as UserIcon } from 'lucide-react';
import { SwapRequest, User } from '../types';

interface SwapRequestsProps {
  swapRequests: SwapRequest[];
  currentUser: User;
  users: User[];
  onUpdateRequest: (requestId: string, updates: Partial<SwapRequest>) => void;
  onDeleteRequest: (requestId: string) => void;
}

const SwapRequests: React.FC<SwapRequestsProps> = ({
  swapRequests,
  currentUser,
  users,
  onUpdateRequest,
  onDeleteRequest
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showFeedbackModal, setShowFeedbackModal] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const receivedRequests = swapRequests.filter(req => req.recipientId === currentUser.id);
  const sentRequests = swapRequests.filter(req => req.requesterId === currentUser.id);

  const getOtherUser = (request: SwapRequest) => {
    const otherUserId = request.requesterId === currentUser.id ? request.recipientId : request.requesterId;
    return users.find(u => u.id === otherUserId);
  };

  const handleAcceptRequest = (requestId: string) => {
    onUpdateRequest(requestId, {
      status: 'accepted',
      updatedAt: new Date()
    });
  };

  const handleRejectRequest = (requestId: string) => {
    onUpdateRequest(requestId, {
      status: 'rejected',
      updatedAt: new Date()
    });
  };

  const handleCompleteRequest = (requestId: string) => {
    setShowFeedbackModal(requestId);
  };

  const handleSubmitFeedback = () => {
    if (showFeedbackModal) {
      onUpdateRequest(showFeedbackModal, {
        status: 'completed',
        updatedAt: new Date(),
        rating,
        feedback
      });
      setShowFeedbackModal(null);
      setFeedback('');
      setRating(5);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRequest = (request: SwapRequest, isReceived: boolean) => {
    const otherUser = getOtherUser(request);
    if (!otherUser) return null;

    return (
      <div key={request.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4">
          {otherUser.profilePhoto ? (
            <img
              src={otherUser.profilePhoto}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">
              {otherUser.rating.toFixed(1)} ⭐ • {otherUser.completedSwaps} swaps
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>

        {/* Skill Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">
              {isReceived ? 'They offer' : 'You offer'}
            </p>
            <p className="text-sm font-semibold text-green-800">{request.offeredSkill}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">
              {isReceived ? 'They want' : 'You want'}
            </p>
            <p className="text-sm font-semibold text-blue-800">{request.requestedSkill}</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Message</span>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{request.message}</p>
        </div>

        {/* Feedback (for completed swaps) */}
        {request.status === 'completed' && request.feedback && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Feedback</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= (request.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{request.feedback}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {isReceived && request.status === 'pending' && (
            <>
              <button
                onClick={() => handleAcceptRequest(request.id)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {request.status === 'accepted' && (
            <button
              onClick={() => handleCompleteRequest(request.id)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </button>
          )}

          {!isReceived && request.status === 'pending' && (
            <button
              onClick={() => onDeleteRequest(request.id)}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Request
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {request.status === 'pending' ? 'Requested' : 'Updated'} {new Date(request.updatedAt || request.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skill Swap Requests</h1>
        <p className="text-gray-600 mt-1">Manage your incoming and outgoing swap requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </nav>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map(request => renderRequest(request, true))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
              <p className="text-gray-500">When others request to swap skills with you, they'll appear here</p>
            </div>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map(request => renderRequest(request, false))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
              <p className="text-gray-500">Start by browsing skills and reaching out to other users</p>
            </div>
          )
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Skill Swap</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience (1-5 stars)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave feedback (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How was your skill swap experience?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(null)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapRequests;