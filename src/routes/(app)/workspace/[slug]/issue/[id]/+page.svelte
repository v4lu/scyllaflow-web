<script lang="ts">
	import { useIssue } from '$lib/api/use-issue.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Editor } from '$lib/components/ui/editor';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const { resp, updateIssue } = useIssue(data.accessToken, +data.id, data.slug);

	function handleUpdateIssue() {
		if (resp.issue) {
			updateIssue(resp.issue);
		}
	}

	function handleTitleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (resp.issue) {
			resp.issue.title = target.value;
		}
	}

	function handleDescriptionUpdate(newContent: object) {
		if (resp.issue) {
			resp.issue.description = JSON.stringify(newContent);
		}
	}
</script>

<div class="grid h-[calc(100dvh-73px)] grid-cols-1 xl:grid-cols-[1fr,20rem]">
	<section class="h-full min-h-max border-r border-border">
		<article class="flex h-14 justify-between border-b border-border">
			<div class="flex items-center justify-center px-4 py-2 lg:px-8">
				<h3 class="text-sm font-medium">Hello World</h3>
			</div>
			<div class="flex items-center justify-center gap-2 px-4 py-2 lg:px-8">
				<a
					href={`/`}
					class={buttonVariants({
						size: 'icon',
						variant: 'ghost'
					})}
				>
					<Icon icon="gg:chevron-down" class="size-5" />
				</a>
				<p class="text-xs font-normal">10/20</p>
				<a
					href={`/`}
					class={buttonVariants({
						size: 'icon',
						variant: 'ghost'
					})}
				>
					<Icon icon="gg:chevron-up" class="size-5" />
				</a>
			</div>
		</article>
		<article class="mt-8 grid justify-items-start px-4 lg:px-8">
			<Input
				oninput={handleTitleChange}
				variant="empty"
				value={resp.issue?.title ?? ''}
				class="text-2xl font-medium"
			/>
			{#if resp.issue?.description}
				<Editor
					content={JSON.parse(resp.issue.description)}
					update={handleDescriptionUpdate}
					placeholder="Add a description..."
				/>
			{/if}
			<Button
				disabled={resp.isSubmittingUpdate}
				isLoading={resp.isSubmittingUpdate}
				onclick={handleUpdateIssue}>Update Task</Button
			>
		</article>
	</section>
</div>
