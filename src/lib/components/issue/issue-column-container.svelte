<script lang="ts">
	import { cn } from '$lib';
	import type { Issue } from '$lib/types/issue.type';
	import type { Component } from 'svelte';
	import { IssueRowCard } from '.';
	import { groupedIssuesStore } from '$lib/store/workspace-issues.store';
	import type { PriorityIconName, StatusIconName } from '../forms';
	import { Icons } from '../icons';

	type Props = {
		IconStatus: Component;

		slug: string;
		updateIssue: (issue: Issue) => Promise<void>;
		deleteIssue: (id: number) => Promise<void>;
		onSelect: (issue: Issue) => void;
		handleDragStart: (e: DragEvent, issue: Issue) => void;
		handleDragEnd: (e: DragEvent) => void;
		handleDragOver: (e: DragEvent, status: StatusIconName) => void;
		draggedIssue: Issue | null;
		status: StatusIconName;
		issuesCount: number;
	};
	let {
		IconStatus,
		deleteIssue,
		draggedIssue,
		handleDragEnd,
		handleDragOver,
		handleDragStart,
		status,
		issuesCount,
		onSelect,
		slug,
		updateIssue
	}: Props = $props();

	function getIcon<T extends 'priority' | 'status'>(
		type: T,
		name: T extends 'priority' ? PriorityIconName : StatusIconName
	): (typeof Icons)[T][keyof (typeof Icons)[T]] {
		return Icons[type][name as keyof (typeof Icons)[T]];
	}
</script>

{#if $groupedIssuesStore}
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
					status === 'Todo' && 'text-blue-600 dark:text-blue-400',
					status === 'Backlog' && 'text-purple-600 dark:text-purple-400'
				)}
			/>
			<h2 class="text-xs font-medium">
				{status} ({issuesCount})
			</h2>
		</div>
		<div
			role="article"
			ondragover={(e) => handleDragOver(e, status)}
			ondrop={(e) => handleDragEnd(e)}
		>
			{#each $groupedIssuesStore[status] || [] as issue}
				<IssueRowCard
					IconPriority={getIcon('priority', issue.priority)}
					IconStatus={getIcon('status', issue.status)}
					{issue}
					slug={slug ?? ''}
					{deleteIssue}
					{updateIssue}
					{onSelect}
					{draggedIssue}
					{handleDragEnd}
					{handleDragStart}
				/>
			{/each}
		</div>
	</section>
{/if}
