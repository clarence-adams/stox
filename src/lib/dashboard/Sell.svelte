<script>
	import { user } from '$lib/stores.js';
	import Form from '$lib/dashboard/Form.svelte';
	import SymbolInput from '$lib/dashboard/SymbolInput.svelte';
	import SharesInput from '$lib/dashboard/SharesInput.svelte';
	import Button from '$lib/Button.svelte';
	import getUser from '$lib/dashboard/getUser.js';

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

		let res = await fetch('/dashboard/api/sell', { method: 'POST', body: formData });
		if (res.ok) {
			res = await res.json();
			const shareOrShares = res.transactionStatus.shares > 1 ? 'shares' : 'share';
			const resSymbol = res.transactionStatus.symbol.toUpperCase();
			const orderTotal = res.transactionStatus.orderTotal.toLocaleString();
			transactionStatus = `You sold ${res.transactionStatus.shares} ${shareOrShares} of ${resSymbol} for $${orderTotal}!`;
			// update user data store
			(async () => {
				const userData = await getUser();
				user.set(userData);
			})();
		} else if (res.status === 400) {
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
	<Button type="submit">Sell</Button>
	<p>{transactionStatus}</p>
</Form>
