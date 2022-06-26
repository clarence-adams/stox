<script>
	import { goto } from '$app/navigation';
	import { landingForm } from '$lib/stores.js';
	import FormWrapper from '$lib/FormWrapper.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let usernamePattern = '^[A-Za-z0-9]{8,16}$';
	let passwordPattern = '^[A-Za-z0-9!@#$%^&*]{8,64}$';

	let errors = [];
	const formHandler = async () => {
		errors = [];
		const formData = new FormData(form);

		const username = formData.get('username');
		const password = formData.get('password');

		// error handling
		if (username === '' || password === '') {
			errors.push('Please fill out all forms');
		}

		if (errors.length > 0) return;

		const res = await fetch('/api/login', {
			method: 'POST',
			body: formData
		});
		if (res.redirected) {
			goto(res.url);
		} else {
			errors = ['Incorrect username and/or password'];
		}
	};

	const forgotPasswordButtonHandler = () => {
		landingForm.set('forgotPassword');
	};

	const registrationButtonHandler = () => {
		landingForm.set('registration');
	};
</script>

<FormWrapper>
	<form bind:this={form} on:submit|preventDefault={formHandler} class="flex flex-col gap-8">
		<h2 class="text-center text-3xl font-bold">Log In</h2>
		<fieldset>
			<Input id="username" name="username" label="Username" pattern={usernamePattern} required />
			<Input
				id="password"
				name="password"
				label="Password"
				pattern={passwordPattern}
				type="password"
				required
			/>
		</fieldset>
		{#if errors.length > 0}
			<p class="border-2 border-rose-300 bg-rose-200 p-4 dark:text-gray-900">
				{#each errors as error}
					<span>{error}</span>
				{/each}
			</p>
		{/if}
		<div class="flex flex-col items-start gap-4">
			<Button>Log In</Button>
			<Button buttonType="tertiary" onClick={forgotPasswordButtonHandler} type="button">
				Forgot your password?
			</Button>
			<Button buttonType="tertiary" onClick={registrationButtonHandler} type="button"
				>Need an account?</Button
			>
		</div>
	</form>
</FormWrapper>
