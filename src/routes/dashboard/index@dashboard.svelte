<script>
	import { cash } from '$lib/stores.js';
	export let user;

	$cash = user.cash;
</script>

<!-- welcome message -->
<h1 class="text-3xl font-bold">Welcome, {user.username}!</h1>

<!-- current history -->
<table>
	<thead>
		<th>Symbol</th>
		<th>Cost</th>
		<th>Shares</th>
	</thead>
</table>
