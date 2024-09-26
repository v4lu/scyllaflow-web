import { authAPI } from '$lib/api';
import { toast } from '$lib/store/toast.store';
import type { Workspace } from '$lib/types/workspace.type';

class Workspaces {
	error = $state(null);
	isLoading = $state(false);

	workspaces = $state<Workspace[]>([]);

	isSubbmitingCreateWorkspace = $state(false);
}

export function useWorkspaces(authToken: string) {
	const resp = new Workspaces();
	const api = authAPI(authToken);

	async function loadWorkspaces() {
		resp.isLoading = true;
		try {
			const response = await api.get<Workspace[]>('workspace').json();
			resp.workspaces = response ?? [];
		} catch (error) {
			console.error('Error fetching workspaces:', error);
		}
		resp.isLoading = false;
	}

	async function createWorkspace(name: string, image: string) {
		resp.isSubbmitingCreateWorkspace = true;
		try {
			const response = await api
				.post<Workspace>('workspace', {
					json: { name, image }
				})
				.json();
			resp.workspaces.push(response);
			toast.success('Successfully created new workspace');
		} catch (err) {
			console.error('Error creating workspace:', err);
			toast.error('Failed to create workspace. Please try again.');
		}
		resp.isSubbmitingCreateWorkspace = false;
	}
	loadWorkspaces();

	return {
		createWorkspace,
		resp
	};
}
