<script>
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import getUsernameAvailability from '$lib/landing/getUsernameAvailability.js';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let usernameValue;
	let passwordValue;
	let passwordConfirmationValue;
	let securityQuestionValue;
	let securityAnswerValue;

	let usernamePattern = '([A-Za-z0-9]+){8,16}';
	let passwordPattern = '([A-Za-z0-9!@#$%^&*]+){8,64}';
	let securityQuestionPattern = '\\w+{8,64}';
	let securityAnswerPattern = '\\w+{1,64}';

	let disabled = false;

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;

	let errors = [];
	let usernameError = false;
	const usernameBlurHandler = async (event) => {
		const available = await getUsernameAvailability(event.target.value);
		if (!available) {
			disabled = true;
			errors.push('Username already taken.');
			usernameError = true;
		} else {
			disabled = false;
			errors = [];
			usernameError = false;
		}
	};

	let passwordConfirmationError = false;
	const confirmPassword = (e) => {
		if (passwordConfirmationValue === '') {
			disabled = false;
			passwordConfirmationError = false;
		} else if (passwordValue !== passwordConfirmationValue) {
			disabled = true;
			passwordConfirmationError = true;
		} else {
			disabled = false;
			passwordConfirmationError = false;
		}
	};

	const formHandler = async () => {
		errors = [];
		const formData = new FormData(form);

		const password = formData.get('password');
		const passwordConfirmation = formData.get('password-confirmation');

		// error handling
		for (const value of formData.values()) {
			if (value === '') {
				errors.push('Please fill out all forms.');
				break;
			}
		}

		if (password !== passwordConfirmation) {
			errors.push('Passwords must match.');
		}

		if (errors.length > 0) return;

		const res = await fetch('/api/register', {
			method: 'POST',
			body: formData
		});
		if (res.redirected) {
			goto(res.url);
		} else {
			errors.push('There has been an error, try again later.');
		}
	};
</script>

<form
	bind:this={form}
	on:submit|preventDefault={formHandler}
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="
    flex w-[300px] flex-col gap-8 rounded-xl bg-white 
    p-8 shadow sm:w-[350px]
  "
>
	<h2 class="text-center text-3xl font-bold">Register</h2>
	<fieldset>
		<Input
			id="username"
			name="username"
			label="Username"
			required
			pattern={usernamePattern}
			maxLength="16"
			bind:value={usernameValue}
			subtext="8-16 letters and/or numbers"
			onBlur={usernameBlurHandler}
		/>
		<Input
			id="password"
			name="password"
			label="Password"
			required
			pattern={passwordPattern}
			type="password"
			maxLength="64"
			bind:value={passwordValue}
			onInput={confirmPassword}
			subtext="8-64 letters, numbers, and special characters 
			(!, @, #, $, %, ^, &, *)"
		/>
		<Input
			id="password-confirmation"
			name="password-confirmation"
			label="Password Confirmation"
			required
			pattern={passwordPattern}
			type="password"
			maxLength="64"
			bind:value={passwordConfirmationValue}
			onInput={confirmPassword}
			error={passwordConfirmationError}
		/>
		<Input
			id="security-question"
			name="security-question"
			label="Security Question"
			required
			pattern={securityQuestionPattern}
			maxLength="64"
			bind:value={securityQuestionValue}
			subtext="8-64 characters"
		/>
		<Input
			id="security-answer"
			name="security-answer"
			label="Security Answer"
			required
			pattern={securityAnswerPattern}
			maxLength="64"
			bind:value={securityAnswerValue}
			subtext="1-64 characters"
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
