'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'right', className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(target) &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Calculate position for fixed dropdown
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        setPosition({
          top: rect.bottom + scrollY + 8, // 8px gap
          left: align === 'right' ? 0 : rect.left + scrollX,
          right: align === 'right' ? window.innerWidth - rect.right - scrollX : 0,
        });
      }
      
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, align]);

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onClick={handleTriggerClick}
      >
        {trigger}
      </div>

      {isOpen && (
        <>
          {/* Backdrop overlay for mobile */}
          <div
            className="fixed inset-0 z-[9998] lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu with fixed positioning */}
          <div
            ref={menuRef}
            className={`
              fixed z-[9999] w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1
            `}
            style={{
              top: `${position.top}px`,
              ...(align === 'right' 
                ? { right: `${position.right}px` }
                : { left: `${position.left}px` }
              ),
            }}
            role="menu"
            aria-orientation="vertical"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2
                  ${item.variant === 'danger'
                    ? 'text-error-600 hover:bg-error-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                role="menuitem"
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default DropdownMenu;

