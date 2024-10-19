<script lang="ts">
	import { clickOutsideTimeout, cn } from '$lib';
	import { sessionStore } from '$lib/store/session.store';
	import { slide } from 'svelte/transition';
	import { Avatar } from '../ui/avatar';
	import { buttonVariants } from '../ui/button';
	import Button from '../ui/button/button.svelte';
	import { cubicOut } from 'svelte/easing';

	let isUserDropdownOpen = $state(false);

	let navigations = $state([
		{ name: 'Settings', href: '/settings' },
		{ name: 'Settings', href: '/settings' }
	]);
</script>

<header class="flex w-full justify-between border-b border-border bg-card p-4 lg:px-8">
	<div class="flex w-full items-center justify-start space-x-2">
		<h3 class=" text-2xl font-bold">ScyllaFlow</h3>
	</div>

	<div class="relative">
		<button
			onclick={() => {
				isUserDropdownOpen = true;
			}}
		>
			<Avatar user={$sessionStore} />
		</button>
		{#if isUserDropdownOpen}
			<div
				transition:slide={{ duration: 300, easing: cubicOut }}
				use:clickOutsideTimeout={() => (isUserDropdownOpen = false)}
				class={cn(
					'absolute right-0 top-10 z-30 min-w-[13rem] rounded-md border border-border bg-card shadow-xl'
				)}
			>
				<div>
					{#each navigations as { name, href }}
						<a
							{href}
							class={cn(
								buttonVariants({ size: 'sm', variant: 'ghost' }),
								'w-full justify-start rounded-none px-6 first:rounded-t-md'
							)}>{name}</a
						>
					{/each}
					<div>
						<Button
							variant="ghost"
							size="sm"
							class="w-full justify-start rounded-none rounded-b-md px-6">Logout</Button
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</header>
