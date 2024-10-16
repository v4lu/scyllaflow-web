<script lang="ts">
	import { useRequest } from '$lib/api/use-requests.svelte';
	import { useWorkspace } from '$lib/api/use-workspace.svelte.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Modal } from '$lib/components/ui/modal';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { MemberSmCard } from '$lib/components/home';
	import Icon from '@iconify/svelte';
	import { Field } from '$lib/components/ui/field';

	let { data } = $props();
	let username = $state('');
	let isOpen = $state(false);
	const { inviteUser, resp: inviteResp } = useRequest(data.accessToken);
	const { resp: workspaceResp } = useWorkspace(data.accessToken, data.workspace!);
</script>

<main
	class="grid h-[calc(100dvh-120px)] w-full grid-cols-1 gap-4 overflow-hidden p-6 md:grid-cols-3"
>
	<div class="flex h-40 items-center justify-center rounded-lg bg-blue-200 p-4 md:col-span-2">
		2/3
	</div>
	<article class="h-96 overflow-hidden rounded-lg border border-border bg-card shadow-md">
		<div class="flex items-center justify-between border-b border-border p-4">
			<h2 class="text-xl font-semibold">Members</h2>
			<Button onclick={() => (isOpen = true)} variant="outline" size="sm">
				<Icon icon="mdi:account-plus" class="mr-2 h-4 w-4" />
				Add Member
			</Button>
		</div>
		<div class="h-[calc(100%-4rem)] space-y-4 overflow-y-auto p-4">
			{#if workspaceResp.isLoadingUsers}
				{#each Array(8) as _}
					<div
						class="flex items-center gap-4 rounded-md border border-border bg-background p-4 shadow-sm"
					>
						<Skeleton class="size-12 rounded-full" />
						<div class="flex flex-col gap-2">
							<Skeleton class="h-6 w-32" />
							<Skeleton class="h-5 w-20" />
						</div>
					</div>
				{/each}
			{:else if workspaceResp.workspaceUsers}
				{#each workspaceResp.workspaceUsers as user}
					<MemberSmCard {user} />
				{/each}
			{/if}
		</div>
	</article>
	<div class="flex h-40 items-center justify-center rounded-lg bg-red-200 p-4 md:col-span-1">
		1/3
	</div>
	<div class="flex h-40 items-center justify-center rounded-lg bg-yellow-200 p-4 md:col-span-1">
		1/3
	</div>
	<div class="flex h-40 items-center justify-center rounded-lg bg-purple-200 p-4 md:col-span-1">
		1/3
	</div>
	<div class="flex h-40 items-center justify-center rounded-lg bg-pink-200 p-4 md:col-span-2">
		2/3
	</div>
	<div class="flex h-40 items-center justify-center rounded-lg bg-indigo-200 p-4">1/3</div>
</main>

<Modal bind:isOpen class="w-full max-w-xl" onClose={() => (isOpen = false)}>
	<div class="grid gap-6 p-6">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold tracking-tight">Invite User</h2>
			<p class="text-muted-foreground">
				Invite a new user to join your workspace. They will have access to all the projects and
				boards in this workspace.
			</p>
		</div>

		<div class="space-y-4">
			<div class="space-y-2">
				<Input id="username" placeholder="Enter username" bind:value={username} />
			</div>
		</div>

		<div class="space-y-2">
			<Button
				class="w-full"
				disabled={inviteResp.isSubmittingInvite}
				isLoading={inviteResp.isSubmittingInvite}
				onclick={() => inviteUser(username, data.slug)}
			>
				Send Invitation
			</Button>
		</div>
	</div>
</Modal>
