<script lang="ts">
	import type { Issue } from '$lib/types/issue.type';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { clickOutside, cn, formatDateOrDefault, getContrastColor } from '$lib';
	import { Editor } from '$lib/components/ui/editor';
	import { useIssue } from '$lib/api/use-issue.svelte';
	import { Input } from '../ui/input';
	import {
		priorityOrder,
		statusOrder,
		useWorkspaceIssues
	} from '$lib/store/workspace-issues.store';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import { Icons } from '$lib/components/icons';

	type Props = {
		issue: Issue | null;
		onClose: () => void;
		authToken: string;
		slug: string;
	};

	let { issue, onClose, authToken, slug }: Props = $props();
	const { resp, updateIssue, loadIssue } = useIssue(authToken, issue?.id, slug, false);
	const { updateLocalIssue } = useWorkspaceIssues(authToken, slug);

	$effect(() => {
		if (issue) {
			loadIssue();
		}
	});

	let formattedDueDate = $derived(resp.issue ? formatDateOrDefault(resp.issue.dueDate) : '-');
	let statusDropdownOpen = $state(false);
	let priorityDropdownOpen = $state(false);

	function parseDescription(description: string | undefined): object {
		if (!description) return {};
		try {
			return JSON.parse(description);
		} catch (error) {
			console.error('Error parsing description:', error);
			return {
				type: 'doc',
				content: [{ type: 'paragraph', content: [{ type: 'text', text: description }] }]
			};
		}
	}

	function handleTitleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (resp.issue) {
			resp.issue.title = target.value;
		}
	}

	function handleDescriptionUpdate(newContent: object) {
		if (resp.issue) {
			resp.issue.description = JSON.stringify(newContent);
		}
	}

	async function handleUpdateIssue() {
		if (resp.issue) {
			const res = await updateIssue(resp.issue);
			if (res) {
				updateLocalIssue(res);
			}
		}
	}

	function selectStatus(status: string) {
		if (resp.issue) {
			resp.issue.status = status;
		}
		statusDropdownOpen = false;
	}

	function selectPriority(priority: string) {
		if (resp.issue) {
			resp.issue.priority = priority;
		}
		priorityDropdownOpen = false;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'InProgress':
				return 'text-yellow-500';
			case 'Blocked':
			case 'Cancelled':
				return 'text-red-500';
			case 'Done':
				return 'text-green-500';
			case 'Backlog':
				return 'text-purple-500';
			default:
				return 'text-blue-500';
		}
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'Urgent':
				return 'text-red-500';
			case 'High':
				return 'text-orange-500';
			case 'Medium':
				return 'text-yellow-500';
			case 'Low':
				return 'text-green-500';
			default:
				return 'text-blue-500';
		}
	}
</script>

<div
	use:clickOutside={onClose}
	class="fixed right-0 top-0 z-[10] h-full w-[40rem] overflow-y-auto border-l border-border bg-background shadow-lg transition-transform duration-300 ease-out"
	class:translate-x-full={!issue}
	class:translate-x-0={issue}
>
	{#if issue}
		<div class="sticky top-0 border-b border-border bg-background p-3">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">
					{resp.issue ? 'Edit Issue' : 'Loading Issue...'}
				</h2>
				<Button variant="ghost" size="icon" onclick={onClose}>
					<Icon icon="lucide:x" class="size-5" />
				</Button>
			</div>
		</div>
		{#if !resp.issue || resp.isLoading}
			<div class="flex h-[calc(100%-56px)] items-center justify-center">
				<Icon icon="line-md:loading-twotone-loop" class="size-12 text-primary" />
			</div>
		{:else}
			<div class="space-y-6 p-6">
				<div>
					<p class="mb-2 text-sm font-medium text-muted-foreground">Title</p>
					<Input
						oninput={handleTitleChange}
						variant="empty"
						value={resp.issue.title}
						class="text-xl font-medium"
					/>
				</div>
				<div class="flex items-center justify-between">
					<div>
						<p class="mb-2 text-sm font-medium text-muted-foreground">ID</p>
						<p class="text-sm font-semibold">{resp.issue.custom_id}</p>
					</div>
					<div>
						<p class="mb-2 text-sm font-medium text-muted-foreground">Due Date</p>
						<p class="text-sm font-semibold">{formattedDueDate}</p>
					</div>
				</div>
				<div class="flex gap-4">
					<div class="flex-1">
						<p class="mb-2 text-sm font-medium text-muted-foreground">Status</p>
						<Dropdown
							bind:isOpen={statusDropdownOpen}
							triggerText={resp.issue.status}
							downArrowIcon
							CustomIcon={Icons.status[resp.issue.status]}
							customIconClass={cn(getStatusColor(resp.issue.status), 'size-5')}
							triggerIconPosition="left"
							triggerClass="w-full justify-between"
						>
							{#each statusOrder as status}
								{@const Icon = Icons.status[status]}
								<button
									class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
									onclick={() => selectStatus(status)}
								>
									<Icon class={cn('size-4', getStatusColor(status))} />
									<span>{status}</span>
								</button>
							{/each}
						</Dropdown>
					</div>
					<div class="flex-1">
						<p class="mb-2 text-sm font-medium text-muted-foreground">Priority</p>
						<Dropdown
							bind:isOpen={priorityDropdownOpen}
							triggerText={resp.issue.priority}
							downArrowIcon
							CustomIcon={Icons.priority[resp.issue.priority]}
							customIconClass={cn(getPriorityColor(resp.issue.priority), 'size-5')}
							triggerIconPosition="left"
							triggerClass="w-full  justify-between"
						>
							{#each priorityOrder as priority}
								{@const Icon = Icons.priority[priority]}
								<button
									class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
									onclick={() => selectPriority(priority)}
								>
									<Icon class={cn('size-4', getPriorityColor(priority))} />
									<span>{priority}</span>
								</button>
							{/each}
						</Dropdown>
					</div>
				</div>
				{#if resp.issue.tags && resp.issue.tags.length > 0}
					<div>
						<p class="mb-2 text-sm font-medium text-muted-foreground">Tags</p>
						<div class="flex flex-wrap gap-2">
							{#each resp.issue.tags as tag}
								<span
									class="rounded-full px-3 py-1 text-xs font-medium"
									style="background-color: {tag.color}; color: {getContrastColor(tag.color)};"
								>
									{tag.name}
								</span>
							{/each}
						</div>
					</div>
				{/if}
				<div>
					<p class="mb-2 text-sm font-medium text-muted-foreground">Description</p>
					<Editor
						content={parseDescription(resp.issue.description)}
						update={handleDescriptionUpdate}
						placeholder="Add a description..."
					/>
				</div>
				<Button
					disabled={resp.isSubmittingUpdate}
					isLoading={resp.isSubmittingUpdate}
					onclick={handleUpdateIssue}
					class="w-full"
				>
					Update Issue
				</Button>
			</div>
		{/if}
	{/if}
</div>
