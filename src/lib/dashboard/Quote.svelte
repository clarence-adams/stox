<script>
	import Form from '$lib/dashboard/Form.svelte';
	import SymbolInput from '$lib/dashboard/SymbolInput.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let quote = '';

	const fetchQuote = () => {
		const formData = new FormData(form);
		const symbol = formData.get('symbol');

		if (symbol === '') {
			return (quote = 'Please input a symbol first.');
		}

		fetch('/dashboard/api/quote', { method: 'POST', body: formData })
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				} else {
					throw Error('An error has occurred. Try again later.');
				}
			})
			.then((res) => {
				quote = res.quote;
			})
			.catch((err) => {
				quote = err;
			});
	};
</script>

<Form onSubmit={fetchQuote} bind:form>
	<fieldset>
		<SymbolInput />
	</fieldset>
	<Button type="submit">Quote</Button>
	quote: {quote}
</Form>
