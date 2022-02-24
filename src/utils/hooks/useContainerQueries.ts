import { useResizeDetector } from 'react-resize-detector';

const sizeMap: { [key: string]: number } = {
  default: 0,
  '2xs': 365,
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const decomposeTwClass = (s: string) => {
  // special cases
  if (['hidden', 'flex', 'inline-flex'].includes(s))
    return { twkey: 'display', twval: s };

  return {
    twkey: s.slice(0, s.indexOf('-')),
    twval: s.slice(s.indexOf('-') + 1),
  };
};

const composeTwClass = (k: string, v: string) => {
  if (['hidden', 'flex', 'inline-flex'].includes(v)) return v;

  return v === '' ? k : [k, v].join('-');
};

const parseAtomicCSS = (s: string) => {
  const i = s.indexOf(':');

  return s[i] == ':'
    ? {
        breakpoint: s.slice(0, i),
        ...decomposeTwClass(s.slice(i + 1)),
      }
    : {
        breakpoint: 'default',
        ...decomposeTwClass(s),
      };
};

export const useContainerQueries = () => {
  const { width, height, ref } = useResizeDetector({
    handleHeight: false,
    // refreshMode: 'debounce',
    // refreshRate: 100,
  });

  const observeCSS = (cssStr: string) =>
    Object.entries(
      cssStr
        .split(' ')
        .reduce(
          (
            cssUsed: { [key: string]: { breakpoint: string; twval: string } },
            s: string
          ) => {
            const { breakpoint, twkey, twval } = parseAtomicCSS(s);

            const w = width || 0;

            if (w < sizeMap[breakpoint]) return cssUsed;

            if (
              !(twkey in cssUsed) ||
              sizeMap[cssUsed[twkey].breakpoint] < sizeMap[breakpoint]
            )
              return {
                ...cssUsed,
                [twkey]: { breakpoint: breakpoint, twval: twval },
              };

            return cssUsed;
          },
          {}
        )
    )
      .map(([twkey, { twval }]) => composeTwClass(twkey, twval))
      .join(' ');

  return { width, height, ref, observeCSS };
};
