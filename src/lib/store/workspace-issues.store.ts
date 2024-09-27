import { authAPI } from '$lib/api';
import type { Icons } from '$lib/components/icons';
import type { CreateIssue, Issue } from '$lib/types/issue.type';
import { derived, writable } from 'svelte/store';
import { toast } from './toast.store';

type IconsType = typeof Icons;
export type StatusIconName = keyof IconsType['status'];
export type PriorityIconName = keyof IconsType['priority'];
export type GroupedIssues = Record<StatusIconName, Issue[]>;

export const issuesStore = writable<Issue[]>([]);
export const isLoadingStore = writable(false);
export const isSubmittingCreateIssueStore = writable(false);

export const groupedIssuesStore = derived(issuesStore, ($issues) => {
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
		}
		isLoadingStore.set(false);
	}

	async function createIssue(payload: CreateIssue) {
		isSubmittingCreateIssueStore.set(true);
		try {
			const response = await api
				.post<Issue>(`issue/${slug}`, {
					json: { ...payload }
				})
				.json();
			issuesStore.update((issues) => [response, ...issues]);
			toast.success('Successfully created new task');
		} catch (err) {
			console.error('Error creating task:', err);
			toast.error('Failed to create task. Please try again.');
		}
		isSubmittingCreateIssueStore.set(false);
	}

	loadWorkspaceIssues();

	return {
		createIssue
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

export function getStatusOrder(status: StatusIconName): number {
	return statusOrder.indexOf(status);
}
