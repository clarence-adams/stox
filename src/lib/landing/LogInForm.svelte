<script>
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { registrationForm } from '$lib/stores.js';
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let flyDuration = 200;
	let flyY = 100;

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
			flyDuration = 0;
			goto(res.url);
		} else {
			errors = ['Incorrect username and/or password'];
		}
	};

	const tertiaryHandler = () => {
		registrationForm.set(true);
	};
</script>

<form
	bind:this={form}
	on:submit|preventDefault={formHandler}
	in:fly|local={{ duration: flyDuration, y: flyY }}
	out:fly|local={{ duraiton: flyDuration, y: flyY }}
	class="flex w-[300px] flex-col gap-8 rounded-lg bg-white p-8 shadow sm:w-[350px]"
>
	<h2 class="text-center text-3xl font-bold">Log In</h2>
	<fieldset>
		<Label labelFor="username">Username</Label>
		<Input id="username" name="username" required />
		<Label labelFor="password">Password</Label>
		<Input id="password" name="password" type="password" required />
	</fieldset>
	{#if errors.length > 0}
		<p class="border-2 border-rose-300 bg-rose-200 p-4">
			{#each errors as error}
				<span>{error}</span>
			{/each}
		</p>
	{/if}
	<div class="flex flex-col items-start gap-4">
		<Button>Log In</Button>
		<Button buttonType="tertiary" onClick={tertiaryHandler} type="button">Need an account?</Button>
	</div>
</form>
