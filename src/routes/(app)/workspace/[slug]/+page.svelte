<script lang="ts">
	import { cn, formatDateOrDefault, isPastToday, monthAndDay } from '$lib';
	import { Icons } from '$lib/components/icons/index.js';
	import { Button } from '$lib/components/ui/button';
	import { ContextMenu } from '$lib/components/ui/context-menu/index.js';
	import { DeleteModal } from '$lib/components/ui/modal';
	import {
		type PriorityIconName,
		type StatusIconName,
		groupedIssuesStore,
		priorityOrder,
		statusOrder,
		useWorkspaceIssues
	} from '$lib/store/workspace-issues.store.js';
	import type { Issue } from '$lib/types/issue.type.js';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const { deleteIssue, updateIssue } = useWorkspaceIssues(data.accessToken, data.slug!);
	let isHorizontalView = $state(false);
	let sortedStatusKeys = $derived(
		statusOrder.filter((status) => $groupedIssuesStore[status]?.length > 0)
	);
	let issueCountsByStatus = $derived(
		Object.entries($groupedIssuesStore).reduce(
			(acc, [status, issues]) => {
				acc[status as StatusIconName] = issues.length;
				return acc;
			},
			{} as Record<StatusIconName, number>
		)
	);

	let showContextMenu = $state(false);
	let contextMenuX = $state(0);
	let contextMenuY = $state(0);
	let selectedIssue = $state<Issue | null>(null);
	let showStatusSubmenu = $state(false);
	let showPrioritySubmenu = $state(false);
	let hideStatusSubmenuTimeout = $state<number | null>(null);
	let hidePrioritySubmenuTimeout = $state<number | null>(null);
	let showDeleteConfirmation = $state(false);

	function toggleView() {
		isHorizontalView = !isHorizontalView;
	}

	function getPriorityIcon(priority: PriorityIconName) {
		return Icons.priority[priority];
	}

	function getStatusIcon(status: StatusIconName) {
		return Icons.status[status];
	}

	function handleContextMenu(event: MouseEvent, issue: Issue) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		showContextMenu = true;
		contextMenuX = event.clientX;
		contextMenuY = rect.top + rect.height / 2;
		selectedIssue = issue;
	}

	function handleWindowClick() {
		if (showContextMenu) {
			showContextMenu = false;
		}
	}

	function handleWindowResize() {
		if (showContextMenu) {
			showContextMenu = false;
		}
	}

	function handleStatusMouseEnter() {
		if (hideStatusSubmenuTimeout) {
			clearTimeout(hideStatusSubmenuTimeout);
			hideStatusSubmenuTimeout = null;
		}
		showStatusSubmenu = true;
		showPrioritySubmenu = false;
	}

	function handleStatusMouseLeave() {
		hideStatusSubmenuTimeout = setTimeout(() => {
			showStatusSubmenu = false;
		}, 300) as unknown as number;
	}

	function handlePriorityMouseEnter() {
		if (hidePrioritySubmenuTimeout) {
			clearTimeout(hidePrioritySubmenuTimeout);
			hidePrioritySubmenuTimeout = null;
		}
		showPrioritySubmenu = true;
		showStatusSubmenu = false;
	}

	function handlePriorityMouseLeave() {
		hidePrioritySubmenuTimeout = setTimeout(() => {
			showPrioritySubmenu = false;
		}, 300) as unknown as number;
	}

	function handleSubmenuMouseEnter(submenu: 'status' | 'priority') {
		if (submenu === 'status') {
			if (hideStatusSubmenuTimeout) {
				clearTimeout(hideStatusSubmenuTimeout);
				hideStatusSubmenuTimeout = null;
			}
		} else {
			if (hidePrioritySubmenuTimeout) {
				clearTimeout(hidePrioritySubmenuTimeout);
				hidePrioritySubmenuTimeout = null;
			}
		}
	}

	function handleSubmenuMouseLeave(submenu: 'status' | 'priority') {
		if (submenu === 'status') {
			hideStatusSubmenuTimeout = setTimeout(() => {
				showStatusSubmenu = false;
			}, 300) as unknown as number;
		} else {
			hidePrioritySubmenuTimeout = setTimeout(() => {
				showPrioritySubmenu = false;
			}, 300) as unknown as number;
		}
	}

	function handleDeleteClick() {
		showContextMenu = false;
		showDeleteConfirmation = true;
	}

	function handleDeleteConfirm() {
		if (selectedIssue) {
			deleteIssue(selectedIssue.id);
			showDeleteConfirmation = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} onresize={handleWindowResize} />

<main class="">
	<section class="hi-ft w-full border-b border-border">
		<div class="flex justify-between px-4 py-2 lg:px-8">
			<h3 class="text-sm font-medium">Filter</h3>
			<h3 class="text-sm font-medium">Display</h3>
			<button onclick={toggleView}>
				{isHorizontalView ? 'Card View' : 'Table View'}
			</button>
		</div>
	</section>
	{#if isHorizontalView}
		<div class="h-[calc(100dvh-130px)] w-[calc(100vw-260px)] overflow-hidden">
			<div class="h-full w-full overflow-x-auto overflow-y-auto">
				<div class="flex h-full">
					{#each sortedStatusKeys as status}
						<div class="flex-shrink-0 p-4">
							<h2 class="sticky top-0 z-10 mb-2 bg-background py-2 text-sm font-medium">
								{status} ({issueCountsByStatus[status] || 0})
							</h2>
							<div class="flex flex-col gap-2">
								{#each $groupedIssuesStore[status] || [] as issue}
									<div class="w-[30rem] rounded-lg border border-border bg-card p-4 shadow-sm">
										<div class="flex items-center gap-2">
											<p class="text-xs text-muted-foreground">{issue.custom_id}</p>
										</div>
										<p class="font-medium">{issue.title}</p>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="h-[calc(100dvh-110px)] overflow-hidden">
			<div class="h-full overflow-y-auto">
				{#each sortedStatusKeys as status}
					{@const IconStatus = getStatusIcon(status)}

					<section class="w-full">
						<div
							class="sticky top-0 z-10 flex h-fit w-full items-center justify-start gap-4 bg-card px-4 py-2 lg:px-8"
						>
							<IconStatus
								class={cn(
									'size-5',
									status === 'InProgress' && 'text-yellow-500 dark:text-yellow-400',
									status === 'Blocked' && 'text-destructive',
									status === 'Cancelled' && 'text-destructive',
									status === 'Done' && 'text-emerald-600 dark:text-emerald-400',
									status === 'Backlog' && 'text-purple-600 dark:text-purple-400'
								)}
							/>

							<h2 class="text-xs font-medium">
								{status} ({issueCountsByStatus[status] || 0})
							</h2>
						</div>
						<div>
							{#each $groupedIssuesStore[status] || [] as issue}
								{@const IconPriority = getPriorityIcon(issue.priority)}
								{@const IconStatus = getStatusIcon(issue.status)}
								<div
									tabindex="0"
									role="button"
									aria-roledescription="extra actions for issue"
									oncontextmenu={(e) => handleContextMenu(e, issue)}
									class="grid cursor-default grid-cols-[auto_auto_auto_1fr_auto] items-center gap-4 border-b border-border px-4 py-2 lg:px-8"
								>
									<IconPriority class="size-5" />
									<p class="w-20 truncate text-xs text-muted-foreground">
										{issue.custom_id}
									</p>
									<IconStatus
										class={cn(
											'size-5',
											issue.status === 'InProgress' && 'text-yellow-500 dark:text-yellow-400',
											issue.status === 'Blocked' && 'text-destructive',
											issue.status === 'Cancelled' && 'text-destructive',
											issue.status === 'Done' && 'text-emerald-600 dark:text-emerald-400',
											issue.status === 'Backlog' && 'text-purple-600 dark:text-purple-400'
										)}
									/>
									<a href={`/workspace/${data.slug}/issue/${issue.id}`} class="w-fit font-medium"
										>{issue.title}</a
									>
									<p
										class={cn(
											'text-xs font-semibold text-muted-foreground',
											formatDateOrDefault(issue.dueDate) !== '-' &&
												isPastToday(issue.dueDate) &&
												'text-destructive'
										)}
									>
										{issue.dueDate ? monthAndDay(issue.dueDate) : '-'}
									</p>
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</div>
	{/if}
</main>

<ContextMenu isOpen={showContextMenu} x={contextMenuX} class="min-w-[12rem] p-0" y={contextMenuY}>
	<div
		tabindex="0"
		role="button"
		aria-roledescription="extra actions for issue status"
		class="relative"
		onmouseenter={handleStatusMouseEnter}
		onmouseleave={handleStatusMouseLeave}
	>
		<Button variant="ghost" size="sm" class="w-full justify-between">
			<span class="flex items-center">
				<Icon icon="solar:sort-from-top-to-bottom-bold" class="mr-2 size-5" />
				Change Status
			</span>
			<Icon icon="lucide:chevron-right" class="size-4" />
		</Button>
		{#if showStatusSubmenu}
			<div
				tabindex="0"
				role="button"
				aria-roledescription="select new status"
				class="absolute left-full top-0 ml-1 w-40 rounded-md border border-border bg-card shadow-md"
				transition:fade={{ duration: 300 }}
				onmouseenter={() => handleSubmenuMouseEnter('status')}
				onmouseleave={() => handleSubmenuMouseLeave('status')}
			>
				{#each statusOrder as status}
					{@const IconStatus = getStatusIcon(status)}
					<Button
						onclick={() => selectedIssue && updateIssue({ ...selectedIssue, status })}
						variant="ghost"
						class="flex w-full justify-start"
						size="sm"
					>
						<IconStatus class="mr-2 size-4" />
						{status}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
	<div
		tabindex="0"
		role="button"
		aria-roledescription="extra actions for issue priority"
		class="relative"
		onmouseenter={handlePriorityMouseEnter}
		onmouseleave={handlePriorityMouseLeave}
	>
		<Button variant="ghost" size="sm" class="w-full justify-between">
			<span class="flex items-center">
				<Icon icon="solar:flag-bold" class="mr-2 size-5" />
				Change Priority
			</span>
			<Icon icon="lucide:chevron-right" class="size-4" />
		</Button>
		{#if showPrioritySubmenu}
			<div
				tabindex="0"
				role="button"
				aria-roledescription="select new priority"
				class="absolute left-full top-0 ml-1 w-40 rounded-md border border-border bg-card shadow-md"
				transition:fade={{ duration: 300 }}
				onmouseenter={() => handleSubmenuMouseEnter('priority')}
				onmouseleave={() => handleSubmenuMouseLeave('priority')}
			>
				{#each priorityOrder as priority}
					{@const IconPriority = getPriorityIcon(priority)}
					<Button
						onclick={() => selectedIssue && updateIssue({ ...selectedIssue, priority })}
						variant="ghost"
						class="flex w-full justify-start"
						size="sm"
					>
						<IconPriority class="mr-2 size-4" />
						{priority}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
	<Button
		variant="ghost"
		class="flex w-full justify-start transition-colors duration-100 ease-in hover:bg-destructive hover:text-destructive-foreground"
		onclick={handleDeleteClick}
		size="sm"
	>
		<Icon icon="solar:trash-bin-2-bold" class="mr-2 size-5" />
		Delete Issue
	</Button>
</ContextMenu>

{#if selectedIssue}
	<DeleteModal
		onConfirm={handleDeleteConfirm}
		bind:isOpen={showDeleteConfirmation}
		title={`Are you sure you want to delete the issue ${selectedIssue.custom_id}`}
		description="This action cannot be undone."
	/>
{/if}
