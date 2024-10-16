<script lang="ts">
	import { cn } from '$lib';
	import { getIcon, groupedIssuesStore } from '$lib/store/workspace-issues.store';
	import type { Component } from 'svelte';
	import { IssueHorizontalCard } from '.';
	import type { StatusIconName } from '../forms';
	import type { Issue } from '$lib/types/issue.type';

	type Props = {
		handleDragEnd: (e: DragEvent) => void;
		handleDragOver: (e: DragEvent, status: StatusIconName) => void;
		IconStatus: Component;
		issuesCount: 0;
		status: StatusIconName;
		handleDragStart: (e: DragEvent, issue: Issue) => void;
		draggedIssue: Issue | null;
	};

	let {
		handleDragEnd,
		handleDragOver,
		draggedIssue,
		handleDragStart,
		status,
		IconStatus,
		issuesCount
	}: Props = $props();
</script>

{#if $groupedIssuesStore}
	<div class="w-80 flex-shrink-0 p-4">
		<IconStatus
			class={cn(
				'size-5',
				status === 'InProgress' && 'text-yellow-500 dark:text-yellow-400',
				status === 'Blocked' && 'text-destructive',
				status === 'Cancelled' && 'text-destructive',
				status === 'Done' && 'text-emerald-600 dark:text-emerald-400',
				status === 'Todo' && 'text-blue-600 dark:text-blue-400',
				status === 'Backlog' && 'text-purple-600 dark:text-purple-400'
			)}
		/>
		<h2 class="sticky top-0 z-10 mb-2 bg-background py-2 text-sm font-medium">
			{status} ({issuesCount})
		</h2>
		<div
			role="article"
			ondragover={(e) => handleDragOver(e, status)}
			ondrop={(e) => handleDragEnd(e)}
		>
			{#each $groupedIssuesStore[status] || [] as issue (issue.id)}
				<IssueHorizontalCard
					IconPriority={getIcon('priority', issue.priority)}
					IconStatus={getIcon('status', issue.status)}
					{issue}
					{draggedIssue}
					{handleDragEnd}
					{handleDragStart}
				/>
			{/each}
		</div>
	</div>
{/if}
