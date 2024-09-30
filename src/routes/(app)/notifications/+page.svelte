<script lang="ts">
	import { useRequest } from '$lib/api/use-requests.svelte';
	import { Button } from '$lib/components/ui/button';
	let { data } = $props();
	const { resp, answerRequest } = useRequest(data.accessToken);
</script>

<main class="p-4">
	<div class="grid gap-2">
		{#each resp.requests as { workspaceId, name, userId }}
			<div class="flex items-center justify-center gap-8">
				<p class="font-medium">{name}</p>
				<div class="flex gap-3">
					<Button size="sm" onclick={() => answerRequest(true, workspaceId)}>Accept</Button>
					<Button size="sm" variant="destructive" onclick={() => answerRequest(false, workspaceId)}
						>Reject</Button
					>
				</div>
			</div>
		{/each}
	</div>
</main>
