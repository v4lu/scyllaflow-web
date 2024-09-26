<script>
	import { mode, toggleMode } from 'mode-watcher';

	import { Button } from '../../../../compoentns/ui/button';
</script>

<main class="p-4">
	<Button onclick={toggleMode}>
		{$mode === 'light' ? 'toggle dark' : 'toggle light'}
		<span class="sr-only">Toggle theme</span>
	</Button>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</main>
