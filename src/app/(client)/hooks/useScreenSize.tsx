import { useState, useEffect } from "react";

interface ScreenSizeState {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  is2XLarge: boolean;
}

const breakpoints = {
  isSmall: "(min-width: 640px)", // Tailwind's sm breakpoint is 640px
  isMedium: "(min-width: 768px)", // Tailwind's md breakpoint is 768px
  isLarge: "(min-width: 1024px)", // Tailwind's lg breakpoint is 1024px
  isXLarge: "(min-width: 1280px)", // Tailwind's xl breakpoint is 1280px
  is2XLarge: "(min-width: 1536px)", // Tailwind's 2xl breakpoint is 1536px
};

function useScreenSize(): ScreenSizeState {
  const [screenSize, setScreenSize] = useState<ScreenSizeState>({
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
    is2XLarge: false,
  });

  useEffect(() => {
    const mediaQueries = Object.keys(breakpoints).map((key) => ({
      key,
      mediaQuery: window.matchMedia(
        breakpoints[key as keyof typeof breakpoints],
      ),
    }));

    const handleResize = () => {
      const newScreenSize = mediaQueries.reduce((acc, { key, mediaQuery }) => {
        acc[key as keyof ScreenSizeState] = mediaQuery.matches;
        return acc;
      }, {} as ScreenSizeState);
      setScreenSize(newScreenSize);
    };

    handleResize(); // Initial check

    mediaQueries.forEach(({ mediaQuery }) =>
      mediaQuery.addEventListener("change", handleResize),
    );

    return () => {
      mediaQueries.forEach(({ mediaQuery }) =>
        mediaQuery.removeEventListener("change", handleResize),
      );
    };
  }, []);

  return screenSize;
}

export default useScreenSize;
