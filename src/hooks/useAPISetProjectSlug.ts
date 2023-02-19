import { useAPIStore } from '../stores/apiStore';
import { useStore } from 'zustand';

export const useAPISetProjectSlug = () =>
  useStore(useAPIStore(), (s) => s.setProjectSlug);
