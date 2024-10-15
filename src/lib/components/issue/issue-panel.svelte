<script lang="ts">
	import type { Issue } from '$lib/types/issue.type';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { clickOutside, formatDateOrDefault, getContrastColor } from '$lib';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Editor } from '$lib/components/ui/editor';
	import { useIssue } from '$lib/api/use-issue.svelte';
	import { Input } from '../ui/input';
	import { useWorkspaceIssues } from '$lib/store/workspace-issues.store';

	type Props = {
		issue: Issue | null;
		onClose: () => void;
		authToken: string;
		slug: string;
	};

	let { issue = $bindable(), onClose, authToken, slug }: Props = $props();
	const { resp, updateIssue, loadIssue } = useIssue(authToken, issue?.id, slug, false);
	const { updateLocalIssue } = useWorkspaceIssues(authToken, slug);

	$effect(() => {
		if (issue) {
			loadIssue();
		}
	});

	let formattedDueDate = $derived(resp.issue ? formatDateOrDefault(resp.issue.dueDate) : '-');

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
</script>

{#if issue}
	<div
		use:clickOutside={onClose}
		class="fixed right-0 top-0 z-[10] h-full w-[40rem] overflow-y-auto border-l border-border bg-background shadow-lg"
		transition:fly={{ x: 400, duration: 300, easing: cubicOut }}
	>
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
			<div class="space-y-4 p-4">
				<div>
					<p class="mb-1 text-sm text-muted-foreground">Title</p>
					<Input
						oninput={handleTitleChange}
						variant="empty"
						value={resp.issue.title}
						class="text-xl font-medium"
					/>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">ID</p>
					<p>{resp.issue.custom_id}</p>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Status</p>
					<p>{resp.issue.status}</p>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Priority</p>
					<p>{resp.issue.priority}</p>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Due Date</p>
					<p>{formattedDueDate}</p>
				</div>
				{#if resp.issue.tags && resp.issue.tags.length > 0}
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Tags</p>
						<div class="flex flex-wrap gap-1">
							{#each resp.issue.tags as tag}
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
				<div>
					<p class="mb-2 text-sm text-muted-foreground">Description</p>
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
				>
					Update Issue
				</Button>
			</div>
		{/if}
	</div>
{/if}
