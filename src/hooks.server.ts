import { refreshToken } from '$lib/api';
import { ACCESS_TOKEN, COGNITO_ID, REFRESH_TOKEN } from '$lib/constants';
import { setCookie } from '$lib/cookies';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const access = event.cookies.get(ACCESS_TOKEN);
	const refresh = event.cookies.get(REFRESH_TOKEN);
	const cognitoId = event.cookies.get(COGNITO_ID);

	if (!access && refresh && cognitoId) {
		try {
			const refreshedTokens = await refreshToken(refresh, cognitoId);

			setCookie(
				ACCESS_TOKEN,
				refreshedTokens.access_token,
				refreshedTokens.access_token_expiry,
				event.cookies
			);

			event.request.headers.set('Authorization', `Bearer ${refreshedTokens.access_token}`);
		} catch (error) {
			console.error(error);
			event.cookies.delete(ACCESS_TOKEN, { path: '/' });
			event.cookies.delete(REFRESH_TOKEN, { path: '/' });
			event.cookies.delete(COGNITO_ID, { path: '/' });
			return new Response(null, { status: 302, headers: { Location: '/sign-in' } });
		}
	}

	const response = await resolve(event);
	return response;
};
