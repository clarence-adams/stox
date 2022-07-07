<script>
	import { goto } from '$app/navigation';
	import { landingForm } from '$lib/stores';
	import CardWrapper from '$lib/CardWrapper.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Errors from '$lib/Errors.svelte';

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
			errors = ['Please fill out all forms'];
		}

		if (errors.length > 0) return;

		const res = await fetch('/api/landing/login', {
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

<CardWrapper>
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

		<!-- Errors -->
		<Errors {errors} noGap={true} />

		<div class="flex flex-col items-start gap-4">
			<Button
				>Log In
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="inline"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
					/>
					<path
						fill-rule="evenodd"
						d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
					/>
				</svg>
			</Button>
			<Button buttonType="tertiary" onClick={forgotPasswordButtonHandler} type="button">
				Forgot your password?
			</Button>
			<Button buttonType="tertiary" onClick={registrationButtonHandler} type="button"
				>Need an account?</Button
			>
		</div>
	</form>
</CardWrapper>
