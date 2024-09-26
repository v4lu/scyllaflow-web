import { authAPI } from '$lib/api';
import type { Workspace } from '$lib/types/workspace.type';

class ProfilePosts {
	error = $state(null);
	isLoading = $state(false);

	workspaces = $state<Workspace[]>([]);
}

export function useWorkspaces(authToken: string) {
	const resp = new ProfilePosts();
	const api = authAPI(authToken);

	async function loadWorkspaces() {
		resp.isLoading = true;
		try {
			const response = await api.get<Workspace[]>('workspace').json();
			resp.workspaces = response;
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
		resp.isLoading = false;
	}
	loadWorkspaces();
	{
		resp;
	}
}
