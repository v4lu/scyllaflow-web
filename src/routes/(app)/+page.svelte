<script lang="ts">
	import { CreateWorkspace } from '$lib/components/forms';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();

	let isOpenCreateWorkspace = $state(false);
</script>

<main class="grid place-content-center">
	<section class="grid h-full place-content-center justify-center justify-items-center pb-24">
		<h2 class="text-3xl font-bold">Ups, currently there is no workspaces</h2>
		<p class="text-muted-foreground">But no worries, you can always create one!</p>
		<Button onclick={() => (isOpenCreateWorkspace = true)} class="mt-4 w-fit">
			Create Workspace
		</Button>
	</section>
</main>

<CreateWorkspace bind:isOpen={isOpenCreateWorkspace} authToken={data.accessToken} />
