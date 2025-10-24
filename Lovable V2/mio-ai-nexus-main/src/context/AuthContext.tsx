
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateStudent, updateStudent, Student, changePassword, studentExistsByEmail } from '@/services/databaseService';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UserRegistrationData {
  name: string;
  age: string;
  profession?: string;
  imageUrl?: string;
}

type AuthContextType = {
  user: Student | null;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData?: UserRegistrationData) => Promise<boolean>;
  loginWithGoogle: () => void;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<Student>) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // First set up auth state listener to prevent missing auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (session?.user) {
                const email = session.user.email;
                if (email) {
                  // Use setTimeout to avoid potential deadlocks with Supabase auth
                  setTimeout(async () => {
                    let student = authenticateStudent(email, 'password123');
                    
                    if (!student) {
                      // Create new account with user data from session
                      const newStudent: Student = {
                        rollNo: email.split('@')[0].toUpperCase(),
                        name: session.user.user_metadata.full_name || email.split('@')[0],
                        email: email,
                        password: 'password123'
                      };
                      
                      updateStudent(newStudent);
                      student = newStudent;
                      
                      toast.warning('New account created. Please update your profile.', {
                        duration: 8000
                      });
                    }
                    
                    setUser(student);
                    localStorage.setItem('mio_user', JSON.stringify(student));
                  }, 0);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              localStorage.removeItem('mio_user');
              setUser(null);
            }
          }
        );

        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          const email = session.user.email;
          if (email) {
            let student = authenticateStudent(email, 'password123');
            
            if (!student) {
              // Create new account with user data from session
              const newStudent: Student = {
                rollNo: email.split('@')[0].toUpperCase(),
                name: session.user.user_metadata.full_name || email.split('@')[0],
                email: email,
                password: 'password123'
              };
              
              updateStudent(newStudent);
              student = newStudent;
              
              toast.warning('New account created. Please update your profile.', {
                duration: 8000
              });
            }
            
            setUser(student);
            localStorage.setItem('mio_user', JSON.stringify(student));
          }
        } else {
          // Check for locally stored user if no session exists
          const storedUser = localStorage.getItem('mio_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Verify if this user still exists in our database
            if (studentExistsByEmail(parsedUser.email)) {
              setUser(parsedUser);
              
              // Try to authenticate with Supabase to restore session
              // Skip password here as we don't store it securely
              // This is just for demo purposes
              try {
                await supabase.auth.signInWithPassword({
                  email: parsedUser.email,
                  password: parsedUser.password || 'password123'
                });
              } catch (e) {
                console.log('Failed to auto-restore session');
              }
            } else {
              localStorage.removeItem('mio_user');
            }
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth session:", error);
        const storedUser = localStorage.getItem('mio_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return false;
      }
      
      const emailExists = studentExistsByEmail(email);
      if (!emailExists) {
        toast.error('No account found with this email. Please sign up.');
        setIsLoading(false);
        return false;
      }
      
      // First attempt to authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        
        // Fall back to local authentication
        const student = authenticateStudent(email, password);
        
        if (student) {
          // If local auth succeeds but Supabase failed, try to create/sync the account
          try {
            await supabase.auth.signUp({
              email,
              password
            });
            toast.success('Account synced with cloud database');
          } catch (e) {
            console.log('Failed to sync account with Supabase');
          }
          
          setUser(student);
          localStorage.setItem('mio_user', JSON.stringify(student));
          
          setIsLoading(false);
          return true;
        }
        
        toast.error('Invalid email or password');
        setIsLoading(false);
        return false;
      }
      
      if (data.user) {
        // Supabase auth succeeded
        let student = authenticateStudent(email, password);
        
        if (!student) {
          // If Supabase auth succeeds but local doesn't, create local entry
          const newStudent: Student = {
            rollNo: email.split('@')[0].toUpperCase(),
            name: data.user.user_metadata.full_name || email.split('@')[0],
            email: email,
            password: password
          };
          
          updateStudent(newStudent);
          student = newStudent;
          
          toast.success('Account synced with local database');
        }
        
        setUser(student);
        localStorage.setItem('mio_user', JSON.stringify(student));
        setIsLoading(false);
        return true;
      }
      
      toast.error('Authentication failed');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, userData?: UserRegistrationData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return false;
      }
      
      const emailExists = studentExistsByEmail(email);
      if (emailExists) {
        toast.error('An account with this email already exists');
        setIsLoading(false);
        return false;
      }
      
      // Create account with Supabase first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.name,
            age: userData?.age,
            profession: userData?.profession
          }
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        toast.error(`Failed to create account: ${error.message}`);
        setIsLoading(false);
        return false;
      }
      
      // Create new student with provided details
      const newStudent: Student = {
        rollNo: email.split('@')[0].toUpperCase(),
        name: userData?.name || email.split('@')[0],
        email: email,
        password: password,
        age: userData?.age,
        profession: userData?.profession,
        imageUrl: userData?.imageUrl
      };
      
      updateStudent(newStudent);
      
      toast.success('Account created successfully! You can now log in.');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/callback'
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        toast.error('Failed to login with Google');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
      
      window.location.href = 'https://dev-z2jf7uzzciuxplvw.us.auth0.com/authorize?client_id=HkQ31hDP1HYCdHMtBHHEGtZ8CGMX8HJv&redirect_uri=' + 
        encodeURIComponent(window.location.origin + '/callback') + 
        '&response_type=token&scope=openid profile email';
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Supabase password update error:', error);
        toast.error(`Failed to update password: ${error.message}`);
        return false;
      }
      
      const success = changePassword(user.email, newPassword);
      if (success) {
        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        localStorage.setItem('mio_user', JSON.stringify(updatedUser));
        toast.success('Password updated successfully');
        return true;
      }
      
      toast.error('Failed to update password');
      return false;
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password');
      return false;
    }
  };
  
  const updateProfile = async (profileData: Partial<Student>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          dob: profileData.dob,
          organization: profileData.organization
        }
      });
      
      if (error) {
        console.error('Supabase profile update error:', error);
        toast.error(`Failed to update profile: ${error.message}`);
      }
      
      const updatedUser = { ...user, ...profileData };
      updateStudent(updatedUser);
      setUser(updatedUser);
      localStorage.setItem('mio_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('mio_user');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log('Logout error:', error);
      localStorage.removeItem('mio_user');
      setUser(null);
      navigate('/');
    }
  };

  const value = {
    user,
    login,
    signUp,
    loginWithGoogle,
    logout,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
