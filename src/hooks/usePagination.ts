import React, { useState } from 'react';

interface usePaginationProps {
  initStep?: number;
  initPos?: number;
  total: number;
}

const usePagination = ({
  initStep = 10,
  initPos = 0,
  total,
}: usePaginationProps) => {
  const [step, setStep] = useState(initStep);
  const [pos, setPos] = useState(initPos);

  const curPage = Math.floor(pos / step) + 1;
  const totPages = Math.floor((total - 1) / step) + 1 || 1;

  const toPrevPage = () => {
    const prevPos = Math.max(0, pos - step);
    setPos(prevPos);
  };

  const toFstPage = () => {
    setPos(0);
  };

  const toNextPage = () => {
    const nextPos = Math.min(step * (totPages - 1), pos + step);
    setPos(nextPos);
  };

  const toLstPage = () => {
    setPos(step * (totPages - 1));
  };

  const toPage = (n: number) => {
    const page = Math.max(1, Math.min(n, totPages));
    setPos(step * (page - 1));
  };

  const useStep = (s: number) => {
    const newStep = Math.max(1, Math.min(s, total));
    const newPos = Math.floor(pos / newStep) * newStep;
    setPos(newPos);
    setStep(newStep);
  };

  return {
    pos: pos,
    setPos: setPos,
    step: step,
    setStep: useStep,
    curPage: curPage,
    totPages: totPages,
    toPrevPage: toPrevPage,
    toFstPage: toFstPage,
    toNextPage: toNextPage,
    toLstPage: toLstPage,
    toPage: toPage,
  };
};

export default usePagination;
