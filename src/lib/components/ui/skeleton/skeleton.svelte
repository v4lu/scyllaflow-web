<script lang="ts">
	import { cn } from '$lib';

	interface SkeletonProps {
		class?: string;
	}

	let { class: className }: SkeletonProps = $props();
</script>

<div class={cn('animate-pulse rounded-md bg-muted', className)}></div>
