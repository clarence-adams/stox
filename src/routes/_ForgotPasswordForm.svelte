<script>
	import { goto } from '$app/navigation';
	import { landingForm } from '$lib/stores';
	import CardWrapper from '$lib/CardWrapper.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Errors from '$lib/Errors.svelte';

	let form;
	let body = {
		username: null,
		securityAnswer: null,
		password: null
	};
	let securityQuestion = false;
	let securityAnswerCorrect = false;

	let errors = [];
	let usernameValue;
	const getSecurityQuestion = async () => {
		if (body.username === null) {
			errors = [];
			const url = `/api/get-security-question?username=${usernameValue}`;
			const res = await fetch(url);
			if (res.ok) {
				const data = await res.json();
				body.username = usernameValue;
				securityQuestion = data.securityQuestion;
			} else if (res.status === 400) {
				errors = ['User not found.'];
			}
		}
	};

	let securityAnswerValue;
	const authenticateSecurityAnswer = async () => {
		if (body.securityAnswer === null) {
			errors = [];
			const url = `/api/landing/authenticate-security-answer?username=${usernameValue}&answer=${securityAnswerValue}`;
			const res = await fetch(url);
			if (res.ok) {
				const data = await res.json();
				if (data.authenticated) {
					body.securityAnswer = securityAnswerValue;
				} else {
					errors = ['Wrong answer. Please try again.'];
				}
				securityAnswerCorrect = data.authenticated;
			}
		}
	};

	let passwordValue;
	let passwordConfirmationValue;
	const formHandler = async () => {
		errors = [];

		if (passwordValue !== passwordConfirmationValue) {
			errors = ['Passwords must match.'];
		}

		body.password = passwordValue;

		// error handling
		for (const value of Object.entries(body)) {
			if (value[1] === null || value[1] === '') {
				errors = [...errors, 'Please fill out all forms.'];
				break;
			}
		}

		if (errors.length > 0) return;
		const res = await fetch('/api/landing/reset-password', {
			method: 'PATCH',
			body: JSON.stringify(body)
		});
		if (res.redirected) {
			goto(res.url);
		} else {
			errors = ['An error has occurred. Try again later.'];
		}
	};

	const rememberPasswordButtonHandler = () => {
		landingForm.set('login');
	};
	const registrationButtonHandler = () => {
		landingForm.set('registration');
	};
</script>

<CardWrapper>
	<form bind:this={form} on:submit|preventDefault={formHandler} class="flex flex-col gap-8">
		<h2 class="text-center text-3xl font-bold">Password Reset</h2>

		<fieldset>
			<!-- username -->
			{#if !securityQuestion}
				<Input id="username" name="username" label="Username" bind:value={usernameValue} required />
				<Button type="button" onClick={getSecurityQuestion}>Get security Question</Button>
			{/if}
			<!-- security question -->
			{#if securityQuestion && !securityAnswerCorrect}
				<p>Question: {securityQuestion}</p>
				<Input
					id="security-answer"
					name="security-answer"
					label="Answer"
					bind:value={securityAnswerValue}
					required
				/>
				<Button type="button" onClick={authenticateSecurityAnswer}>Answer</Button>
			{/if}
			<!-- reset password-->
			{#if securityAnswerCorrect}
				<Input
					id="new-password"
					name="new-password"
					label="New Password"
					type="password"
					bind:value={passwordValue}
					required
				/>
				<Input
					id="new-password-confirmation"
					name="new-password-confirmation"
					label="Confrim New Password"
					type="password"
					bind:value={passwordConfirmationValue}
					required
				/>
			{/if}
		</fieldset>

		<!-- Errors-->
		<Errors {errors} noGap={true} />

		<div class="flex flex-col items-start gap-4">
			{#if securityAnswerCorrect}
				<Button type="submit">Reset Password</Button>
			{/if}
			<Button buttonType="tertiary" onClick={rememberPasswordButtonHandler} type="button">
				Remember your password?
			</Button>
			<Button buttonType="tertiary" onClick={registrationButtonHandler} type="button"
				>Need an account?</Button
			>
		</div>
	</form>
</CardWrapper>
