<script>
	import { fly } from 'svelte/transition';
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;

	let usernamePattern = '([A-Za-z0-9]+){8,16}';
	let passwordPattern = '([A-Za-z0-9!@#$%^&*]+){8,64}';

	let flyDuration = 200;
	let flyY = 100;

	let usernameValue;
	let passwordValue;
	let passwordConfirmationValue;

	const formHandler = () => {
		const formData = new FormData(form);

		const username = formData.get('username');
		const password = formData.get('password');
		const passwordConfirmation = formData.get('password-confirmation');

		fetch('/api/register', {
			method: 'POST',
			body: formData
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});

		console.log('Form submitted!');
	};
</script>

<form
	bind:this={form}
	on:submit|preventDefault={formHandler}
	in:fly={{ duration: flyDuration, y: flyY }}
	out:fly={{ duration: flyDuration, y: flyY }}
	class="
    flex flex-col gap-8 w-[300px] p-8 bg-white border-2 border-emerald-300 
    rounded-xl shadow-lg sm:w-[350px]
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
		/>
	</fieldset>
	<div>
		<Button>Create Account</Button>
	</div>
</form>
