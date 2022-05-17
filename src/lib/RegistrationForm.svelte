<script>
	import { fly } from 'svelte/transition';
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';

	let usernamePattern = '([A-Za-z0-9]+){8,16}';
	let passwordPattern = '([A-Za-z0-9!@#$%^&*]+){8,64}';

	let flyDuration = 200;
	let flyY = 100;
</script>

<form
	in:fly={{ duration: flyDuration, delay: flyDuration + 200, y: flyY }}
	out:fly={{ duration: flyDuration, y: flyY }}
	class="
    flex flex-col gap-8 w-[300px] p-8 bg-white border-2 border-emerald-300 
    rounded-xl shadow-lg
  "
>
	<h2 class="text-center text-3xl font-bold">Register</h2>
	<fieldset>
		<Label labelFor="username">Username</Label>
		<Input id="username" name="username" required pattern={usernamePattern} maxLength="16" />
		<Label labelFor="password">Password</Label>
		<Input
			id="password"
			name="password"
			required
			pattern={passwordPattern}
			type="password"
			maxLength="64"
		/>
	</fieldset>
	<div>
		<Button>Create Account</Button>
	</div>
</form>
