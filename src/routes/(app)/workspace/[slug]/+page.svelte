<script lang="ts">
	import { useWorkspace } from '$lib/api/use-workspace.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { issuesStore, useWorkspaceIssues } from '$lib/store/workspace-issues.store.js';
	import { mode, toggleMode } from 'mode-watcher';
	let { data } = $props();

	const { resp } = useWorkspace(data.accessToken, data.workspace!);
	console.log(resp.workspace);
	useWorkspaceIssues(data.accessToken, data.slug!);
</script>

<main class="p-4">
	<Button onclick={toggleMode}>
		{$mode === 'light' ? 'toggle dark' : 'toggle light'}
		<span class="sr-only">Toggle theme</span>
	</Button>
	<div class="grid">
		{#each $issuesStore as { id, title }}
			<span>
				{id} - {title}
			</span>
		{/each}
	</div>
</main>
