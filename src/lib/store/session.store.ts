import type { User } from '$lib/types/user.type';
import { writable } from 'svelte/store';

type UserStore = {
	subscribe: (this: void, run: (value: User) => void, invalidate?: () => void) => () => void;
	setUser: (user: User) => void;
	updateUser: (partialUser: Partial<User>) => void;
};

function createSessionStore(): UserStore {
	const { subscribe, set, update } = writable<User>();

	return {
		subscribe,
		setUser: (user: User) => set(user),
		updateUser: (partialUser: Partial<User>): void => {
			update((user) => {
				if (user) {
					return { ...user, ...partialUser };
				}
				return user;
			});
		}
	};
}

export const sessionStore = createSessionStore();
