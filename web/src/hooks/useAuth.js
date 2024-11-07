// useAuth.js
import { create } from 'zustand';

const useAuth = create(set => ({
  user: null,
  token: null,
  setUser: user => set({ user }),
  setToken: token => set({ token }),
}));

export default useAuth;