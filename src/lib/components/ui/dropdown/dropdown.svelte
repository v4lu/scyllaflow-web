<script lang="ts">
	import { cn } from '$lib';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		isOpen: boolean;
		class?: string;
		children: Snippet;
		triggerText?: string;
		triggerIcon?: string;
		triggerIconClass?: string;
		triggerClass?: string;
		downArrowIcon?: boolean;
	};
	let {
		triggerText,
		triggerIcon,
		triggerClass,
		triggerIconClass,
		isOpen = $bindable(),
		class: className,
		downArrowIcon = false,
		children
	}: Props = $props();

	let btn = $state<HTMLButtonElement>();

	function clickOutside(node: HTMLElement) {
		function handleClick(event: MouseEvent) {
			if (btn && btn.contains(event?.target as Node)) return;

			if (node && !node.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		// true to use capture phase
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
			'flex min-w-[12rem] items-center gap-3 rounded-md border border-border py-2 pl-4 pr-3 text-sm shadow-sm',
			triggerClass
		)}
	>
		{#if triggerText}
			<span>{triggerText}</span>
		{/if}
		{#if downArrowIcon}
			<Icon
				icon="solar:alt-arrow-down-outline"
				class={cn(
					'ml-auto size-4',
					triggerIconClass,
					isOpen
						? 'rotate-180 transition-transform duration-200 ease-in'
						: 'rotate-0 transition-transform duration-200 ease-out'
				)}
			/>
		{/if}
		{#if !downArrowIcon && triggerIcon}
			<Icon icon={triggerIcon} class={cn('ml-auto size-4', triggerIconClass)} />
		{/if}
	</button>

	<div
		use:clickOutside
		class={cn(
			'absolute top-[2.8rem] z-[120] hidden w-full min-w-[12rem] gap-2 overflow-y-auto rounded-md border border-border bg-card p-2 opacity-0',
			className,
			isOpen ? ' animate-fade-in grid opacity-100' : 'animate-fade-out opacity-0'
		)}
	>
		{@render children()}
	</div>
</div>
