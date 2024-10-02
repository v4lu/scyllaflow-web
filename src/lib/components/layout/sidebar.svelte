<script lang="ts">
	import { cn } from '$lib';
	import { useWorkspaces } from '$lib/api/use-workspaces.svelte';
	import {
		isSubmittingCreateProjectStore,
		projectsStore,
		useWorkspaceIssues
	} from '$lib/store/workspace-issues.store';
	import type { CreateProject } from '$lib/types/issue.type';
	import Icon from '@iconify/svelte';
	import { mode, setMode } from 'mode-watcher';
	import { CreateIssue, CreateWorkspace } from '../forms';
	import { Button, buttonVariants } from '../ui/button';
	import { Field } from '../ui/field';
	import { Input } from '../ui/input';
	import { Modal } from '../ui/modal';

	type SidebarProps = {
		authToken: string;
		slug: string | undefined;
	};

	let { authToken, slug }: SidebarProps = $props();
	const { resp, findWorkspaceBySlug, createWorkspace } = useWorkspaces(authToken);

	const { createProject } = useWorkspaceIssues(authToken, slug);
	let isCreateIssueModalOpen = $state(false);
	let createProjectOpen = $state(false);
	let workspace = $derived(findWorkspaceBySlug(slug!));
	let navigations = $state([
		{
			name: 'Notifications',
			link: '/notifications',
			icon: 'solar:bell-bold'
		}
	]);
	let createWorkspaceModalOpen = $state(false);
	let name = $state('');

	async function handleCreateProject() {
		const payload: CreateProject = {
			name
		};
		await createProject(payload);
		name = '';
		createProjectOpen = false;
	}
</script>

<aside
	class="hidden w-[260px] flex-col content-start justify-between border-r border-border px-6 py-6 md:flex"
>
	<div>
		<h2 class="mb-2 text-sm font-bold">Workspaces</h2>
		{#if resp.isLoading}
			<p>Loading..</p>
		{:else if resp.workspaces}
			<div class="space-y-1">
				{#each resp.workspaces as { name, image }}
					<Button class="w-full justify-start" size="sm" variant="ghost">
						<img
							src={image || '/favicon.png'}
							alt={name}
							class="mr-4 size-6 rounded-full object-cover object-center"
							height="24"
							width="24"
						/>
						<span class="max-w-[8rem] truncate">{name}</span>
					</Button>
				{/each}
				<Button
					onclick={() => (createWorkspaceModalOpen = true)}
					variant="ghost"
					size="sm"
					class="w-full"
				>
					Create workspace
					<Icon icon="lucide:plus" class="ml-2 size-4" />
				</Button>
			</div>
		{/if}

		<h2 class="mb-2 mt-2 text-sm font-bold">Projects</h2>
		<div class="space-y-1">
			{#if resp.isLoading}
				<p>Loading..</p>
			{:else if $projectsStore}
				{#each $projectsStore as { name }}
					<Button class="w-full justify-start" size="sm" variant="ghost">
						<span class="max-w-[8rem] truncate">{name}</span>
					</Button>
				{/each}
			{/if}
			<Button onclick={() => (createProjectOpen = true)} variant="ghost" size="sm" class="w-full">
				Create project
				<Icon icon="lucide:plus" class="ml-2 size-4" />
			</Button>
		</div>

		<nav class="mt-2">
			<h2 class="mb-2 text-sm font-bold">Navigation</h2>
			<div class="space-y-1">
				{#each navigations as { icon, link, name }}
					<a
						href={link}
						class={cn(
							buttonVariants({ variant: 'ghost', size: 'sm' }),
							'flex w-full justify-start text-base'
						)}
					>
						<Icon {icon} class="mr-2 size-5" />
						{name}
					</a>
				{/each}
			</div>
		</nav>
	</div>

	<div class="mt-auto space-y-4">
		{#if slug && workspace}
			<Button
				class="w-full"
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
		<Button
			onclick={() => setMode($mode === 'light' ? 'dark' : 'light')}
			variant="outline"
			class="w-full justify-between"
		>
			<span>Theme</span>
			<Icon icon={$mode === 'light' ? 'lucide:sun' : 'lucide:moon'} class="size-5" />
		</Button>
	</div>
</aside>

<CreateWorkspace
	bind:isOpen={createWorkspaceModalOpen}
	{authToken}
	createWorkspaceParent={createWorkspace}
/>

<Modal
	bind:isOpen={createProjectOpen}
	onClose={() => (createProjectOpen = false)}
	class="md:w-[35rem]"
>
	<div class="mt-3 grid flex-col gap-3 p-8 pt-3">
		<Field name="Name">
			<Input type="text" bind:value={name} placeholder="Scyllaflow" />
		</Field>
		<div class="flex justify-end">
			<Button
				onclick={handleCreateProject}
				disabled={$isSubmittingCreateProjectStore}
				isLoading={$isSubmittingCreateProjectStore}
				class="w-fit"
			>
				Create
			</Button>
		</div>
	</div>
</Modal>
