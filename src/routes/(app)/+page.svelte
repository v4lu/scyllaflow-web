<script lang="ts">
	import { uploadImage } from '$lib/api';
	import { useWorkspaces } from '$lib/api/use-workspaces.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Field } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Modal } from '$lib/components/ui/modal/index.js';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const { resp, createWorkspace } = useWorkspaces(data.accessToken);

	let isOpenCreateWorkspace = $state(false);
	let imageUrl = $state('');
	let imageUploadLoading = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let name = $state('');

	function setImageUrl(url: string): void {
		imageUrl = url;
	}

	function setImageUploadLoading(loadingState: boolean): void {
		imageUploadLoading = loadingState;
	}
	async function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.length) {
			await uploadImage({
				authToken: data.accessToken,
				file: input.files[0],
				setImageUrl,
				setImageUploadLoading
			});
		}
	}

	function handleInputFileClick(): void {
		if (!fileInput) return;
		fileInput.click();
	}

	async function handleCreateWorkspace() {
		createWorkspace(name, imageUrl);
		imageUrl = '';
		name = '';
	}
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

<Modal
	onClose={() => (isOpenCreateWorkspace = false)}
	isOpen={isOpenCreateWorkspace}
	class="md:w-[35rem]"
>
	<div class="mt-3 grid flex-col gap-3 p-8 pt-3">
		<Field name="Name">
			<Input type="text" bind:value={name} placeholder="Scyllaflow" />
		</Field>
		<Field name="Image">
			<div class="relative">
				{#if imageUrl}
					<div class="relative w-fit">
						<img
							src={imageUrl}
							alt="Workspace"
							width="180"
							height="180"
							class="h-[11.25rem] w-[11.25rem] rounded-md object-cover"
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							class="absolute right-2 top-2"
							onclick={() => (imageUrl = '')}
						>
							<Icon icon="mdi:trash" class="h-4 w-4" />
						</Button>
					</div>
				{:else}
					<Button
						type="button"
						variant="outline"
						class="h-[11.25rem] w-[11.25rem]"
						onclick={handleInputFileClick}
					>
						{#if imageUploadLoading}
							<Icon icon="gg:spinner" class="h-6 w-6 animate-spin" />
						{:else}
							<Icon icon="material-symbols:image" class="mr-2 h-6 w-6" />
							Upload Image
						{/if}
					</Button>
				{/if}
			</div>
		</Field>
		<div class="flex justify-end">
			<Button
				onclick={handleCreateWorkspace}
				disabled={resp.isSubbmitingCreateWorkspace}
				isLoading={resp.isSubbmitingCreateWorkspace}
				class="w-fit"
			>
				Create
			</Button>
		</div>
	</div>
	<input type="file" class="hidden" bind:this={fileInput} onchange={handleFileChange} />
</Modal>
