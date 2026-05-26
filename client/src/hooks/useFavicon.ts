import { useEffect } from 'react';

export function useFavicon(iconUrl?: string | null) {
  useEffect(() => {
    const originalIcons = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel='icon']"),
    ).map((link) => link.cloneNode(true));

    document
      .querySelectorAll("link[rel='icon']")
      .forEach((link) => link.remove());

    if (iconUrl) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = iconUrl;
      document.head.appendChild(link);
    }

    return () => {
      document
        .querySelectorAll("link[rel='icon']")
        .forEach((link) => link.remove());

      originalIcons.forEach((icon) => {
        document.head.appendChild(icon);
      });
    };
  }, [iconUrl]);
}
