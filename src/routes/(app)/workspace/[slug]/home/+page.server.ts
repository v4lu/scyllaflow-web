import { authAPI, catchErr } from '$lib/api';
import { ACCESS_TOKEN } from '$lib/constants';
import type { Workspace } from '$lib/types/workspace.type';
import { HTTPError } from 'ky';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const authToken = cookies.get(ACCESS_TOKEN);

	if (!authToken) {
		throw redirect(307, '/sign-in');
	}
	const api = authAPI(authToken);

	const [workspace, error] = await catchErr(api.get<Workspace>(`workspace/${params.slug}`).json());
	if (error instanceof HTTPError) {
		switch (error.response.status) {
			case 404:
				throw redirect(307, '/404');
			case 401:
				throw redirect(307, '/sign-in');
			case 500:
				// some tracing would be cool to have here
				throw redirect(307, '/');
		}
	}

	if (!workspace) throw redirect(307, '/404');

	return {
		slug: params.slug,
		workspace
	};
};
