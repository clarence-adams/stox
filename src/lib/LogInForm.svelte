<script>
	import { fly } from 'svelte/transition';
	import { registrationForm } from '../stores';
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let flyDuration = 200;
	let flyY = 100;

	const formHandler = (e) => {
		const formData = new FormData(form);

		const username = formData.get('username');
		const password = formData.get('password');
		const passwordConfirmation = formData.get('password-confirmation');

		fetch('/api/login', {
			method: 'POST',
			body: formData
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});

		console.log('form submitted!');
	};

	const tertiaryHandler = () => {
		registrationForm.set(true);
	};
</script>

<form
	bind:this={form}
	on:submit|preventDefault={formHandler}
	in:fly={{ duration: flyDuration, y: flyY }}
	out:fly={{ duraiton: flyDuration, y: flyY }}
	class="flex flex-col gap-8 w-[300px] p-8 bg-white border-2
	border-emerald-300 rounded-lg shadow-lg sm:w-[350px]"
>
	<h2 class="text-center text-3xl font-bold">Log In</h2>
	<fieldset>
		<Label labelFor="username">Username</Label>
		<Input id="username" name="username" required />
		<Label labelFor="password">Password</Label>
		<Input id="password" name="password" type="password" required />
	</fieldset>
	<div class="flex flex-col items-start gap-4">
		<Button>Log In</Button>
		<Button buttonType="tertiary" onClick={tertiaryHandler} type="button">Need an account?</Button>
	</div>
</form>
