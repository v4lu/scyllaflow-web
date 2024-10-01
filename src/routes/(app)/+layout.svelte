<script lang="ts">
	import { Header, Sidebar } from '$lib/components/layout/index.js';
	import { sessionStore } from '$lib/store/session.store';

	let { children, data } = $props();
	sessionStore.setUser(data.user);
</script>

<Header />
<div class="grid h-[calc(100dvh-65px)] flex-1 grid-cols-[260px,1fr]">
	<Sidebar authToken={data.accessToken} slug={data.slug} />
	{@render children()}
</div>
