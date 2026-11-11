import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Kaki Industries, Nagpur` : 'Kaki Industries | Solar Inverters, Panels & Batteries in Nagpur';
  }, [title]);
}
