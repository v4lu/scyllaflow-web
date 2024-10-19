<script lang="ts">
	import { userLoginSchema } from '$lib/validators/auth.validator.js';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Field } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();
	const { enhance, form, errors, submitting } = superForm(data.form, {
		validators: zodClient(userLoginSchema)
	});
</script>

<main class="container flex min-h-screen w-full items-center justify-center">
	<div class="w-full max-w-lg">
		<h2 class="mb-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
		<form use:enhance method="POST" action="?/login" class="space-y-6">
			<Field name="Email" error={$errors.email}>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon icon="mynaui:envelope" class="h-5 w-5 text-gray-400" />
					</div>
					<Input
						bind:value={$form.email}
						id="email"
						name="email"
						type="email"
						placeholder="jd@example.com"
						required
						class="w-full pl-10 pr-10"
					/>
				</div>
			</Field>
			<Button disabled={$submitting} isLoading={$submitting} type="submit" class="w-full" size="sm">
				Sign in
			</Button>
		</form>
	</div>
</main>
