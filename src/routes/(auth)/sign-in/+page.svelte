<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '$lib/store/toast.store.js';
	import { userLoginSchema } from '$lib/validators/auth.validator.js';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '../../../lib/compoentns/ui/button/button.svelte';
	import { Field } from '../../../lib/compoentns/ui/field';
	import { Input } from '../../../lib/compoentns/ui/input';

	let { data } = $props();
	let togglePassword = $state(false);
	const { enhance, form, errors, submitting, message } = superForm(data.form, {
		validators: zodClient(userLoginSchema)
	});

	$effect(() => {
		if ($errors._errors) {
			if ($errors._errors[0].startsWith('SERVER:')) {
				const err = $errors._errors[0].split('SERVER: ')[1];
				toast.error(err);
			}
			if ($errors._errors[0].startsWith('CREDENTIALS:')) {
				const err = $errors._errors[0].split('CREDENTIALS: ')[1];
				toast.error(err);
			}
		}
	});

	let passwordRequirements = $state([
		{ text: 'At least 8 characters', met: false },
		{ text: 'At least 1 lowercase letter', met: false },
		{ text: 'At least 1 uppercase letter', met: false },
		{ text: 'At least 1 number', met: false },
		{ text: 'At least 1 special character', met: false }
	]);

	let allRequirementsMet = $derived(passwordRequirements.every((req) => req.met));

	let passwordStrength = $derived(
		!allRequirementsMet ? 'Weak' : $form.password.length >= 12 ? 'Strong' : 'Good'
	);

	let passwordStrengthColor = $derived(
		!allRequirementsMet
			? 'text-red-500'
			: passwordStrength === 'Strong'
				? 'text-green-500'
				: 'text-yellow-500'
	);

	let passwordStrengthBarWidth = $derived(
		!allRequirementsMet ? '20%' : passwordStrength === 'Strong' ? '100%' : '75%'
	);

	let passwordStrengthBarColor = $derived(
		!allRequirementsMet
			? 'bg-red-500'
			: passwordStrength === 'Strong'
				? 'bg-green-500'
				: 'bg-yellow-500'
	);

	function updatePasswordRequirements(): void {
		passwordRequirements = [
			{ text: 'At least 8 characters', met: $form.password.length >= 8 },
			{ text: 'At least 1 lowercase letter', met: /[a-z]/.test($form.password) },
			{ text: 'At least 1 uppercase letter', met: /[A-Z]/.test($form.password) },
			{ text: 'At least 1 number', met: /\d/.test($form.password) },
			{ text: 'At least 1 special character', met: /[@$!%*?&.]/.test($form.password) }
		];
	}

	$effect(() => {
		if ($message) {
			toast.success($message);
			goto('/');
		}
	});
</script>

<div class="flex min-h-screen flex-col justify-center px-4 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold">Sign in to your account</h2>
	</div>
	<div class="sm:mx-auto sm:w-full sm:max-w-xl">
		<div class="px-4 py-4 sm:px-10">
			<form use:enhance method="POST" action="?/login" class="mt-4 grid gap-3">
				<Field name="Email" error={$errors.email}>
					<div class="relative mt-1">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="mynaui:envelope" class="h-5 w-5" />
						</div>
						<Input
							bind:value={$form.email}
							id="email"
							name="email"
							type="email"
							placeholder="jd@example.com"
							required
							class="pl-10 pr-10"
						/>
					</div>
				</Field>

				<Field name="Password" class="relative">
					<div class="relative mt-1">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="solar:lock-password-outline" class="h-5 w-5" />
						</div>
						<Input
							bind:value={$form.password}
							id="password"
							name="password"
							type={togglePassword ? 'text' : 'password'}
							placeholder="********"
							required
							class="pl-10 pr-10"
							oninput={updatePasswordRequirements}
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3">
							<button
								type="button"
								class="mt-1 flex items-center justify-center focus:outline-none"
								onclick={(): boolean => (togglePassword = !togglePassword)}
							>
								<Icon
									icon={togglePassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
									class="h-5 w-5"
								/>
							</button>
						</div>
					</div>
					<div class="mt-2 flex items-center justify-between">
						<a href="/forgot-password" class="text-sm font-medium text-primary hover:underline">
							Forgot your password?
						</a>
					</div>
				</Field>

				{#if $form.password}
					<div>
						<div class="mb-1 flex justify-between">
							<span class="text-sm font-medium text-muted-foreground">Password strength</span>
							<span class="text-sm font-medium {passwordStrengthColor}">
								{passwordStrength}
							</span>
						</div>
						<div class="h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full {passwordStrengthBarColor}"
								style="width: {passwordStrengthBarWidth}"
							></div>
						</div>

						<ul class="mt-2 space-y-1 text-sm text-muted-foreground">
							{#each passwordRequirements as req}
								<li class="flex items-center">
									<Icon
										icon={req.met ? 'ph:check-circle-fill' : 'ph:circle'}
										class="mr-2 h-4 w-4 {req.met ? 'text-green-500' : 'text-red-500'}"
									/>
									{req.text}
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<Button
					disabled={$submitting}
					isLoading={$submitting}
					type="submit"
					class="w-full"
					size="sm">Sign in</Button
				>
			</form>

			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-border"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
					</div>
				</div>

				<div class="mt-6">
					<Button class="w-full" variant="secondary" size="sm">
						<Icon icon="ri:google-fill" class="mr-2 h-5 w-5 text-muted-foreground" />
						Sign in with Google
					</Button>
				</div>
			</div>

			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-border"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-background px-2 text-muted-foreground">New to Vemeet?</span>
					</div>
				</div>

				<div class="mt-6 flex w-full justify-center">
					<a class="font-medium text-primary hover:underline" href="/sign-up">
						Create an account
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
