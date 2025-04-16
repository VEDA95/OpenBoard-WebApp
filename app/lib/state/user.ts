import { create } from 'zustand';
import type { User } from '@/lib/types/user';

export type SetUserCall = (user: User) => void;
export type ClearUserCall = () => void;

export interface GlobalUserState {
    user: User | null;
    set: SetUserCall;
    clear: ClearUserCall;
}

const useUserState = create<GlobalUserState>((set) => ({
    user: null,
    set: (user: User): void => set((state: GlobalUserState): GlobalUserState => {
        state.user = user;

        return state;
    }),
    clear: (): void => set((state: GlobalUserState) => {
        state.user = null;

        return state;
    }),
}));

export default useUserState;