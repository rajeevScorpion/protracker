import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerContent?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  headerContent
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div 
        className="p-4 border-b flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
          <h2 className="font-medium">{title}</h2>
        </div>
        {headerContent}
      </div>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
