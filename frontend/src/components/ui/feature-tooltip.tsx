import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface FeatureTooltipProps {
  id: string;
  message: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  delay?: number;
}

/**
 * One-time tooltip that appears on first visit and is dismissed on click.
 * Uses localStorage to track which tooltips have been seen.
 * Use `delay` to stagger multiple tooltips so they don't overlap.
 */
export function FeatureTooltip({ id, message, children, position = 'top', delay = 800 }: FeatureTooltipProps) {
  const storageKey = `tooltip-seen-${id}`;
  const [autoVisible, setAutoVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Auto-show once on first visit
  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      const showTimer = setTimeout(() => setAutoVisible(true), delay);
      const hideTimer = setTimeout(() => {
        setAutoVisible(false);
        localStorage.setItem(storageKey, '1');
      }, delay + 10000);
      return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }
  }, [storageKey, delay]);

  function dismiss() {
    setAutoVisible(false);
    localStorage.setItem(storageKey, '1');
  }

  const visible = autoVisible || hovered;

  return (
    <div
      className="relative inline-flex"
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg pointer-events-none ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="flex-1 leading-relaxed">{message}</span>
            {autoVisible && (
              <button
                onClick={dismiss}
                className="mt-0.5 shrink-0 rounded p-0.5 hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900 ${
              position === 'top' ? '-bottom-1' : '-top-1'
            }`}
          />
        </div>
      )}
    </div>
  );
}
