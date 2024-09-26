import type { Cookies } from '@sveltejs/kit';
import { isProduction } from './constants';

export function setCookie(name: string, value: string, expiry: string, cookies: Cookies) {
	const now = new Date().getTime();
	const bufferTime = 2 * 1000; // 2 seconds in milliseconds
	const expiryDate = new Date(expiry).getTime();
	const maxAge = Math.max(0, Math.floor((expiryDate - now - bufferTime) / 1000));

	cookies.set(name, value, {
		httpOnly: true,
		secure: isProduction,
		sameSite: 'strict',
		path: '/',
		maxAge
	});
}
