
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Code, Image as ImageIcon, Mic, ArrowRight, CheckCircle, Sparkles, Brain, Zap, Shield, Users, Linkedin } from 'lucide-react';
import { Translate } from '@/components/icons/Translate';
import ChatPreview from '@/components/landing/ChatPreview';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Animated background gradients */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <motion.div className="absolute top-0 -left-40 w-96 h-96 bg-purple-300/30 dark:bg-purple-700/20 rounded-full filter blur-3xl" animate={{
        x: [0, 30, 0],
        y: [0, 20, 0]
      }} transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse"
      }} />
        <motion.div className="absolute -top-40 right-20 w-96 h-96 bg-blue-300/30 dark:bg-blue-700/20 rounded-full filter blur-3xl" animate={{
        x: [0, -30, 0],
        y: [0, 30, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse"
      }} />
        <motion.div className="absolute bottom-40 -right-40 w-96 h-96 bg-cyan-300/30 dark:bg-cyan-700/20 rounded-full filter blur-3xl" animate={{
        x: [0, -40, 0],
        y: [0, -40, 0]
      }} transition={{
        duration: 17,
        repeat: Infinity,
        repeatType: "reverse"
      }} />
      </div>

      {/* Header */}
      <header className="py-6 px-4 md:px-8 lg:px-12 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }}>
            <Logo size="md" />
          </motion.div>
          <motion.div className="flex gap-4 items-center" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
            {/* LinkedIn Profile Link */}
            <a 
              href="https://www.linkedin.com/in/rohith-dachepally" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mr-4 hover:text-blue-600 transition-colors"
            >
              <Linkedin size={24} />
            </a>

            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 hover:opacity-90 text-white">
              <Link to="/login">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <motion.div className="max-w-5xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
            Your Multipurpose AI Assistant
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Chat, code, generate images, use voice commands, and translate — all in one powerful platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 hover:opacity-90 transition-opacity text-white group">
              <Link to="/login">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Chat Interface Preview */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-20"
          >
            <ChatPreview />
          </motion.div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
          <FeatureCard icon={<MessageCircle className="h-10 w-10 mb-4 text-blue-500" />} title="Natural Conversations" description="Chat effortlessly with our advanced AI that understands context and nuance" delay={0.1} />
          <FeatureCard icon={<Code className="h-10 w-10 mb-4 text-purple-500" />} title="Code Generation" description="Generate code snippets and get programming help across multiple languages" delay={0.2} />
          <FeatureCard icon={<ImageIcon className="h-10 w-10 mb-4 text-green-500" />} title="Image Creation" description="Turn your ideas into stunning images with our AI image generator" delay={0.3} />
          <FeatureCard icon={<Mic className="h-10 w-10 mb-4 text-amber-500" />} title="Voice Assistant" description="Speak naturally and receive audio responses for a hands-free experience" delay={0.4} />
          <FeatureCard icon={<Translate className="h-10 w-10 mb-4 text-cyan-500" />} title="Translation" description="Break language barriers with accurate translations across multiple languages" delay={0.5} />
          <FeatureCard icon={<CheckCircle className="h-10 w-10 mb-4 text-emerald-500" />} title="All-in-One Solution" description="Switch seamlessly between different AI capabilities in a single interface" delay={0.6} />
        </div>
        
        {/* Why Choose Us Section */}
        <div className="mt-32 mb-16">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            Why Choose Mio AI?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <WhyChooseCard icon={<Brain className="h-8 w-8 text-purple-500" />} title="Advanced AI Technology" description="Built on Google's Gemini 1.5 Flash for fast, accurate, and helpful responses" delay={0.1} />
            <WhyChooseCard icon={<Zap className="h-8 w-8 text-amber-500" />} title="Lightning Fast" description="Get instant responses to your queries with our optimized architecture" delay={0.2} />
            <WhyChooseCard icon={<Shield className="h-8 w-8 text-blue-500" />} title="Secure & Private" description="Your data and conversations are protected with industry-standard security" delay={0.3} />
            <WhyChooseCard icon={<Users className="h-8 w-8 text-green-500" />} title="Made for Everyone" description="Intuitive interface designed for users of all technical backgrounds" delay={0.4} />
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="mt-32 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => <motion.div key={i} className="absolute bg-white rounded-full opacity-10" style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }} animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0]
          }} transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }} />)}
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to experience Mio AI?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users leveraging AI to enhance productivity and creativity
            </p>
            <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 group">
              <Link to="/login">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-12 px-4 mt-16 relative z-10">
        <div className="container mx-auto text-center">
          <Logo size="sm" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">© 2025 Mio AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component with animation
const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => <motion.div initial={{
  opacity: 0,
  y: 20
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} transition={{
  delay,
  duration: 0.5
}} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="text-center">
      {icon}
      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>;

// Why Choose Us Card
const WhyChooseCard = ({
  icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => <motion.div initial={{
  opacity: 0,
  y: 20
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} transition={{
  delay,
  duration: 0.5
}} className="flex gap-4">
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </motion.div>;

export default LandingPage;
