
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateStudent } from '@/services/databaseService';
import { toast } from 'sonner';
import Loader from '@/components/Loader';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth0Response = async () => {
      // Extract the token from URL fragment
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      
      if (!accessToken) {
        setError('Authentication failed - no access token received');
        return;
      }
      
      try {
        // Get user info from Auth0
        const userInfoResponse = await fetch('https://dev-z2jf7uzzciuxplvw.us.auth0.com/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user information');
        }
        
        const userInfo = await userInfoResponse.json();
        
        // Create or update user in our system
        const user = {
          rollNo: userInfo.sub,
          name: userInfo.name || userInfo.nickname || 'Google User',
          email: userInfo.email,
          password: '123456' // Default password for OAuth users
        };
        
        updateStudent(user);
        localStorage.setItem('mio_user', JSON.stringify(user));
        
        toast.success('Successfully logged in with Google!');
        navigate('/chat');
      } catch (error) {
        console.error('Auth0 callback error:', error);
        setError('Authentication failed - could not process login');
      }
    };
    
    processAuth0Response();
  }, [navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button 
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Loader size="lg" text="Completing your authentication..." fullScreen={false} />
    </div>
  );
};

export default AuthCallback;
