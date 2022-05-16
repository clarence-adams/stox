<script>
	import Label from '$lib/Label.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
</script>

<form
	class="
    flex flex-col gap-8 w-[300px] p-8 bg-white border-2 border-emerald-300 
    rounded-xl shadow-lg
  "
>
	<h2 class="text-center text-3xl font-bold">Sign Up</h2>
	<fieldset>
		<Label labelFor="username">Username</Label>
		<Input id="username" name="username" />
		<Label labelFor="password">Password</Label>
		<Input id="password" name="password" type="password" />
	</fieldset>
	<div>
		<Button>Create Account</Button>
	</div>
</form>
