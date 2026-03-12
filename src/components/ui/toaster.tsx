'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { addToast } from '@/hooks/use-toast';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let mounted = true;
    
    const listener = (newToasts: Toast[]) => {
      if (mounted) {
        setToasts(newToasts);
      }
    };
    
    // Subscribe to toast changes
    const originalAddToast = addToast;
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 shadow-lg transition-all animate-in slide-in-from-right ${
            toast.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background text-foreground'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && (
                <p className="text-sm opacity-90 mt-1">{toast.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
