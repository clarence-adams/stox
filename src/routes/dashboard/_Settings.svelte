<script>
	import { fly } from 'svelte/transition';
	import { user } from '$lib/stores';
	import getUser from '$lib/dashboard/getUser';
	import ThemeButton from '$lib/ThemeButton.svelte';
	import H2 from '$lib/dashboard/H2.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;

	let usernameForm;
	let usernamePattern = '^[A-Za-z0-9]{8,16}$';

	let errors = [];
	let messages = [];
	const changeUsername = async () => {
		errors = [];
		messages = [];
		const formData = new FormData(usernameForm);

		// error handling
		for (const value of formData.values()) {
			if (value === '') {
				errors.push('Please fill out all forms.');
				break;
			}
		}

		if (errors.length > 0) return (errors = [...errors]);

		const res = await fetch('/api/dashboard/change-username', {
			method: 'PATCH',
			body: formData
		});
		if (res.ok) {
			messages = ['Username successfully changed!'];
			// update user data store
			(async () => {
				const userData = await getUser();
				user.set(userData);
			})();
		} else if (res.status === 400) {
			errors = ['Username already taken'];
		} else if (res.status === 418) {
			errors = ['That is already your username!'];
		} else {
			errors = ['There has been an error, try again later.'];
		}
	};
</script>

<section
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-8"
>
	<H2>Settings</H2>
	<hr class="my-4" />
	<div class="flex flex-col items-start gap-4">
		<ThemeButton />
		<form bind:this={usernameForm} on:submit|preventDefault={changeUsername} class="w[300px]">
			<Input label="New Username" pattern={usernamePattern} id="username" name="username" />
			<Button>Change Username</Button>
			{#if errors.length > 0}
				<p class="mt-4 border-2 border-rose-300 bg-rose-200 p-4 dark:text-gray-900">
					{#each errors as error}
						<span>{error}</span>
					{/each}
				</p>
			{/if}
			{#if messages.length > 0}
				<p class="mt-4 border-2 border-emerald-300 bg-emerald-200 p-4 dark:text-gray-900">
					{#each messages as message}
						<span>{message}</span>
					{/each}
				</p>
			{/if}
		</form>
	</div>
</section>
