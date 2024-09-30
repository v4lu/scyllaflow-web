<script lang="ts">
	import { cn } from '$lib';
	import { useWorkspaces } from '$lib/api/use-workspaces.svelte';
	import Icon from '@iconify/svelte';
	import { CreateIssue } from '../forms';
	import { Button, buttonVariants } from '../ui/button';
	import { Dropdown } from '../ui/dropdown';

	type SidebarProps = {
		authToken: string;
		slug: string | undefined;
	};

	let { authToken, slug }: SidebarProps = $props();
	const { resp, findWorkspaceBySlug } = useWorkspaces(authToken);
	let isWorkspaceDropdownOpen = $state(false);
	let isCreateIssueModalOpen = $state(false);
	let workspace = $derived(findWorkspaceBySlug(slug!));
	let navigations = $state([
		{
			name: 'Notifications',
			link: '/notifications',
			icon: 'solar:bell-bold'
		}
	]);
</script>

<aside class="hidden w-[260px] content-start gap-4 border-r border-border px-6 py-6 md:grid">
	{#if resp.isLoading}
		<p>Loading..</p>
	{:else if resp.workspaces.length > 0}
		<Dropdown triggerText="Select Dropdown" isOpen={isWorkspaceDropdownOpen}>
			{#each resp.workspaces as { name, image }}
				<Button class="justify-start" size="sm" variant="ghost">
					<img
						src={image ? image : '/favicon.png'}
						alt={name}
						class="mr-4 size-6 rounded-full object-cover object-center"
						height="24"
						width="24"
					/>
					<span class="max-w-[8rem] truncate">{name}</span>
				</Button>
			{/each}
		</Dropdown>
		{#if slug && workspace}
			<Button
				onclick={() => {
					isCreateIssueModalOpen = true;
				}}>Create Issue</Button
			>
			<CreateIssue
				{authToken}
				{workspace}
				bind:isOpen={isCreateIssueModalOpen}
				onClose={() => (isCreateIssueModalOpen = false)}
			/>
		{/if}
	{/if}

	<section class="grid gap-1">
		{#each navigations as { icon, link, name }}
			<a
				href={link}
				class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex justify-start text-base')}
			>
				<Icon {icon} class="mr-2 size-5" />
				{name}
			</a>
		{/each}
	</section>
</aside>
