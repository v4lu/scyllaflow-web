<script lang="ts">
	import '@fontsource-variable/noto-sans';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
