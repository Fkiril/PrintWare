import { create } from 'zustand';

export const useAuth = create((set) => ({
  user: null,
  token: "",
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token })
}));
