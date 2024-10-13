<script lang="ts">
	import { cn, formatDateOrDefault, getContrastColor, isPastToday, monthAndDay } from '$lib';
	import type { Issue } from '$lib/types/issue.type';
	import type { Component } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { DeleteModal } from '$lib/components/ui/modal';
	import { Button } from '$lib/components/ui/button';
	import { ContextMenu } from '$lib/components/ui/context-menu';
	import { priorityOrder, statusOrder } from '$lib/store/workspace-issues.store';
	import { Icons } from '$lib/components/icons';

	type Props = {
		issue: Issue;
		IconPriority: Component;
		IconStatus: Component;
		slug: string;
		updateIssue: (issue: Issue) => Promise<void>;
		deleteIssue: (id: number) => Promise<void>;
	};

	type MenuType = 'status' | 'priority';

	const menuItems: Array<{ type: MenuType; icon: string; text: string; items: string[] }> = $state([
		{
			type: 'status',
			icon: 'solar:sort-from-top-to-bottom-bold',
			text: 'Change Status',
			items: statusOrder
		},
		{ type: 'priority', icon: 'solar:flag-bold', text: 'Change Priority', items: priorityOrder }
	]);

	let { issue, IconPriority, IconStatus, slug, deleteIssue, updateIssue }: Props = $props();
	let showContextMenu = $state(false);
	let showDeleteConfirmation = $state(false);
	let x = $state(0);
	let y = $state(0);
	let activeSubmenu = $state<MenuType | null>(null);
	let submenuTimeout = $state<number | null>(null);

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		showContextMenu = !showContextMenu;
		if (showContextMenu) {
			x = event.clientX;
			y = rect.top + rect.height;
		} else {
			x = 0;
			y = 0;
		}
	}

	function handleSubmenu(submenu: MenuType, isEnter: boolean) {
		if (submenuTimeout) clearTimeout(submenuTimeout);

		if (isEnter) {
			activeSubmenu = submenu;
		} else {
			submenuTimeout = setTimeout(() => {
				activeSubmenu = null;
			}, 300) as unknown as number;
		}
	}

	function closeContextMenu() {
		showContextMenu = false;
		x = 0;
		y = 0;
		activeSubmenu = null;
	}

	function getIcon(type: MenuType, item: string): Component {
		if (type === 'status') {
			return Icons.status[item as keyof typeof Icons.status];
		} else {
			return Icons.priority[item as keyof typeof Icons.priority];
		}
	}
</script>

<svelte:window onclick={closeContextMenu} onresize={closeContextMenu} />

<div
	tabindex="0"
	role="button"
	aria-roledescription="extra actions for issue"
	oncontextmenu={handleContextMenu}
	class="grid cursor-default grid-cols-[auto_auto_auto_1fr_auto] items-center gap-4 border-b border-border px-4 py-2 lg:px-8"
>
	<IconPriority class="size-5" />
	<p class="w-20 truncate text-xs text-muted-foreground">{issue.custom_id}</p>
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
	<a href={`/workspace/${slug}/issue/${issue.id}`} class="w-fit font-medium">{issue.title}</a>
	<div class="flex items-center gap-2">
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

<ContextMenu isOpen={showContextMenu} {x} class="min-w-[12rem] p-0" {y}>
	{#each menuItems as menu}
		<div
			tabindex="0"
			role="button"
			aria-roledescription="extra actions for issue {menu.type}"
			class="relative"
			onmouseenter={() => handleSubmenu(menu.type, true)}
			onmouseleave={() => handleSubmenu(menu.type, false)}
		>
			<Button variant="ghost" size="sm" class="w-full justify-between rounded-none">
				<span class="flex items-center">
					<Icon icon={menu.icon} class="mr-2 size-5" />
					{menu.text}
				</span>
				<Icon icon="lucide:chevron-right" class="size-4" />
			</Button>
			{#if activeSubmenu === menu.type}
				<div
					tabindex="0"
					role="button"
					aria-roledescription="select new {menu.type}"
					class="absolute left-full top-0 ml-1 w-40 rounded-md border border-border bg-card shadow-md"
					transition:fade={{ duration: 300 }}
					onmouseenter={() => handleSubmenu(menu.type, true)}
					onmouseleave={() => handleSubmenu(menu.type, false)}
				>
					{#each menu.items as item}
						{@const IconComponent = getIcon(menu.type, item)}
						<Button
							onclick={() => updateIssue({ ...issue, [menu.type]: item })}
							variant="ghost"
							class="flex w-full justify-start rounded-none first:rounded-t-md last:rounded-b-md"
							size="sm"
						>
							<IconComponent class="mr-2 size-4" />
							{item}
						</Button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
	<Button
		variant="ghost"
		class="flex w-full justify-start rounded-t-none transition-colors duration-100 ease-in hover:bg-destructive hover:text-destructive-foreground"
		onclick={() => (showDeleteConfirmation = true)}
		size="sm"
	>
		<Icon icon="solar:trash-bin-2-bold" class="mr-2 size-5" />
		Delete Issue
	</Button>
</ContextMenu>

<DeleteModal
	onConfirm={() => deleteIssue(issue.id)}
	bind:isOpen={showDeleteConfirmation}
	title={`Are you sure you want to delete the issue ${issue.custom_id}`}
	description="This action cannot be undone."
/>
