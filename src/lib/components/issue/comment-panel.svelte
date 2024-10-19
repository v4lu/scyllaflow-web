<script lang="ts">
	import Icon from '@iconify/svelte';
	import { monthAndDay } from '$lib';
	import type { CommentResponse } from '$lib/types/issue.type';

	type Props = {
		comment: CommentResponse;
	};

	let { comment }: Props = $props();
</script>

<div class="group flex gap-3 rounded-lg p-3 transition-all hover:bg-accent">
	<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
		<Icon icon="lucide:user" class="size-4 text-primary" />
	</div>
	<div class="min-w-0 flex-1">
		<div class="mb-1.5 flex items-center gap-2">
			<span class="truncate font-medium">{comment.user.name ?? 'well, no comment'}</span>
			<time class="flex items-center gap-1.5 text-xs text-muted-foreground">
				<Icon icon="lucide:clock" class="size-3" />
				{monthAndDay(comment.comment.created_at)}
			</time>
		</div>
		<p class="text-sm leading-relaxed text-muted-foreground">{comment.comment.content}</p>
	</div>
</div>
