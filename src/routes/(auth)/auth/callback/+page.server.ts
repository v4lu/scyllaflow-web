import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setCookie } from '$lib/cookies';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '$lib/constants';

type TokenResponse = {
	message: string;
	email: string;
	access_token: string;
	refresh_token: string;
	access_token_expiry: string;
	refresh_token_expiry: string;
};

function base64Decode(str: string): string {
	const binaryStr = atob(str);
	const bytes = new Uint8Array(binaryStr.length);
	for (let i = 0; i < binaryStr.length; i++) {
		bytes[i] = binaryStr.charCodeAt(i);
	}
	return new TextDecoder().decode(bytes);
}

export const load: PageServerLoad = ({ url, cookies }) => {
	const encodedData = url.searchParams.get('data');

	if (!encodedData) throw redirect(307, '/sign-in');

	const decodedURIComponent = decodeURIComponent(encodedData);
	const decodedString = base64Decode(decodedURIComponent);
	const parsedData: TokenResponse = JSON.parse(decodedString);

	setCookie(ACCESS_TOKEN, parsedData.access_token, parsedData.access_token_expiry, cookies);
	setCookie(REFRESH_TOKEN, parsedData.refresh_token, parsedData.refresh_token_expiry, cookies);
	redirect(307, '/');
};
