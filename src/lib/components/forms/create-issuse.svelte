<script lang="ts">
	import type { Workspace } from '$lib/types/workspace.type';
	import Icon from '@iconify/svelte';
	import { priorityArr, statusArr, type PriorityArrType, type StatusArrType } from '.';
	import { Button } from '../ui/button';
	import { Dropdown } from '../ui/dropdown';
	import { Input } from '../ui/input';
	import { Modal } from '../ui/modal';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
		workspace: Workspace;
	};

	let { isOpen, onClose, workspace }: Props = $props();

	let isPriorityDropdownOpen = $state(false);
	let selectedPriority = $state<PriorityArrType>(priorityArr[0]);
	let isStatusDropdownOpen = $state(false);
	let selectedStatus = $state<StatusArrType>(statusArr[0]);
</script>

<Modal class="grid gap-2 p-0 md:min-w-[40rem]" {isOpen} {onClose}>
	<article class="flex w-full items-center justify-between px-6 pt-6">
		<div class="flex items-center justify-center gap-2">
			<span class="rounded-md border border-border bg-accent px-1 py-0.5 text-xs">
				{workspace.customId}
			</span>
			<span class="text-xs font-bold"> Create Issue </span>
		</div>
	</article>
	<article class="my-4 px-6">
		<Input variant="empty" placeholder="What should be done" class="text-xl" />
	</article>
	<article class="flex items-center justify-start gap-2 px-6">
		<Dropdown
			triggerClass="px-2 py-1 gap-0 w-fit min-w-fit text-xs font-medium"
			triggerText={selectedPriority.IconName}
			bind:isOpen={isPriorityDropdownOpen}
			CustomIcon={selectedPriority.Icon}
			customIconClass="size-4 mr-1"
			class="top-[2rem] w-fit min-w-fit"
		>
			{#each priorityArr as priority}
				<Button
					variant="ghost"
					size="sm"
					class="flex w-full justify-start px-4 py-0 text-xs font-medium"
					onclick={() => {
						selectedPriority = priority;
						isPriorityDropdownOpen = false;
					}}
				>
					<priority.Icon class="mr-2 size-4" />
					{priority.IconName}
				</Button>
			{/each}
		</Dropdown>
		<Dropdown
			triggerClass="px-2 py-1 gap-0 w-fit min-w-fit text-xs font-medium"
			triggerText={selectedStatus.IconName}
			bind:isOpen={isStatusDropdownOpen}
			CustomIcon={selectedStatus.Icon}
			customIconClass="size-4 mr-1"
			class="top-[2rem] w-fit min-w-fit"
		>
			{#each statusArr as status}
				<Button
					variant="ghost"
					size="sm"
					class="flex w-full justify-start px-4 py-0 text-xs font-medium"
					onclick={() => {
						selectedStatus = status;
						isPriorityDropdownOpen = false;
					}}
				>
					<status.Icon class="mr-2 size-4" />
					{status.IconName}
				</Button>
			{/each}
		</Dropdown>
		<Button size="icon" variant="ghost">
			<Icon icon="lucide:paperclip" class="size-4" />
		</Button>
	</article>
	<article class="flex items-center justify-between border-t border-border px-6 py-3">
		<Button size="icon" variant="ghost">
			<Icon icon="lucide:paperclip" class="size-5" />
		</Button>
		<Button size="sm">Create Issue</Button>
	</article>
</Modal>
