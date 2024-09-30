<script>
	import { useRequest } from '$lib/api/use-requests.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Modal } from '$lib/components/ui/modal';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let username = $state('');
	let isOpen = $state(false);
	const { inviteUser, resp } = useRequest(data.accessToken);
</script>

<main class="p-4">
	<section class="flex w-full justify-end">
		<Button onclick={() => (isOpen = true)} variant="ghost" size="icon">
			<Icon icon="tabler:dots-vertical" class="size-5" />
		</Button>
	</section>
</main>

<Modal bind:isOpen class="min-w-[25rem grid gap-4 p-4" onClose={() => (isOpen = false)}>
	<Input placeholder="Username" class="w-full" bind:value={username} />
	<Button
		disabled={resp.isSubbmitingInvite}
		isLoading={resp.isSubbmitingInvite}
		onclick={() => inviteUser(username, data.slug)}>Invite user</Button
	>
</Modal>
