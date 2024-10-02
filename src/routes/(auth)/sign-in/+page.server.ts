import { api } from '$lib/api.js';
import { ACCESS_TOKEN, COGNITO_ID, REFRESH_TOKEN } from '$lib/constants.js';
import { setCookie } from '$lib/cookies.js';
import { type UserLoginSchemaPayload, userLoginSchema } from '$lib/validators/auth.validator.js';
import { fail, redirect } from '@sveltejs/kit';
import { HTTPError } from 'ky';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

type LoginResponse = {
	access_token: string;
	refresh_token: string;
	access_token_expiry: string;
	refresh_token_expiry: string;
	cognito_id: string;
	cognito_id_expiry: string;
};

export async function load() {
	const form = await superValidate(zod(userLoginSchema));

	return {
		form
	};
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(userLoginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const payload: UserLoginSchemaPayload = {
			email: form.data.email,
			password: form.data.password
		};
		try {
			const res = await api
				.post<LoginResponse>('auth/login', {
					json: payload
				})
				.json();
			const {
				access_token,
				access_token_expiry,
				cognito_id,
				cognito_id_expiry,
				refresh_token,
				refresh_token_expiry
			} = res;

			setCookie(ACCESS_TOKEN, access_token, access_token_expiry, cookies);
			setCookie(REFRESH_TOKEN, refresh_token, refresh_token_expiry, cookies);
			setCookie(COGNITO_ID, cognito_id, cognito_id_expiry, cookies);
		} catch (error) {
			if (error instanceof HTTPError) {
				if (error.response.status === 401) {
					const res = await error.response.json();
					return setError(form, `CREDENTIALS: ${res.message}`);
				}
				return setError(form, 'SERVER: There is currently server issues, please try again later.');
			}
			if (error instanceof Error && error.message.startsWith('REDIRECT:')) {
				throw error;
			}
			console.error('Unexpected error:', error);
			return setError(form, 'SERVER: An unexpected error occurred.');
		}

		throw redirect(307, '/');
	}
};
