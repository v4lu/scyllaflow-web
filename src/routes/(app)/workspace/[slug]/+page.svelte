<script lang="ts">
	import { getContrastColor } from '$lib';
	import {
		IssueColumnContainer,
		IssueHorizontalCOntainer,
		IssuePanel
	} from '$lib/components/issue/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import { RightPanelWrapper } from '$lib/components/ui/panel';
	import {
		type StatusIconName,
		getIcon,
		groupedIssuesStore,
		issuesStore,
		projectsStore,
		statusOrder,
		tagsStore,
		useWorkspaceIssues
	} from '$lib/store/workspace-issues.store';
	import { type Issue, type Project, type Tag } from '$lib/types/issue.type';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const {
		deleteIssue,
		updateIssue,
		getByTag,
		loadWorkspaceTags,
		loadWorkspaceIssues,
		getByProject
	} = useWorkspaceIssues(data.accessToken, data.slug!);

	let isHorizontalView = $state(false);
	let filterDropdownOpen = $state(false);
	let activeSubmenu = $state<'tag' | 'project' | null>(null);
	let submenuTimeout = $state<number | null>(null);
	let selectedIssue = $state<Issue | null>(null);
	let draggedIssue = $state<Issue | null>(null);
	let dragOverStatus = $state<StatusIconName | null>(null);
	let originalStatus = $state<StatusIconName | null>(null);

	let sortedStatusKeys = $derived(
		$groupedIssuesStore
			? statusOrder.filter((status) => $groupedIssuesStore[status]?.length > 0)
			: []
	);

	function toggleView() {
		isHorizontalView = !isHorizontalView;
	}

	function handleSubmenuInteraction(submenu: 'tag' | 'project', isEnter: boolean) {
		if (submenuTimeout) clearTimeout(submenuTimeout);

		if (isEnter) {
			activeSubmenu = submenu;
		} else {
			submenuTimeout = setTimeout(() => {
				activeSubmenu = null;
			}, 300) as unknown as number;
		}
	}

	async function selectFilter(type: 'tag' | 'project', item: Tag | Project | null) {
		filterDropdownOpen = false;
		activeSubmenu = null;

		if (item) {
			await (type === 'tag' ? getByTag(item.id) : getByProject(item.id));
		} else {
			await loadWorkspaceIssues();
			if (type === 'tag') await loadWorkspaceTags();
		}
	}

	function handleDragStart(e: DragEvent, issue: Issue) {
		draggedIssue = issue;
		originalStatus = issue.status as StatusIconName;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', issue.id.toString());
		}
		document.body.classList.add('dragging');
	}

	function handleDragOver(e: DragEvent, status: StatusIconName) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverStatus = status;
	}

	function handleDragEnd(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (draggedIssue && originalStatus !== null) {
			const newStatus = dragOverStatus || originalStatus;
			// Only update if the status has changed
			if (newStatus !== originalStatus) {
				const updatedIssue = { ...draggedIssue, status: newStatus };
				updateIssue(updatedIssue);
				issuesStore.update((issues) => {
					if (!issues) return null;
					return issues.map((issue) =>
						draggedIssue ? (issue.id === draggedIssue.id ? updatedIssue : issue) : issue
					);
				});
			}
		}
		draggedIssue = null;
		dragOverStatus = null;
		originalStatus = null;
		document.body.classList.remove('dragging');
	}
</script>

<main>
	<section class="h-fit w-full border-b border-border">
		<div class="flex items-center justify-between px-4 py-2 lg:pr-8">
			<Dropdown bind:isOpen={filterDropdownOpen} downArrowIcon triggerText="Filter">
				{#each [{ type: 'tag' as const, icon: 'lucide:tag', text: 'By Tag', items: $tagsStore }, { type: 'project' as const, icon: 'lucide:folder', text: 'By Project', items: $projectsStore }] as menu}
					<div
						tabindex="0"
						role="button"
						class="relative"
						onmouseenter={() => handleSubmenuInteraction(menu.type, true)}
						onmouseleave={() => handleSubmenuInteraction(menu.type, false)}
					>
						<Button variant="ghost" size="sm" class="w-full justify-between">
							<span class="flex items-center">
								<Icon icon={menu.icon} class="mr-2 size-4" />
								{menu.text}
							</span>
							<Icon icon="lucide:chevron-right" class="size-4" />
						</Button>
						{#if activeSubmenu === menu.type}
							<div
								role="article"
								class="absolute left-full top-0 ml-1 w-40 rounded-md border border-border bg-card shadow-md"
								transition:fade={{ duration: 300 }}
								onmouseenter={() => handleSubmenuInteraction(menu.type, true)}
								onmouseleave={() => handleSubmenuInteraction(menu.type, false)}
							>
								<Button
									variant="ghost"
									size="sm"
									class="flex w-full justify-start"
									onclick={() => selectFilter(menu.type, null)}
								>
									All {menu.type === 'tag' ? 'Tags' : 'Projects'}
								</Button>
								{#each menu.items || [] as item}
									<Button
										variant="ghost"
										size="sm"
										class="flex w-full items-center justify-start"
										onclick={() => selectFilter(menu.type, item)}
									>
										{#if menu.type === 'tag'}
											<span
												class="w-full rounded px-1 py-0.5 text-xs"
												style="background-color: {item.color}; color: {item.color &&
													getContrastColor(item.color)};"
											>
												{item.name}
											</span>
										{:else}
											<span
												class="mr-2 inline-block h-3 w-3 rounded-full"
												style="background-color: {item.color || '#000000'};"
											></span>
											<span class="truncate">{item.name}</span>
										{/if}
									</Button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</Dropdown>
			<h3 class="text-sm font-medium">Display</h3>
			<button onclick={toggleView}>
				{isHorizontalView ? 'Card View' : 'Table View'}
			</button>
		</div>
	</section>

	{#if $groupedIssuesStore === null}
		<div class="flex h-[calc(100dvh-120px)] items-center justify-center">
			<p class="text-lg text-muted-foreground">No issues available.</p>
		</div>
	{:else if isHorizontalView}
		<div class="h-[calc(100dvh-120px)] w-[calc(100vw-260px)] overflow-x-auto overflow-y-auto">
			<div class="flex h-full">
				{#each sortedStatusKeys as status}
					{@const IconStatus = getIcon('status', status as StatusIconName)}
					<IssueHorizontalCOntainer
						{IconStatus}
						{status}
						{draggedIssue}
						{handleDragEnd}
						{handleDragStart}
						{handleDragOver}
						issuesCount={0}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<div class="h-[calc(100dvh-120px)] overflow-y-auto">
			{#each sortedStatusKeys as status}
				{@const IconStatus = getIcon('status', status as StatusIconName)}
				<IssueColumnContainer
					{IconStatus}
					{status}
					{deleteIssue}
					slug={data.slug ?? ''}
					{updateIssue}
					onSelect={(issue: Issue) => (selectedIssue = issue)}
					{draggedIssue}
					{handleDragEnd}
					{handleDragStart}
					{handleDragOver}
					issuesCount={0}
				/>
			{/each}
		</div>
	{/if}
</main>

<RightPanelWrapper
	isOpen={!!selectedIssue}
	onClose={() => {
		if (selectedIssue) {
			selectedIssue = null;
		}
	}}
>
	{#if data.slug && selectedIssue && data.workspace}
		<IssuePanel
			workspace={data.workspace}
			authToken={data.accessToken}
			issue={selectedIssue}
			onClose={() => (selectedIssue = null)}
			slug={data.slug}
		/>
	{/if}
</RightPanelWrapper>
