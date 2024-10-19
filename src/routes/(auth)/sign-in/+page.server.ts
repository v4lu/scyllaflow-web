import { api } from '$lib/api.js';
import { type UserLoginSchemaPayload, userLoginSchema } from '$lib/validators/auth.validator.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
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
	login: async ({ request }) => {
		const form = await superValidate(request, zod(userLoginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const payload: UserLoginSchemaPayload = {
			email: form.data.email
		};
		await api
			.post<LoginResponse>('auth/magic-link', {
				json: payload
			})
			.json();

		throw redirect(307, '/welcome');
	}
};
