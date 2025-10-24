
import React from 'react';
import Logo from '@/components/Logo';
import { MessageCircle, Code, Image, Mic, History, Settings, LogOut } from 'lucide-react';
import { Translate } from '@/components/icons/Translate';
import { motion } from 'framer-motion';

const ChatPreview = () => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center">
            <Logo size="sm" />
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">AI Modes</h3>
            <div className="space-y-1">
              {[
                { icon: MessageCircle, label: 'Chat', active: true },
                { icon: Code, label: 'Code' },
                { icon: Image, label: 'Image' },
                { icon: Mic, label: 'Voice' },
                { icon: Translate, label: 'Translate' },
                { icon: History, label: 'History' }
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    item.active
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700/50">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
          <div className="flex-1 p-8 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-lg"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">M</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Mio AI
              </h2>
              <p className="text-gray-400 mb-8">
                I'm your multipurpose AI assistant. How can I help you today?
              </p>
              <div className="bg-gray-800/50 p-6 rounded-lg text-left">
                <h3 className="text-purple-400 font-medium mb-3">Tips:</h3>
                <ul className="space-y-2 text-sm text-gray-400 list-disc pl-5">
                  <li>Ask general questions or advice</li>
                  <li>Request explanations of complex topics</li>
                  <li>Get help with problem-solving</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full bg-gray-800 text-gray-200 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
