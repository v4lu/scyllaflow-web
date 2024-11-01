<script lang="ts">
	import type { Issue } from '$lib/types/issue.type';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import {
		cn,
		formatDateOrDefault,
		getContrastColor,
		monthAndDay,
		getStatusColor,
		getPriorityColor
	} from '$lib';
	import { Editor } from '$lib/components/ui/editor';
	import { useIssue } from '$lib/api/use-issue.svelte';
	import { Input, inputVariants } from '../ui/input';
	import {
		priorityOrder,
		statusOrder,
		useWorkspaceIssues
	} from '$lib/store/workspace-issues.store';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import { Icons } from '$lib/components/icons';
	import { DatePicker } from '$lib/components/ui/date-picker';
	import { Badge } from '../ui/badge';
	import { CreateSubIssue } from '../forms';
	import type { Workspace } from '$lib/types/workspace.type';
	import { SubIssuePanelCard, CommentPanel } from '.';

	type Props = {
		issue: Issue | null;
		onClose: () => void;
		authToken: string;
		slug: string;
		workspace: Workspace;
	};

	let { issue, onClose, authToken, slug, workspace }: Props = $props();
	const { resp, updateIssue, loadIssue, createSubIssue, loadComments, commentIssue } = useIssue(
		authToken,
		issue?.id,
		slug,
		false
	);
	const { updateLocalIssue } = useWorkspaceIssues(authToken, slug);

	let updateInterval: number;

	$effect(() => {
		if (issue) {
			loadIssue();
			loadComments();

			updateInterval = window.setInterval(async () => {
				if (resp.issue && !resp.isSubmittingUpdate) {
					const res = await updateIssue(resp.issue);
					if (res) {
						updateLocalIssue(res);
					}
				}
			}, 10000);
		}

		return () => {
			if (updateInterval) {
				clearInterval(updateInterval);
			}
		};
	});

	let statusDropdownOpen = $state(false);
	let priorityDropdownOpen = $state(false);
	let isDatePickerOpen = $state(false);
	let isSubIssueFormOpen = $state(false);
	let commentContent = $state('');

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

	function handleDateSelect(date: Date | null) {
		if (resp.issue && date) {
			resp.issue.dueDate = date.toISOString();
			isDatePickerOpen = false;
		}
	}

	async function handleSubmitComment() {
		if (!commentContent.trim()) return;

		await commentIssue(commentContent);
		commentContent = '';
	}
</script>

{#if issue}
	<div class="overflow-y-auto">
		<div
			class="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center justify-center gap-4">
					<Badge>
						{resp.issue?.custom_id}
					</Badge>
					<h2 class="text-xl font-semibold tracking-tight">
						{resp.issue ? 'Edit Issue' : 'Loading Issue...'}
					</h2>
				</div>
				<Button variant="ghost" size="icon" onclick={onClose} class="hover:bg-muted">
					<Icon icon="lucide:x" class="size-5" />
				</Button>
			</div>
		</div>

		{#if !resp.issue || resp.isLoading}
			<div class="flex h-[90dvh] flex-1 items-center justify-center">
				<Icon icon="line-md:loading-twotone-loop" class="size-12 animate-spin text-primary" />
			</div>
		{:else}
			<div class="flex-1">
				<div class="space-y-8 p-6">
					<div class="space-y-2">
						<p class="text-sm font-medium text-muted-foreground">Title</p>
						<Input
							oninput={handleTitleChange}
							variant="empty"
							value={resp.issue.title}
							class="border-0 bg-transparent px-0 text-xl font-medium focus-visible:ring-0"
						/>
					</div>

					{#if resp.issue.dueDate}
						<div class="space-y-2">
							<p class="text-sm font-medium text-muted-foreground">Due Date</p>
							<Dropdown
								triggerIconPosition="left"
								triggerIcon="solar:calendar-outline"
								triggerIconClass="mr-2"
								triggerClass="w-full justify-between px-3 py-2 text-sm border rounded-md hover:bg-muted"
								triggerText={monthAndDay(resp.issue.dueDate) === '-'
									? ''
									: monthAndDay(resp.issue.dueDate)}
								bind:isOpen={isDatePickerOpen}
								class="w-full min-w-[20rem]"
							>
								<DatePicker selected={new Date(resp.issue.dueDate)} selectDate={handleDateSelect} />
							</Dropdown>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<p class="text-sm font-medium text-muted-foreground">Status</p>
							<Dropdown
								bind:isOpen={statusDropdownOpen}
								triggerText={resp.issue.status}
								downArrowIcon
								CustomIcon={Icons.status[resp.issue.status]}
								customIconClass={cn(getStatusColor(resp.issue.status), 'size-4')}
								triggerIconPosition="left"
								triggerClass="w-full justify-between px-3 py-2 text-sm border rounded-md hover:bg-muted"
							>
								<div class="p-1">
									{#each statusOrder as status}
										{@const Icon = Icons.status[status]}
										<button
											class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
											onclick={() => selectStatus(status)}
										>
											<Icon class={cn('size-4', getStatusColor(status))} />
											<span>{status}</span>
										</button>
									{/each}
								</div>
							</Dropdown>
						</div>

						<div class="space-y-2">
							<p class="text-sm font-medium text-muted-foreground">Priority</p>
							<Dropdown
								bind:isOpen={priorityDropdownOpen}
								triggerText={resp.issue.priority}
								downArrowIcon
								CustomIcon={Icons.priority[resp.issue.priority]}
								customIconClass={cn(getPriorityColor(resp.issue.priority), 'size-4')}
								triggerIconPosition="left"
								triggerClass="w-full justify-between px-3 py-2 text-sm border rounded-md hover:bg-muted"
							>
								<div class="p-1">
									{#each priorityOrder as priority}
										{@const Icon = Icons.priority[priority]}
										<button
											class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
											onclick={() => selectPriority(priority)}
										>
											<Icon class={cn('size-4', getPriorityColor(priority))} />
											<span>{priority}</span>
										</button>
									{/each}
								</div>
							</Dropdown>
						</div>
					</div>

					{#if resp.issue.tags && resp.issue.tags.length > 0}
						<div class="space-y-2">
							<p class="text-sm font-medium text-muted-foreground">Tags</p>
							<div class="flex flex-wrap gap-1.5">
								{#each resp.issue.tags as tag}
									<span
										class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
										style="background-color: {tag.color}; color: {getContrastColor(tag.color)};"
									>
										{tag.name}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<div class="space-y-2">
						<p class="text-sm font-medium text-muted-foreground">Description</p>
						<Editor
							content={parseDescription(resp.issue.description)}
							update={handleDescriptionUpdate}
							placeholder="Add a description..."
						/>
					</div>
				</div>
			</div>
			<div class="border-t border-border">
				<div class="space-y-8 p-6">
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<h3 class="text-sm font-medium text-muted-foreground">Subtasks</h3>
							<Button
								onclick={() => (isSubIssueFormOpen = true)}
								variant="outline"
								size="sm"
								class="h-8"
							>
								<Icon icon="lucide:plus" class="mr-2 size-4" />
								Add Subtask
							</Button>
						</div>
						<div class="space-y-3">
							{#if resp.subIssues && resp.subIssues.length > 0}
								{#each resp.subIssues as subIssue}
									{@const Icon = Icons.status[subIssue.status]}
									<SubIssuePanelCard {Icon} {subIssue} />
								{/each}
							{:else}
								<p class="text-sm text-muted-foreground">No subtasks yet.</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4 px-6 py-4 pb-8">
				<h3 class="text-sm font-medium text-muted-foreground">Comments</h3>

				<div class="space-y-4">
					{#each resp.comments as comment}
						<CommentPanel {comment} />
					{/each}
				</div>

				<div class="space-y-3 rounded-lg border border-border bg-card p-3 shadow-lg">
					<div class="flex gap-3">
						<div class="flex size-8 items-center justify-center rounded-full bg-primary/10">
							<Icon icon="lucide:user" class="size-4 text-primary" />
						</div>
						<textarea
							rows="3"
							bind:value={commentContent}
							placeholder="Write a comment..."
							class={cn(
								inputVariants({ variant: 'empty' }),
								'flex-1  resize-none border-0 bg-transparent focus:ring-0'
							)}
						></textarea>
					</div>
					<div class="flex justify-end">
						<Button
							onclick={handleSubmitComment}
							disabled={!commentContent.trim() || resp.isCreatingComment}
							isLoading={resp.isCreatingComment}
							size="sm"
						>
							<Icon icon="lucide:send" class="mr-2 size-4" />
							Send
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<CreateSubIssue
	isCreatingIssue={resp.isCreatingSubIssue}
	{workspace}
	bind:isOpen={isSubIssueFormOpen}
	{authToken}
	createIssue={createSubIssue}
	onClose={() => (isSubIssueFormOpen = false)}
/>
