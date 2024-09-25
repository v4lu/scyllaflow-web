<script lang="ts">
	import { cn } from '$lib';
	import { Button, buttonVariants } from '../../compoentns/ui/button';
	import { Dropdown } from '../../compoentns/ui/dropdown';

	let { children } = $props();
	let isOpen = $state(false);
</script>

<header class={cn('flex items-center justify-between border-b border-border p-4 lg:px-8')}>
	<Dropdown
		class={buttonVariants({ size: 'sm', variant: 'secondary' })}
		{isOpen}
		selectText="Select"
	>
		<div class="w-[12rem]">Hello World</div>
	</Dropdown>
</header>

<div class="grid h-[calc(100dvh-70.4px)] flex-1 grid-cols-[260px,1fr]">
	<aside class="hidden w-[260px] content-start gap-4 border-r border-border px-6 py-8 md:grid">
		<Button variant="secondary" class="w-full">New Issue</Button>
	</aside>
	{@render children()}
</div>
