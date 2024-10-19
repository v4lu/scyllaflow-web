import { authAPI } from '$lib/api';
import { ACCESS_TOKEN } from '$lib/constants';
import type { UserResponse } from '$lib/types/user.type';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, params }) => {
	const accessToken = cookies.get(ACCESS_TOKEN);

	if (!accessToken) {
		throw redirect(307, '/sign-in');
	}

	const api = authAPI(accessToken);

	const user = await api.get<UserResponse>('user').json();

	return {
		user,
		accessToken,
		slug: params.slug
	};
};
