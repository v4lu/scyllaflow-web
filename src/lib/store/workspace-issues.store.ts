import { authAPI } from '$lib/api';
import type { Icons } from '$lib/components/icons';
import type {
	CreateIssue,
	CreateProject,
	CreateTag,
	Issue,
	Project,
	Tag,
	UpdateIssuseRequest
} from '$lib/types/issue.type';
import { derived, writable } from 'svelte/store';
import { toast } from './toast.store';

type IconsType = typeof Icons;
export type StatusIconName = keyof IconsType['status'];
export type PriorityIconName = keyof IconsType['priority'];
export type GroupedIssues = Record<StatusIconName, Issue[]>;

export const issuesStore = writable<Issue[] | null>(null);
export const tagsStore = writable<Tag[] | null>(null);
export const projectsStore = writable<Project[] | null>(null);
export const isLoadingStore = writable(false);
export const isSubmittingCreateIssueStore = writable(false);
export const isSubmittingCreateTagStore = writable(false);
export const isSubmittingCreateProjectStore = writable(false);

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

export function useWorkspaceIssues(authToken: string, slug: string | undefined) {
	const api = authAPI(authToken);

	async function loadWorkspaceIssues() {
		isLoadingStore.set(true);
		try {
			const response = await api.get<Issue[]>(`issue/${slug}`).json();
			issuesStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			issuesStore.set(null);
			toast.error('Failed to load issues. Please try again.');
		} finally {
			isLoadingStore.set(false);
		}
	}

	async function loadWorkspaceTags() {
		try {
			const response = await api.get<Tag[]>(`issue/${slug}/tag`).json();
			tagsStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			tagsStore.set(null);
			toast.error('Failed to load tags. Please try again.');
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

	async function createTag(payload: CreateTag) {
		isSubmittingCreateTagStore.set(true);
		try {
			const response = await api
				.post<Tag>(`issue/${slug}/tag`, {
					json: { ...payload }
				})
				.json();
			tagsStore.update((tags) => (tags ? [response, ...tags] : [response]));
			toast.success('Successfully created new task');
		} catch (err) {
			console.error('Error creating task:', err);
			toast.error('Failed to create task. Please try again.');
		}
		isSubmittingCreateTagStore.set(false);
	}

	async function getByTag(tagId: number) {
		try {
			const response = await api.get<Issue[]>(`issue/${slug}/tag/${tagId}`).json();
			issuesStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			issuesStore.set(null);
			toast.error('Failed to load issues. Please try again.');
		}
	}

	async function createProject(payload: CreateProject) {
		isSubmittingCreateProjectStore.set(true);
		try {
			const response = await api
				.post<Project>(`project/${slug}`, {
					json: { ...payload }
				})
				.json();
			projectsStore.update((issues) => (issues ? [response, ...issues] : [response]));
			toast.success('Successfully created new project');
		} catch (err) {
			console.error('Error creating project:', err);
			toast.error('Failed to create project. Please try again.');
		}
		isSubmittingCreateProjectStore.set(false);
	}

	async function loadWorkspaceProjects(tslug: string) {
		try {
			const response = await api.get<Project[]>(`project/${tslug}`).json();
			projectsStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			projectsStore.set(null);
			toast.error('Failed to load projects. Please try again.');
		}
	}

	async function getByProject(id: number) {
		try {
			const response = await api.get<Issue[]>(`project/${slug}/${id}/issues`).json();
			issuesStore.set(response);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
			issuesStore.set(null);
			toast.error('Failed to load issues. Please try again.');
		}
	}

	function updateLocalIssue(updatedIssue: Issue) {
		issuesStore.update((issues) => {
			if (!issues) return null;
			return issues.map((issue) =>
				issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue
			);
		});
	}

	loadWorkspaceIssues();
	loadWorkspaceTags();
	loadWorkspaceProjects(slug!);

	return {
		createIssue,
		deleteIssue,
		updateIssue,
		createTag,
		getByTag,
		loadWorkspaceTags,
		loadWorkspaceIssues,
		createProject,
		getByProject,
		loadWorkspaceProjects,
		updateLocalIssue
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
