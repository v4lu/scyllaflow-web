import { authAPI } from '$lib/api';
import { ACCESS_TOKEN } from '$lib/constants';
import type { Workspace } from '$lib/types/workspace.type';
import { redirect } from '@sveltejs/kit';
import type { HTTPError } from 'ky';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const accessToken = cookies.get(ACCESS_TOKEN);

	if (!accessToken) {
		throw redirect(307, '/sign-in');
	}

	const api = authAPI(accessToken);

	try {
		const workspace = await api.get<Workspace>(`workspace/${params.slug}`).json();

		return {
			workspace
		};
	} catch (e) {
		const err = e as HTTPError;
		if (err.response.status === 404) {
			throw redirect(307, '/');
		}
	}
};
