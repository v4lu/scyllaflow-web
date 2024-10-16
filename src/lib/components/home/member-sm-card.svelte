<script lang="ts">
	import { cn } from '$lib';
	import type { User } from '$lib/types/user.type';
	import { Avatar } from '../ui/avatar';

	type Props = {
		user: User;
	};

	let { user }: Props = $props();

	function formatRole(role: string): string {
		return role.replace('workspace:', '').toUpperCase();
	}
</script>

<div
	class="relative flex items-center gap-4 rounded-md border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md"
>
	<span
		class={cn(
			'absolute right-4 top-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ',
			user.role === 'workspace:admin' && 'bg-primary text-white',
			user.role === 'workspace:moderator' && 'bg-blue-400 text-white',
			user.role === 'workspace:member' && 'bg-amber-500 text-white'
		)}>{formatRole(user.role)}</span
	>
	<Avatar {user} class="size-12" />
	<div class="flex flex-col">
		<span class="text-lg font-medium">{user.username}</span>
	</div>
</div>
