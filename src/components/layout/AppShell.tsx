'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header, HeaderProps } from '@/components/common/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { WeaknessTrackerModal } from '@/components/mastery/WeaknessTrackerModal';
import { AITutorModal } from '@/components/ai';

export interface AppShellProps {
  children: React.ReactNode;
  headerProps?: Omit<
    HeaderProps,
    'onToggleMobileNav' | 'onOpenAuth' | 'onOpenAISettings' | 'onOpenWeaknessTracker'
  >;
  hideSidebar?: boolean;
  defaultCollapsed?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerProps,
  hideSidebar = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isGlobalAITutorOpen, setIsGlobalAITutorOpen] = useState(false);

  // Load sidebar collapse preference from localStorage on desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codecobug_sidebar_collapsed');
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('codecobug_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const handleOpenWeaknessTracker = (_initialTab?: 'skills' | 'queue' | 'policy') => {
    setIsTrackerOpen(true);
  };

  const handleToggleAITutor =
    headerProps?.onToggleAITutor || (() => setIsGlobalAITutorOpen((prev) => !prev));

  return (
    <div className="app-shell">
      {/* 1. Desktop Left Sidebar */}
      {!hideSidebar && (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAISettings={() => setIsSettingsOpen(true)}
          onOpenWeaknessTracker={handleOpenWeaknessTracker}
          onToggleAITutor={handleToggleAITutor}
        />
      )}

      {/* 2. Main Application Area */}
      <div className="app-main-content">
        {/* Header Bar */}
        <Header
          {...headerProps}
          onToggleAITutor={handleToggleAITutor}
          isAITutorOpen={headerProps?.isAITutorOpen ?? isGlobalAITutorOpen}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAISettings={() => setIsSettingsOpen(true)}
          onOpenWeaknessTracker={handleOpenWeaknessTracker}
          showBrand={hideSidebar}
        />

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAISettings={() => setIsSettingsOpen(true)}
        onOpenWeaknessTracker={handleOpenWeaknessTracker}
        onToggleAITutor={handleToggleAITutor}
      />

      {/* 4. Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <WeaknessTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* 5. Global AI Tutor Modal (for non-exercise pages) */}
      <AITutorModal
        isOpen={isGlobalAITutorOpen}
        onClose={() => setIsGlobalAITutorOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </div>
  );
};

