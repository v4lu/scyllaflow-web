<script lang="ts">
	import { monthAndDay } from '$lib';
	import { useWorkspace } from '$lib/api/use-workspace.svelte.js';
	import { Icons } from '$lib/components/icons/index.js';
	import { Button } from '$lib/components/ui/button';
	import {
		groupedIssuesStore,
		statusOrder,
		useWorkspaceIssues,
		type PriorityIconName,
		type StatusIconName
	} from '$lib/store/workspace-issues.store.js';

	export let data;
	const { resp } = useWorkspace(data.accessToken, data.workspace!);
	useWorkspaceIssues(data.accessToken, data.slug!);

	let isHorizontalView = false;

	$: sortedStatusKeys = statusOrder.filter((status) => $groupedIssuesStore[status]?.length > 0);
	$: issueCountsByStatus = Object.entries($groupedIssuesStore).reduce(
		(acc, [status, issues]) => {
			acc[status as StatusIconName] = issues.length;
			return acc;
		},
		{} as Record<StatusIconName, number>
	);

	function toggleView() {
		isHorizontalView = !isHorizontalView;
	}

	function getPriorityIcon(priority: PriorityIconName) {
		return Icons.priority[priority];
	}

	function getStatusIcon(status: StatusIconName) {
		return Icons.status[status];
	}
</script>

<main class="">
	<section class="h-fit w-full border-b border-border"></section>
	<section class="hi-ft w-full border-b border-border">
		<div class="flex justify-between px-4 py-2 lg:px-8">
			<h3 class="text-sm font-medium">Filter</h3>
			<h3 class="text-sm font-medium">Display</h3>
			<Button size="sm" onclick={toggleView}>
				{isHorizontalView ? 'Card View' : 'Table View'}
			</Button>
		</div>
	</section>
	{#if isHorizontalView}
		<div class="h-[calc(100dvh-116.8px)] w-[calc(100vw-260px)] overflow-hidden">
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
											<svelte:component this={getPriorityIcon(issue.priority)} class="size-4" />
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
		<div class="h-[calc(100dvh-116.8px)] overflow-hidden">
			<div class="h-full overflow-y-auto">
				{#each sortedStatusKeys as status}
					<section class="w-full">
						<div
							class="sticky top-0 z-10 flex h-fit w-full items-center justify-start gap-4 bg-accent px-4 py-2 lg:px-8"
						>
							<h2 class="text-xs font-medium">
								{status} ({issueCountsByStatus[status] || 0})
							</h2>
						</div>
						<div>
							{#each $groupedIssuesStore[status] || [] as issue}
								<a
									href="/"
									class="flex items-center justify-between border-b border-border px-4 py-2 lg:px-8"
								>
									<div class="flex items-center justify-center gap-5">
										<svelte:component this={getPriorityIcon(issue.priority)} class="size-4" />
										<p class="text-xs text-muted-foreground">{issue.custom_id}</p>
										<svelte:component this={getStatusIcon(issue.status)} class="size-4" />
										<p class="font-medium">{issue.title}</p>
									</div>
									<div>
										<p class="text-xs text-muted-foreground">
											{issue.dueDate ? monthAndDay(issue.dueDate) : '-'}
										</p>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</div>
	{/if}
</main>
