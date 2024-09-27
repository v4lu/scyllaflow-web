<script>
	import { mode, setMode } from 'mode-watcher';
	import { Button } from '../ui/button';
</script>

<header class="flex justify-between border-b border-border bg-card p-4 lg:px-8">
	<div class="flex w-full items-center justify-start space-x-2">
		<div class="size-8 rounded-full bg-primary"></div>
		<h3 class="text-xl font-bold">ScyllaFlow</h3>
	</div>
	<Button onclick={() => setMode($mode === 'light' ? 'dark' : 'light')}>
		{$mode}
	</Button>

	<div class="size-8 rounded-full bg-red-300"></div>
</header>
