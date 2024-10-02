import { authAPI } from '$lib/api';
import type { Icons } from '$lib/components/icons';
import type { CreateIssue, Issue, UpdateIssuseRequest } from '$lib/types/issue.type';
import { derived, writable } from 'svelte/store';
import { toast } from './toast.store';

type IconsType = typeof Icons;
export type StatusIconName = keyof IconsType['status'];
export type PriorityIconName = keyof IconsType['priority'];
export type GroupedIssues = Record<StatusIconName, Issue[]>;

export const issuesStore = writable<Issue[] | null>(null);
export const isLoadingStore = writable(false);
export const isSubmittingCreateIssueStore = writable(false);

export const groupedIssuesStore = derived(issuesStore, ($issues) => {
	if (!$issues) return null;
	return $issues.reduce((acc, issue) => {
		const status = issue.status as StatusIconName;
		if (!acc[status]) {
			acc[status] = [];
		}
		acc[status].push(issue);
		return acc;
	}, {} as GroupedIssues);
});

export function useWorkspaceIssues(authToken: string, slug: string) {
	const api = authAPI(authToken);

	async function loadWorkspaceIssues() {
		isLoadingStore.set(true);
		try {
			const response = await api.get<Issue[]>(`issue/${slug}`).json();
			issuesStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			issuesStore.set(null); // Set to null on error
			toast.error('Failed to load issues. Please try again.');
		} finally {
			isLoadingStore.set(false);
		}
	}

	async function createIssue(payload: CreateIssue) {
		isSubmittingCreateIssueStore.set(true);
		try {
			const response = await api
				.post<Issue>(`issue/${slug}`, {
					json: { ...payload }
				})
				.json();
			issuesStore.update((issues) => (issues ? [response, ...issues] : [response]));
			toast.success('Successfully created new task');
		} catch (err) {
			console.error('Error creating task:', err);
			toast.error('Failed to create task. Please try again.');
		} finally {
			isSubmittingCreateIssueStore.set(false);
		}
	}

	async function deleteIssue(id: number) {
		try {
			await api.delete(`issue/${slug}/${id}`);
			issuesStore.update((issues) => (issues ? issues.filter((issue) => issue.id !== id) : null));
			toast.success('Successfully deleted task');
		} catch (err) {
			console.error('Error deleting task:', err);
			toast.error('Failed to delete task. Please try again.');
		}
	}

	async function updateIssue(issue: Issue) {
		try {
			const payload: UpdateIssuseRequest = {
				priority: issue.priority,
				status: issue.status,
				title: issue.title,
				description: issue.description
			};
			const response = await api
				.patch<Issue>(`issue/${slug}/${issue.id}`, {
					json: { ...payload }
				})
				.json();
			issuesStore.update((issues) =>
				issues ? issues.map((i) => (i.id === issue.id ? { ...i, ...response } : i)) : null
			);
			toast.success('Successfully updated task');
		} catch (err) {
			console.error('Error updating task:', err);
			toast.error('Failed to update task. Please try again.');
		}
	}

	loadWorkspaceIssues();

	return {
		createIssue,
		deleteIssue,
		updateIssue
	};
}

export const statusOrder: StatusIconName[] = [
	'Backlog',
	'Todo',
	'InProgress',
	'Done',
	'Cancelled',
	'Blocked'
];

export const priorityOrder: PriorityIconName[] = ['Low', 'Medium', 'High', 'Urgent'];

export function getStatusOrder(status: StatusIconName): number {
	return statusOrder.indexOf(status);
}
