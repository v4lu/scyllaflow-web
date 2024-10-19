import type { UserResponse } from '$lib/types/user.type';
import { writable } from 'svelte/store';

type UserStore = {
	subscribe: (
		this: void,
		run: (value: UserResponse) => void,
		invalidate?: () => void
	) => () => void;
	setUser: (user: UserResponse) => void;
	updateUser: (partialUser: Partial<UserResponse>) => void;
};

function createSessionStore(): UserStore {
	const { subscribe, set, update } = writable<UserResponse>();

	return {
		subscribe,
		setUser: (user: UserResponse) => set(user),
		updateUser: (partialUser: Partial<UserResponse>): void => {
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
