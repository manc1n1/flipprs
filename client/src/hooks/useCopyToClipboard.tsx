import { useState } from 'react';
import { toast } from 'react-toastify';
import { CopyCheck } from 'lucide-react';

type TCopyStatus = 'idle' | 'copying' | 'success' | 'error';
const COPY_TOAST_ID = 'copy-toast';

export function useCopyToClipboard() {
  const [status, setStatus] = useState<TCopyStatus>('idle');

  const showCopiedToast = () => {
    if (toast.isActive(COPY_TOAST_ID)) {
      toast.update(COPY_TOAST_ID, {
        render: 'Copied link',
        type: 'success',
        icon: <CopyCheck />,
      });
    } else {
      toast.success('Copied link', {
        toastId: COPY_TOAST_ID,
        icon: <CopyCheck />,
      });
    }
  };

  const copy = async (text: string) => {
    setStatus('copying');

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        setStatus('success');
        showCopiedToast();
      } catch {
        fallbackCopy(text);
      }
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
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
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setStatus('success');
        showCopiedToast();
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      toast.error('Failed to copy');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return { copy, status };
}
