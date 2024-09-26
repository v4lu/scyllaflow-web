<script lang="ts">
	import { cn } from '$lib';
	import { sessionStore } from '$lib/store/session.store';
	import { Button } from '../../compoentns/ui/button';
	import { Modal } from '../../compoentns/ui/modal';

	let { children, data } = $props();
	sessionStore.setUser(data.user);
	let isOpen = $state(false);
</script>

<header class={cn('flex items-center justify-between border-b border-border px-4 py-3 lg:px-8')}>
	<Button size="sm">Hello {$sessionStore.username}</Button>
</header>

<div class="grid h-[calc(100dvh-60.8px)] flex-1 grid-cols-[260px,1fr]">
	<aside class="hidden w-[260px] content-start gap-4 border-r border-border px-6 py-8 md:grid">
		<Button onclick={() => (isOpen = true)} variant="secondary" class="w-full">New Issue</Button>
	</aside>
	{@render children()}
</div>

<Modal class="h-[12rem] lg:min-w-[35rem]" {isOpen} onClose={() => (isOpen = false)}
	>Hello World</Modal
>
