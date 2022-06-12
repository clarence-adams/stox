<script>
	import Form from '$lib/dashboard/Form.svelte';
	import Label from '$lib/landing/Label.svelte';
	import Input from '$lib/landing/Input.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let quote;

	const fetchQuote = () => {
		const formData = new FormData(form);
		console.log(formData.get('symbol'));
		fetch('/dashboard/api/quote', { method: 'POST', body: formData })
			.then((res) => res.json())
			.then((res) => {
				quote = res.quote;
			});
	};
</script>

<Form onSubmit={fetchQuote} bind:form>
	<fieldset>
		<Label labelFor="symbol">Symbol</Label>
		<Input id="symbol" name="symbol" />
	</fieldset>
	<Button type="submit">Quote</Button>
	quote: {quote === undefined ? '' : `$${quote}`}
</Form>
