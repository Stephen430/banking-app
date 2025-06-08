'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Fingerprint, Users, MessageCircle, Sparkles, Plus, X } from 'lucide-react';
import { FinancialChatbot } from '@/components/ai-chatbot/financial-chatbot';
import { BiometricAuth } from '@/components/biometric/biometric-auth';
import { BillSplitter } from '@/components/bill-splitter/bill-splitter';

interface FloatingFeature {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  component: React.ReactNode;
  description: string;
}

const FLOATING_FEATURES: FloatingFeature[] = [
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: <Bot className="h-5 w-5" />,
    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    description: 'Get personalized financial advice and insights',
    component: <FinancialChatbot userAccounts={[]} recentTransactions={[]} userName="User" />
  },
  {
    id: 'biometric',
    name: 'Biometric Auth',
    icon: <Fingerprint className="h-5 w-5" />,
    color: 'bg-gradient-to-r from-red-500 to-pink-600',
    description: 'Secure authentication with fingerprint or face ID',
    component: <BiometricAuth onAuthSuccess={() => {}} onAuthFailure={() => {}} />
  },  {
    id: 'bill-splitter',
    name: 'Bill Splitter',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    description: 'Split expenses with friends and family',
    component: <BillSplitter currentUser={{ id: 'demo', name: 'Demo User', email: 'demo@example.com' }} />
  }
];

export default function FloatingFeatures() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FloatingFeature | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openFeature = (feature: FloatingFeature) => {
    setActiveFeature(feature);
    setIsMenuOpen(false);
  };

  const closeFeature = () => {
    setActiveFeature(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Feature Buttons - appear when menu is open */}
          <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            {FLOATING_FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center space-x-3 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Feature Label */}
                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">{feature.name}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>

                {/* Feature Button */}
                <Button
                  onClick={() => openFeature(feature)}
                  className={`${feature.color} hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl rounded-full h-12 w-12 p-0`}
                >
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* Main FAB */}
          <Button
            onClick={toggleMenu}
            className={`${
              isMenuOpen 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            } rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <div className={`text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </div>
          </Button>
        </div>
      </div>

      {/* Feature Dialog */}
      <Dialog open={!!activeFeature} onOpenChange={closeFeature}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className={`${activeFeature?.color} rounded-full p-2`}>
                <div className="text-white">
                  {activeFeature?.icon}
                </div>
              </div>
              <div>
                <DialogTitle>{activeFeature?.name}</DialogTitle>
                <DialogDescription>
                  {activeFeature?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            {activeFeature?.component}
          </div>
        </DialogContent>
      </Dialog>

      {/* Backdrop for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
