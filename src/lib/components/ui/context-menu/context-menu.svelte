<script lang="ts">
	import { cn } from '$lib';
	import type { Snippet } from 'svelte';
	type Props = {
		x: number;
		y: number;
		children: Snippet;
		class?: string;
		isOpen: boolean;
	};
	let { x, y, children, class: className, isOpen }: Props = $props();
	let menuElement = $state<HTMLDivElement>();

	$effect(() => {
		if (menuElement) {
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const menuWidth = menuElement.offsetWidth;
			const menuHeight = menuElement.offsetHeight;

			if (x + menuWidth > viewportWidth) {
				x = viewportWidth - menuWidth;
			}

			y = y - menuHeight / 2;

			if (y < 0) {
				y = 0;
			} else if (y + menuHeight > viewportHeight) {
				y = viewportHeight - menuHeight;
			}
		}
	});
</script>

{#if isOpen}
	<div
		bind:this={menuElement}
		class={cn('absolute z-[100] rounded-md border border-border bg-card p-2 shadow-md', className)}
		style="left: {x}px; top: {y}px;"
	>
		{@render children()}
	</div>
{/if}
