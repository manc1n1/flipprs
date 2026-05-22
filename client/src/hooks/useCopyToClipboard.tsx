import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { CopyCheck, CopyX } from 'lucide-react';

type TCopyStatus = 'idle' | 'copying' | 'success' | 'error';

const COPY_TOAST_ID = 'copy-toast';
const FAILED_COPY_TOAST_ID = 'copy-error-toast';

export function useCopyToClipboard() {
  const [status, setStatus] = useState<TCopyStatus>('idle');

  const showCopiedToast = useCallback(() => {
    toast.success('Copied link', {
      id: COPY_TOAST_ID,
      icon: <CopyCheck />,
      duration: 1500,
    });
  }, []);

  const showCopyErrorToast = useCallback(() => {
    toast.error('Failed to copy', {
      id: FAILED_COPY_TOAST_ID,
      icon: <CopyX />,
      duration: 1500,
    });
  }, []);

  const fallbackCopy = useCallback(
    (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '1px';
      textarea.style.height = '1px';
      textarea.style.border = 'none';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');

        if (!successful) {
          throw new Error('Copy failed');
        }

        setStatus('success');
        showCopiedToast();
      } catch {
        setStatus('error');
        showCopyErrorToast();
      } finally {
        document.body.removeChild(textarea);
      }
    },
    [showCopiedToast, showCopyErrorToast],
  );

  const copy = useCallback(
    async (text: string) => {
      setStatus('copying');

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          setStatus('success');
          showCopiedToast();
          return;
        } catch {
          fallbackCopy(text);
          return;
        }
      }

      fallbackCopy(text);
    },
    [fallbackCopy, showCopiedToast],
  );

  return { copy, status };
}
