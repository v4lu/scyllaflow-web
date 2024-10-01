<script lang="ts">
	import { sessionStore } from '$lib/store/session.store';

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) {
			return 'Good morning';
		} else if (hour < 18) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}
</script>

<header class="flex w-full justify-between border-b border-border bg-card p-4 lg:px-8">
	<div class="flex w-full items-center justify-start space-x-2">
		<h3 class=" text-2xl font-bold">ScyllaFlow</h3>
	</div>
	<div class="flex w-full justify-end">
		<p class="text-lg">{getGreeting()}, {$sessionStore.username}</p>
	</div>
</header>
