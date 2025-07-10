import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
}

interface UserActions {
  setUser: (user: User) => void
  clearUser: () => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
) 