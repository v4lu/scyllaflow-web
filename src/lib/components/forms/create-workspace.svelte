<script lang="ts">
	import { goto } from '$app/navigation';
	import { uploadImage } from '$lib/api';
	import { useWorkspaces } from '$lib/api/use-workspaces.svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '../ui/button';
	import { Field } from '../ui/field';
	import { Input } from '../ui/input';
	import { Modal } from '../ui/modal';

	type Props = {
		isOpen: boolean;
		authToken: string;
		createWorkspaceParent?: (name: string, image: string) => Promise<void>;
		shouldGoto?: boolean;
	};
	let {
		isOpen = $bindable(),
		authToken,
		createWorkspaceParent,
		shouldGoto = false
	}: Props = $props();

	const { resp, createWorkspace } = useWorkspaces(authToken);

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
				authToken,
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
		if (createWorkspaceParent) {
			await createWorkspaceParent(name, imageUrl);
		} else {
			await createWorkspace(name, imageUrl);
		}
		imageUrl = '';
		name = '';
		if (shouldGoto) {
			goto('/');
		}
		isOpen = false;
	}
</script>

<Modal onClose={() => (isOpen = false)} bind:isOpen class="md:w-[35rem]">
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
