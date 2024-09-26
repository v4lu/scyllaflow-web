import { authAPI } from '$lib/api';
import { ACCESS_TOKEN } from '$lib/constants';
import type { Workspace } from '$lib/types/workspace.type';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get(ACCESS_TOKEN);

	if (!accessToken) {
		throw redirect(307, '/sign-in');
	}

	const api = authAPI(accessToken);

	const workspaces = (await api.get<Workspace[]>('workspace').json()) ?? [];
	if (workspaces.length > 0) {
		redirect(307, `/workspace/${workspaces[0].slug}`);
	}
	return {
		workspaces,
		accessToken
	};
};
