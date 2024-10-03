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
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
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

	const { createProject, loadWorkspaceProjects } = useWorkspaceIssues(authToken, slug);
	let isCreateIssueModalOpen = $state(false);
	let createProjectOpen = $state(false);
	let workspace = $derived(findWorkspaceBySlug(slug!));

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

	$effect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.altKey && event.key === 'n') {
				event.preventDefault();
				isCreateIssueModalOpen = true;
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<aside
	transition:fade={{ duration: 300 }}
	class="hidden w-[260px] flex-col content-start justify-between border-r border-border px-6 py-4 md:flex"
>
	<div>
		<article>
			<div class="mb-2 mt-4 flex w-full items-center justify-between">
				<h2 class="text-xs font-bold text-muted-foreground">Workspaces</h2>
				<Button
					onclick={() => (createWorkspaceModalOpen = true)}
					variant="ghost"
					size="icon-xs"
					class="text-muted-foreground"
				>
					<Icon icon="lucide:plus" class=" size-3.5" />
				</Button>
			</div>
			<div class="space-y-1">
				{#if resp.workspaces}
					{#each resp.workspaces as { name, image, slug }}
						<a
							transition:slide|local={{ duration: 300, easing: cubicOut }}
							onclick={() => loadWorkspaceProjects(slug)}
							href={`/workspace/${slug}`}
							class={cn(
								buttonVariants({
									size: 'sm',
									variant: 'ghost'
								}),
								'flex w-full justify-start'
							)}
						>
							<img
								src={image || '/favicon.png'}
								alt={name}
								class="mr-4 size-6 rounded-full object-cover object-center"
								height="24"
								width="24"
							/>
							<span class="max-w-[8rem] truncate">{name}</span>
						</a>
					{/each}
				{/if}
			</div>
		</article>

		<article class="">
			<div class="mb-2 mt-4 flex w-full items-center justify-between">
				<h2 class="w-full text-xs font-bold text-muted-foreground">Workspace Projects</h2>
				<Button onclick={() => (createProjectOpen = true)} class="" variant="ghost" size="icon-xs">
					<Icon icon="lucide:plus" class="size-3.5" />
				</Button>
			</div>
			<div class="space-y-1">
				{#if $projectsStore}
					{#each $projectsStore as { name }}
						<Button class="w-full justify-start" size="sm" variant="ghost">
							<span class="max-w-[8rem] truncate">{name}</span>
						</Button>
					{/each}
				{/if}
			</div>
		</article>
	</div>

	<div class="mt-auto space-y-4">
		{#if slug && workspace}
			<Button
				class="w-full "
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
