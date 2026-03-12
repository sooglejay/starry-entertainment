'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastCount = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();
let toasts: Toast[] = [];

function addToast(toast: Omit<Toast, 'id'>) {
  const id = `toast-${++toastCount}`;
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  }, 3000);
  
  return id;
}

export function useToast() {
  const [_, setToasts] = useState<Toast[]>(toasts);
  
  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  
  useState(() => {
    subscribe(setToasts);
  });
  
  const toast = useCallback((options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
    addToast(options);
  }, []);
  
  return { toast };
}

export { addToast };
