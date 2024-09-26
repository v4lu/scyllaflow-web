<script lang="ts">
	import { useWorkspace } from '$lib/api/use-workspace.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { mode, toggleMode } from 'mode-watcher';
	let { data } = $props();

	const { resp } = useWorkspace(data.accessToken, data.workspace!);
	console.log(resp.workspace);
</script>

<main class="p-4">
	<Button onclick={toggleMode}>
		{$mode === 'light' ? 'toggle dark' : 'toggle light'}
		<span class="sr-only">Toggle theme</span>
	</Button>
	<h1>Welcome to {resp.workspace?.name}</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</main>
