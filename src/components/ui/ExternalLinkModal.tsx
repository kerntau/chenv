import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, X, ShieldAlert } from 'lucide-react';

interface ExternalLinkModalProps {
  isOpen: boolean;
  url: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({
  isOpen,
  url,
  onClose,
  onConfirm,
}) => {
  const [countdown, setCountdown] = useState(5);
  const onConfirmRef = useRef(onConfirm);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    let timer: number;
    if (isOpen) {
      setCountdown(5);
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onConfirmRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  const handleCancel = () => onClose();
  const handleConfirm = () => onConfirmRef.current();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 dark:bg-[#060A11]/60 backdrop-blur-[2px] z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] grid w-[90%] max-w-[380px] translate-x-[-50%] translate-y-[-50%] gap-0 border border-slate-200/70 dark:border-slate-800/60 bg-white/95 dark:bg-[#0E1624]/95 p-5 shadow-sm sm:rounded-sm backdrop-blur-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] font-sans">
          
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5 text-slate-400 dark:text-slate-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
            
            <div className="flex flex-col gap-1.5 min-w-0">
              <Dialog.Title className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                即将离开本站
              </Dialog.Title>
              
              <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                你将要访问的外部链接可能存在未知风险。
              </Dialog.Description>

              <div className="mt-2 relative bg-slate-50/50 dark:bg-slate-900/30 rounded-sm border border-slate-100 dark:border-slate-800/80 p-2.5 overflow-hidden">
                <p className="text-[11.5px] font-mono text-slate-600 dark:text-slate-300 break-all line-clamp-3 select-all">
                  {url}
                </p>
                {/* 极简底部进度线 */}
                <div 
                  className="absolute bottom-0 left-0 h-[1.5px] bg-slate-300 dark:bg-slate-600 transition-all ease-linear" 
                  style={{ width: isOpen ? '100%' : '0%', transitionDuration: isOpen ? '5000ms' : '0ms' }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex justify-center items-center rounded-sm px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 focus:outline-none"
              >
                取消
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex justify-center items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-sm focus:outline-none"
            >
              <span>继续 ({countdown}s)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              onClick={handleCancel}
              className="absolute right-3 top-3 rounded-sm opacity-50 hover:opacity-100 transition-opacity focus:outline-none disabled:pointer-events-none text-slate-500"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
