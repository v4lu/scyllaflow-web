<script lang="ts">
	import { useWorkspaces } from '$lib/api/use-workspaces.svelte';
	import { Button } from '../ui/button';
	import { Dropdown } from '../ui/dropdown';

	type SidebarProps = {
		authToken: string;
	};

	let { authToken }: SidebarProps = $props();
	const { resp } = useWorkspaces(authToken);
	let isWorkspaceDropdownOpen = $state(false);
</script>

<aside
	class="hidden w-[260px] content-start gap-4 border-r border-border px-6 py-6 shadow-md md:grid"
>
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
	{/if}
</aside>
