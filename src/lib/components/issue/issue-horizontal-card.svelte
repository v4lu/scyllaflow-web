<script lang="ts">
	import { cn, formatDateOrDefault, getContrastColor, isPastToday, monthAndDay } from '$lib';
	import type { Issue } from '$lib/types/issue.type';
	import type { Component } from 'svelte';

	type Props = {
		issue: Issue;
		handleDragStart: (e: DragEvent, issue: Issue) => void;
		draggedIssue: Issue | null;
		handleDragEnd: (e: DragEvent) => void;
		IconStatus: Component;
		IconPriority: Component;
	};

	let { issue, handleDragStart, IconPriority, IconStatus, draggedIssue, handleDragEnd }: Props =
		$props();

	function getStatusColor(status: string): string {
		switch (status) {
			case 'InProgress':
				return 'text-yellow-500 dark:text-yellow-400';
			case 'Blocked':
			case 'Cancelled':
				return 'text-destructive';
			case 'Done':
				return 'text-emerald-600 dark:text-emerald-400';
			case 'Backlog':
				return 'text-purple-600 dark:text-purple-400';
			default:
				return 'text-blue-500 dark:text-blue-400';
		}
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'Urgent':
				return 'text-red-500 dark:text-red-400';
			case 'High':
				return 'text-orange-500 dark:text-orange-400';
			case 'Medium':
				return 'text-yellow-500 dark:text-yellow-400';
			case 'Low':
				return 'text-green-500 dark:text-green-400';
			default:
				return 'text-blue-500 dark:text-blue-400';
		}
	}
</script>

<div
	role="article"
	draggable="true"
	ondragstart={(e) => handleDragStart(e, issue)}
	ondragend={(e) => handleDragEnd(e)}
	class="mb-2 cursor-move rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 ease-in-out"
	class:opacity-50={draggedIssue?.id === issue.id}
>
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<IconPriority class={cn('size-4', getPriorityColor(issue.priority))} />
			<p class="text-xs text-muted-foreground">{issue.custom_id}</p>
		</div>
		<IconStatus class={cn('size-4', getStatusColor(issue.status))} />
	</div>
	<p class="mb-2 font-medium">{issue.title}</p>
	<div class="flex items-center justify-between">
		{#if issue.tags && issue.tags.length > 0}
			<div class="flex gap-1">
				{#each issue.tags as tag}
					<span
						class="flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-medium"
						style="background-color: {tag.color}; color: {getContrastColor(tag.color)};"
					>
						{tag.name}
					</span>
				{/each}
			</div>
		{/if}
		{#if issue.dueDate && formatDateOrDefault(issue.dueDate) !== '-'}
			<p
				class={cn(
					'text-xs font-semibold text-muted-foreground',
					formatDateOrDefault(issue.dueDate) !== '-' &&
						isPastToday(issue.dueDate) &&
						'text-destructive'
				)}
			>
				{monthAndDay(issue.dueDate)}
			</p>
		{/if}
	</div>
</div>
