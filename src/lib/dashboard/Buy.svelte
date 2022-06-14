<script>
	import Form from '$lib/dashboard/Form.svelte';
	import SymbolInput from '$lib/dashboard/SymbolInput.svelte';
	import SharesInput from '$lib/dashboard/SharesInput.svelte';
	import Button from '$lib/Button.svelte';

	let form;
	let transactionStatus = '';

	const fetchQuote = async () => {
		const formData = new FormData(form);
		const symbol = formData.get('symbol');
		const shares = formData.get('shares');

		if (symbol === '') {
			return (transactionStatus = 'Please input a symbol first.');
		}
		if (shares === 0 || shares === undefined) {
			return (transactionStatus =
				'Please input an amount of shares you would like to purchase first.');
		}

		let res = await fetch('/dashboard/api/buy', { method: 'POST', body: formData });
		if (res.status === 200) {
			res = await res.json();
			transactionStatus = res.transactionStatus;
		} else {
			transactionStatus = 'An error has occurred. Try again later.';
		}
	};
</script>

<Form onSubmit={fetchQuote} bind:form>
	<fieldset>
		<SymbolInput />
		<SharesInput />
	</fieldset>
	<Button type="submit">Buy</Button>
	quote: {transactionStatus}
</Form>
