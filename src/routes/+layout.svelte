<script lang="ts">
	import { toast } from '$lib/store/toast.store';
	import '@fontsource-variable/exo-2';
	import { ModeWatcher } from 'mode-watcher';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import { Toast } from '../lib/components/ui/toast';
	import type { User } from '$lib/types/user.type';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="fixed right-4 top-4 z-[100] flex flex-col gap-2">
	{#each $toast as t (t.id)}
		<div transition:fade={{ duration: 300 }}>
			<Toast message={t.message} type={t.type} close={() => toast.remove(t.id)} />
		</div>
	{/each}
</div>
{@render children()}
