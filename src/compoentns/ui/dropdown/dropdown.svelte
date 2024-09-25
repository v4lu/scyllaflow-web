<script lang="ts">
	import { cn } from '$lib';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	type Props = {
		isOpen: boolean;
		class?: string;
		children: Snippet;
		selectText: string;
	};

	let { isOpen = $bindable(), class: className, children, selectText }: Props = $props();
	let btn = $state<HTMLButtonElement>();

	function clickOutside(node: HTMLElement) {
		function handleClick(event: MouseEvent) {
			if (btn && btn.contains(event?.target as Node)) return;
			if (node && !node.contains(event.target as Node)) {
				isOpen = false;
			}
		}
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class="relative">
	<button
		bind:this={btn}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class={cn(
			'flex items-center gap-3 rounded-md border border-border py-2 pl-4 pr-3 text-sm shadow-sm transition-colors duration-200 ',
			className
		)}
	>
		{selectText}
		<Icon
			icon="tabler:chevron-down"
			class={cn(
				'ml-auto size-4 transition-transform duration-200',
				isOpen ? 'rotate-180' : 'rotate-0'
			)}
		/>
	</button>
	{#if isOpen}
		<div
			use:clickOutside
			transition:slide={{ duration: 200, axis: 'y' }}
			class={cn(
				'absolute top-[2.8rem] z-[120] max-h-56  overflow-y-auto rounded-md border border-border bg-card p-2 shadow-lg'
			)}
		>
			<div transition:fade={{ duration: 100 }}>
				{@render children()}
			</div>
		</div>
	{/if}
</div>
