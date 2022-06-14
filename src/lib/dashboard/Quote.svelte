<script>
	import Form from '$lib/dashboard/Form.svelte';
	import SymbolInput from '$lib/dashboard/SymbolInput.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let quote = '';

	const fetchQuote = async () => {
		const formData = new FormData(form);
		const symbol = formData.get('symbol');

		if (symbol === '') {
			return (quote = 'Please input a symbol first.');
		}

		let res = await fetch('/dashboard/api/quote', { method: 'POST', body: formData });
		if (res.status === 200) {
			res = await res.json();
			quote = res.quote;
		} else {
			quote = 'An error has occurred. Try again later.';
		}
	};
</script>

<Form onSubmit={fetchQuote} bind:form>
	<fieldset>
		<SymbolInput />
	</fieldset>
	<Button type="submit">Quote</Button>
	quote: {quote}
</Form>
