import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Browse from './components/Browse';
import SwapRequests from './components/SwapRequests';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { User, SwapRequest, Notification } from './types';
import { mockUsers, mockSwapRequests } from './data/mockData';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const createUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const createSwapRequest = (newRequest: Omit<SwapRequest, 'id'>) => {
    const request: SwapRequest = {
      ...newRequest,
      id: Date.now().toString()
    };
    setSwapRequests(prev => [...prev, request]);
    
    // Add notification for the recipient
    const notification: Notification = {
      id: Date.now().toString(),
      userId: request.recipientId,
      type: 'swap_request',
      message: `${users.find(u => u.id === request.requesterId)?.name} wants to swap skills with you`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, notification]);
  };

  const updateSwapRequest = (requestId: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, ...updates } : req
    ));
  };

  const deleteSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.filter(req => req.id !== requestId));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} onCreateUser={createUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout}
          notifications={notifications.filter(n => n.userId === currentUser.id && !n.read)}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  currentUser={currentUser}
                  swapRequests={swapRequests.filter(req => 
                    req.requesterId === currentUser.id || req.recipientId === currentUser.id
                  )}
                  users={users}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <Profile 
                  user={currentUser} 
                  onUpdate={updateUser}
                />
              } 
            />
            <Route 
              path="/browse" 
              element={
                <Browse 
                  users={users.filter(u => u.id !== currentUser.id && u.isPublic)}
                  currentUser={currentUser}
                  onCreateSwapRequest={createSwapRequest}
                />
              } 
            />
            <Route 
              path="/swaps" 
              element={
                <SwapRequests 
                  swapRequests={swapRequests.filter(req => 
                    req.requesterId === currentUser.id || req.recipientId === currentUser.id
                  )}
                  currentUser={currentUser}
                  users={users}
                  onUpdateRequest={updateSwapRequest}
                  onDeleteRequest={deleteSwapRequest}
                />
              } 
            />
            {currentUser.role === 'admin' && (
              <Route 
                path="/admin" 
                element={
                  <AdminPanel 
                    users={users}
                    swapRequests={swapRequests}
                    onUpdateUser={updateUser}
                    onUpdateRequest={updateSwapRequest}
                  />
                } 
              />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;