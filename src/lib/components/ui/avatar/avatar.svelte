<script lang="ts">
	import { cn } from '$lib';
	import type { UserResponse } from '$lib/types/user.type';

	type AvatarProps = {
		user: UserResponse;
		class?: string;
	};

	let { user, class: className }: AvatarProps = $props();

	function getInitial(username: string) {
		return username[0].toUpperCase();
	}
</script>

<div class={cn('aspect-square size-8 rounded-full', className)}>
	{#if user.user.profile_picture}
		<img
			alt={user.user.profile_picture}
			src={user.auth_user.email}
			class="aspect-square size-fit rounded-full bg-cover bg-center object-cover object-center"
		/>
	{:else}
		<div
			class="flex aspect-square items-center justify-center rounded-full border border-border bg-gradient-to-tr from-primary/10 via-primary/20 to-primary text-lg font-bold text-primary-foreground"
		>
			<span class="font-medium text-primary">
				{getInitial(user.auth_user.email)}
			</span>
		</div>
	{/if}
</div>
