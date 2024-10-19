<script lang="ts">
	import { cn, getStatusColor } from '$lib';
	import type { Issue } from '$lib/types/issue.type';
	import type { Component } from 'svelte';

	type Props = {
		subIssue: Issue;
		Icon: Component;
	};

	let { subIssue, Icon }: Props = $props();
</script>

<div
	class="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
>
	<Icon class={cn('mt-1 size-4', getStatusColor(subIssue.status))} />
	<div class="min-w-0 flex-1 space-y-1">
		<span class="text-sm font-medium">{subIssue.title}</span>
		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span class={cn('font-medium', getStatusColor(subIssue.status))}>
				{subIssue.status}
			</span>
		</div>
	</div>
</div>
