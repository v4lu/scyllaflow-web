import { authAPI } from '$lib/api';
import type { Issue as IssueType, UpdateIssuseRequest } from '$lib/types/issue.type';
import type { HTTPError } from 'ky';

class Issue {
	error = $state(null);
	isLoading = $state(false);

	issue = $state<IssueType>();

	isSubmittingUpdate = $state(false);
}

export function useIssue(authToken: string, id: number | undefined, slug: string, load = true) {
	const resp = new Issue();
	const api = authAPI(authToken);

	async function loadIssue() {
		resp.isLoading = true;
		try {
			const response = await api.get<IssueType>(`issue/${slug}/${id}`).json();
			resp.issue = response;
		} catch (error) {
			console.error('Error fetching workspaces:', error);
		}
		resp.isLoading = false;
	}

	async function updateIssue(issue: IssueType) {
		resp.isSubmittingUpdate = true;
		try {
			const payload: UpdateIssuseRequest = {
				title: issue.title,
				description: issue.description,
				status: issue.status,
				priority: issue.priority,
				dueDate: issue.dueDate
			};
			const response = await api
				.patch<IssueType>(`issue/${slug}/${id}`, {
					json: payload
				})
				.json();

			resp.issue = response;
			resp.isSubmittingUpdate = false;

			return response;
		} catch (error) {
			const e = error as HTTPError;
			console.error(e.response);

			resp.isSubmittingUpdate = false;
		}
	}

	if (load) loadIssue();

	return {
		updateIssue,
		resp,
		loadIssue
	};
}
