<script lang="ts">
	import type { Issue } from '$lib/types/issue.type';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { clickOutside, formatDateOrDefault, getContrastColor } from '$lib';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type Props = {
		issue: Issue | null;
		onClose: () => void;
	};

	let { issue, onClose }: Props = $props();
	let formattedDueDate = $derived(issue ? formatDateOrDefault(issue.dueDate) : '-');
</script>

{#if issue}
	<div
		use:clickOutside={onClose}
		class="fixed right-0 top-0 z-[10] h-full w-[40rem] overflow-y-auto border-l border-border bg-background shadow-lg"
		transition:fly={{ x: 400, duration: 300, easing: cubicOut }}
	>
		<div class="sticky top-0 border-b border-border bg-background p-3">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">{issue.title}</h2>
				<Button variant="ghost" size="icon" onclick={onClose}>
					<Icon icon="lucide:x" class="size-5" />
				</Button>
			</div>
		</div>
		<div class="space-y-4 p-4">
			<div>
				<p class="text-sm text-muted-foreground">ID</p>
				<p>{issue.custom_id}</p>
			</div>
			<div>
				<p class="text-sm text-muted-foreground">Status</p>
				<p>{issue.status}</p>
			</div>
			<div>
				<p class="text-sm text-muted-foreground">Priority</p>
				<p>{issue.priority}</p>
			</div>
			<div>
				<p class="text-sm text-muted-foreground">Due Date</p>
				<p>{formattedDueDate}</p>
			</div>
			{#if issue.tags && issue.tags.length > 0}
				<div>
					<p class="mb-1 text-sm text-muted-foreground">Tags</p>
					<div class="flex flex-wrap gap-1">
						{#each issue.tags as tag}
							<span
								class="rounded px-2 py-0.5 text-xs"
								style="background-color: {tag.color}; color: {getContrastColor(tag.color)};"
							>
								{tag.name}
							</span>
						{/each}
					</div>
				</div>
			{/if}
			{#if issue.description}
				<div>
					<p class="text-sm text-muted-foreground">Description</p>
					<p class="whitespace-pre-wrap">{issue.description}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
