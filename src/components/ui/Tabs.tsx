'use client';

import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  variant?: 'pill' | 'underline' | 'boxed';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps<T>) {
  const isPill = variant === 'pill';
  const isBoxed = variant === 'boxed';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isPill ? '6px' : '4px',
    backgroundColor: isPill || isBoxed ? 'var(--bg-muted)' : 'transparent',
    padding: isPill || isBoxed ? '4px' : '0',
    borderRadius: isPill ? 'var(--radius-full)' : isBoxed ? 'var(--radius-md)' : '0',
    borderBottom: variant === 'underline' ? '1px solid var(--border-subtle)' : 'none',
    width: fullWidth ? '100%' : 'fit-content',
    overflowX: 'auto',
  };

  return (
    <div role="tablist" style={containerStyle} className={className}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        let tabStyle: React.CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: size === 'sm' ? '5px 10px' : '7px 14px',
          fontSize: size === 'sm' ? '0.78rem' : '0.85rem',
          fontWeight: isActive ? 600 : 500,
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          transition: 'all var(--transition-base)',
          userSelect: 'none',
          flex: fullWidth ? 1 : undefined,
          whiteSpace: 'nowrap',
        };

        if (isPill) {
          tabStyle = {
            ...tabStyle,
            borderRadius: 'var(--radius-full)',
            backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
          };
        } else if (isBoxed) {
          tabStyle = {
            ...tabStyle,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
          };
        } else {
          // Underline
          tabStyle = {
            ...tabStyle,
            backgroundColor: 'transparent',
            color: isActive ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
            borderBottom: isActive ? '2px solid var(--border-focus)' : '2px solid transparent',
            marginBottom: '-1px',
          };
        }

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={tabStyle}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && <span style={{ marginLeft: '2px' }}>{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
