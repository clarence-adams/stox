<script>
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import getUsernameAvailability from '$lib/getUsernameAvailability';
	import CardWrapper from '$lib/CardWrapper.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let usernameValue;
	let passwordValue;
	let passwordConfirmationValue;
	let securityQuestionValue;
	let securityAnswerValue;
	let next = false;

	const usernamePattern = '^[A-Za-z0-9]{8,16}$';
	const usernameRegex = new RegExp(usernamePattern);
	const passwordPattern = '^[A-Za-z0-9!@#$%^&*]{8,64}$';
	const passwordRegex = new RegExp(passwordPattern);
	const securityQuestionPattern = '^[\\w\\s?.,/-]{8,64}$';
	const securityAnswerPattern = '^[\\w\\s?.,/-]{1,64}$';
	let errors = [];

	let nextDisabled = true;
	let usernameError = false;
	const usernameBlurHandler = async (event) => {
		const available = await getUsernameAvailability(event.target.value);
		if (!available) {
			nextDisabled = true;
			errors.push('Username already taken.');
			usernameError = true;
		} else {
			nextDisabled = false;
			errors = [];
			usernameError = false;
		}
	};

	let passwordConfirmationError = false;
	const confirmPassword = (e) => {
		if (passwordConfirmationValue === '') {
			nextDisabled = false;
			passwordConfirmationError = false;
		} else if (passwordValue !== passwordConfirmationValue) {
			nextDisabled = true;
			passwordConfirmationError = true;
		} else {
			nextDisabled = false;
			passwordConfirmationError = false;
		}
	};

	const nextHandler = () => {
		if (
			!usernameError &&
			!passwordConfirmationError &&
			usernameRegex.test(usernameValue) &&
			passwordRegex.test(passwordValue)
		) {
			next = true;
		}
	};

	let registerDisabled = false;

	const formHandler = async () => {
		errors = [];
		const formData = new FormData(form);

		formData.append('username', usernameValue);
		formData.append('password', passwordValue);
		formData.append('password-confirmation', passwordConfirmationValue);
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

		const res = await fetch('/api/landing/register', {
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

<CardWrapper>
	<form bind:this={form} on:submit|preventDefault={formHandler} class="flex flex-col gap-8">
		<h2 class="text-center text-3xl font-bold">Register</h2>
		<fieldset>
			{#if !next}
				<div transition:slide|local={{ delay: 250, duration: 300 }}>
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
						error={usernameError}
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
				</div>
			{:else}
				<div transition:slide|local={{ delay: 250, duration: 300 }}>
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
				</div>
			{/if}
		</fieldset>
		{#if errors.length > 0}
			<p
				transition:slide|local={{ delay: 250, duration: 300 }}
				class="border-2 border-rose-300 bg-rose-200 p-4 dark:text-gray-900"
			>
				{#each errors as error}
					<span>{error}</span>
				{/each}
			</p>
		{/if}
		{#if !next}
			<div>
				<Button disabled={nextDisabled} onClick={nextHandler} type="button">Next</Button>
			</div>
		{:else}
			<div>
				<Button disabled={registerDisabled}
					>Create Account <svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="inline"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
						/>
						<path
							fill-rule="evenodd"
							d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
						/>
					</svg></Button
				>
			</div>
		{/if}
	</form>
</CardWrapper>
