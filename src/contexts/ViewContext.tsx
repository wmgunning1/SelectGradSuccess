import { createContext, useEffect, useLayoutEffect, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import theme from '@/theme';

type MediaSize = {
  width: number;
  height: number;
};

const [isMobileInit, isTabletInit, isDesktopInit] = [false, false, false];
const mediaSizeInit = {
  width: 0,
  height: 0,
};

type ViewContext = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  mediaSize: MediaSize;
};

export const viewContext = createContext<ViewContext>({
  isMobile: isMobileInit,
  isTablet: isTabletInit,
  isDesktop: isDesktopInit,
  mediaSize: mediaSizeInit,
});

const { Provider } = viewContext;

const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [isTablet, setIsTablet] = useState(isMobileInit);
  const [isDesktop, setIsDesktop] = useState(isMobileInit);
  const [mediaSize, setMediaSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const matchMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });
  const matchTablet = useMediaQuery(theme.breakpoints.down('lg'), {
    defaultMatches: true,
  });

  useLayoutEffect(() => {
    const updateSize = () => {
      setMediaSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    setIsMobile(matchMobile);
    setIsTablet(matchTablet);
    setIsDesktop(!matchMobile && !matchTablet);
  });

  return <Provider value={{ isMobile, isTablet, isDesktop, mediaSize }}>{children}</Provider>;
};

export default ViewProvider;
