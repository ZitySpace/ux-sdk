import { useAPIStore } from '../stores/apiStore';
import { useStore } from 'zustand';

export const useAPISetEndpoint = () =>
  useStore(useAPIStore(), (s) => s.setApiEndpoint);
