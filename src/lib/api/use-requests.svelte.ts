import { authAPI } from '$lib/api';
import { toast } from '$lib/store/toast.store';
import type { RequestType } from '$lib/types/request.type';

class Request {
	isSubmittingInvite = $state(false);
	isLoading = $state(false);
	requests = $state<RequestType[]>([]);
}

export function useRequest(authToken: string) {
	const resp = new Request();
	const api = authAPI(authToken);

	async function inviteUser(username: string, slug: string) {
		resp.isSubmittingInvite = true;
		try {
			const response = await api
				.post(`request/${slug}`, {
					json: { username }
				})
				.json();
			toast.success('Successfully invited user to workspace');
		} catch (err) {
			console.error('Error creating workspace:', err);
			toast.error('Failed to create workspace. Please try again.');
		}
		resp.isSubmittingInvite = false;
	}

	async function loadRequests() {
		resp.isLoading = true;
		try {
			const response = await api.get<RequestType[]>('request').json();
			resp.requests = response;
		} catch (error) {
			console.error('Error fetching workspaces:', error);
		}
		resp.isLoading = false;
	}

	async function answerRequest(answer: boolean, workspaceId: number) {
		try {
			const payload = {
				answer,
				workspaceId
			};
			const response = await api
				.post('request', {
					json: { ...payload }
				})
				.json();
			toast.success('Successfully invited user to workspace');
		} catch (error) {
			console.error(error);
		}
	}

	loadRequests();

	return {
		inviteUser,
		answerRequest,
		resp
	};
}
