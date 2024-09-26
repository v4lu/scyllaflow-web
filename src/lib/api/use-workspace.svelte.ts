import { authAPI } from '$lib/api';
import type { Workspace as WorkspaceType } from '$lib/types/workspace.type';

class Workspace {
	workspace = $state<WorkspaceType>();
}

export function useWorkspace(authToken: string, workspace: WorkspaceType) {
	const resp = new Workspace();
	resp.workspace = workspace;
	const api = authAPI(authToken);

	return {
		resp
	};
}
