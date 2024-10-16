import { goto } from '$app/navigation';
import { authAPI, catchErr } from '$lib/api';
import type { User } from '$lib/types/user.type';
import type { Workspace as WorkspaceType } from '$lib/types/workspace.type';
import { HTTPError } from 'ky';

class Workspace {
	workspace = $state<WorkspaceType>();
	workspaceUsers = $state<User[]>([]);
	isLoadingUsers = $state(false);
}

export function useWorkspace(authToken: string, workspace: WorkspaceType) {
	const resp = new Workspace();
	resp.workspace = workspace;
	const api = authAPI(authToken);

	async function getWorkspaceUsers() {
		if (!workspace) return;
		resp.isLoadingUsers = true;
		// /workspace/valu/users/13
		const [users, error] = await catchErr(
			api.get<User[]>(`workspace/${workspace.slug}/users/${workspace.id}`).json()
		);

		if (error instanceof HTTPError) {
			switch (error.response.status) {
				case 401:
					goto('/');
					break;
				case 500:
					goto('/');
			}
		}
		resp.workspaceUsers = users || [];
		resp.isLoadingUsers = false;
	}

	getWorkspaceUsers();

	return {
		resp
	};
}
