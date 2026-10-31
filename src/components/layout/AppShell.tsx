'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header, HeaderProps } from '@/components/common/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { WeaknessTrackerModal } from '@/components/mastery/WeaknessTrackerModal';
import { AITutorModal } from '@/components/ai';
import { HelpModal } from '@/components/common/HelpModal';
import { ToastProvider } from '@/components/ui';
import { CommandCenter } from '@/components/navigation';

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
  const [trackerTab, setTrackerTab] = useState<'skills' | 'queue' | 'policy' | 'history'>('skills');
  const [isGlobalAITutorOpen, setIsGlobalAITutorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens Command Center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global interaction custom event bridge
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    const handleOpenSettings = () => setIsSettingsOpen(true);
    const handleOpenCmd = () => setIsCommandCenterOpen(true);

    window.addEventListener('codecobug:open-auth', handleOpenAuth);
    window.addEventListener('codecobug:open-settings', handleOpenSettings);
    window.addEventListener('codecobug:open-command-center', handleOpenCmd);

    return () => {
      window.removeEventListener('codecobug:open-auth', handleOpenAuth);
      window.removeEventListener('codecobug:open-settings', handleOpenSettings);
      window.removeEventListener('codecobug:open-command-center', handleOpenCmd);
    };
  }, []);

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

  const handleOpenWeaknessTracker = (initialTab?: 'skills' | 'queue' | 'policy' | 'history') => {
    if (initialTab) {
      setTrackerTab(initialTab);
    }
    setIsTrackerOpen(true);
  };

  const handleToggleAITutor =
    headerProps?.onToggleAITutor || (() => setIsGlobalAITutorOpen((prev) => !prev));

  return (
    <ToastProvider>
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
            onOpenHelp={() => setIsHelpOpen(true)}
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
            onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
            showBrand={hideSidebar}
          />

          {/* Content Body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {React.isValidElement(children)
              ? React.cloneElement(children as React.ReactElement<any>, {
                  onOpenCommandCenter: () => setIsCommandCenterOpen(true),
                  onOpenAuth: () => setIsAuthOpen(true),
                  onOpenAISettings: () => setIsSettingsOpen(true),
                  onOpenWeaknessTracker: handleOpenWeaknessTracker,
                  onToggleAITutor: handleToggleAITutor,
                })
              : children}
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
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* 4. Global Command Center (One-Tap Navigation) */}
        <CommandCenter
          isOpen={isCommandCenterOpen}
          onClose={() => setIsCommandCenterOpen(false)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAISettings={() => setIsSettingsOpen(true)}
          onOpenWeaknessTracker={handleOpenWeaknessTracker}
          onToggleAITutor={handleToggleAITutor}
        />

        {/* 5. Global Modals */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onOpenAISettings={() => setIsSettingsOpen(true)}
        />

        <AISettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <WeaknessTrackerModal
          isOpen={isTrackerOpen}
          initialTab={trackerTab}
          onClose={() => setIsTrackerOpen(false)}
        />

        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          onOpenAISettings={() => setIsSettingsOpen(true)}
        />

        {/* 5. Global AI Tutor Modal (for non-exercise pages) */}
        <AITutorModal
          isOpen={isGlobalAITutorOpen}
          onClose={() => setIsGlobalAITutorOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>
    </ToastProvider>
  );
};

