<script lang="ts">
	import { sessionStore } from '$lib/store/session.store';
	import { Modal } from '../../lib/compoentns/ui/modal';

	let { children, data } = $props();
	sessionStore.setUser(data.user);
	let isOpen = $state(false);
</script>

<div class="grid h-full flex-1 grid-cols-[260px,1fr]">
	{@render children()}
</div>

<Modal class="h-[12rem] lg:min-w-[35rem]" {isOpen} onClose={() => (isOpen = false)}
	>Hello World</Modal
>
