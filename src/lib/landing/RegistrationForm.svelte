<script>
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let usernameValue;
	let passwordValue;
	let passwordConfirmationValue;

	let usernamePattern = '([A-Za-z0-9]+){8,16}';
	let passwordPattern = '([A-Za-z0-9!@#$%^&*]+){8,64}';

	let disabled = false;

	let flyDuration = 200;
	let flyY = 100;

	let error = false;
	const confirmPassword = (e) => {
		if (passwordConfirmationValue === '') {
			disabled = false;
			error = false;
		} else if (passwordValue !== passwordConfirmationValue) {
			disabled = true;
			console.log('passwords do not match');
			error = true;
		} else {
			disabled = false;
			error = false;
		}
	};

	let errors = [];
	const formHandler = () => {
		errors = [];
		const formData = new FormData(form);

		const username = formData.get('username');
		const password = formData.get('password');
		const passwordConfirmation = formData.get('password-confirmation');

		// error handling
		if (username === '' || password === '' || passwordConfirmation === '') {
			errors.push('Please fill out all forms');
		}

		if (password !== passwordConfirmation) {
			errors.push('Passwords must match!');
		}

		if (errors.length > 0) return;

		fetch('/api/register', {
			method: 'POST',
			body: formData
		}).then((res) => {
			if (res.redirected) {
				goto(res.url);
			} else {
				res.json();
			}
		});
	};
</script>

<form
	bind:this={form}
	on:submit|preventDefault={formHandler}
	in:fly|local={{ duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="
    flex w-[300px] flex-col gap-8 rounded-xl bg-white 
    p-8 shadow-lg sm:w-[350px]
  "
>
	<h2 class="text-center text-3xl font-bold">Register</h2>
	<fieldset>
		<Label labelFor="username">Username</Label>
		<Input
			id="username"
			name="username"
			required
			pattern={usernamePattern}
			maxLength="16"
			bind:value={usernameValue}
			subtext="8-16 letters and/or numbers"
		/>
		<Label labelFor="password">Password</Label>
		<Input
			id="password"
			name="password"
			required
			pattern={passwordPattern}
			type="password"
			maxLength="64"
			bind:value={passwordValue}
			onInput={confirmPassword}
			subtext="8-64 letters, numbers, and special characters 
			(!, @, #, $, %, ^, &, *)"
		/>
		<Label labelFor="password-confirmation">Confrim Password</Label>
		<Input
			id="password-confirmation"
			name="password-confirmation"
			required
			pattern={passwordPattern}
			type="password"
			maxLength="64"
			bind:value={passwordConfirmationValue}
			onInput={confirmPassword}
			{error}
		/>
	</fieldset>
	{#if errors.length > 0}
		<p class="border-2 border-rose-300 bg-rose-200 p-4">
			{#each errors as error}
				<span>{error}</span>
			{/each}
		</p>
	{/if}
	<div>
		<Button {disabled}>Create Account</Button>
	</div>
</form>
