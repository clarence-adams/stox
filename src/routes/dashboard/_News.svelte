<script>
	import { news } from '$lib/stores';
	import CardWrapper from '$lib/CardWrapper.svelte';
</script>

<CardWrapper header="News" fixedWidth={false}>
	{#if $news === undefined}
		<p>Loading...</p>
	{:else if $news === null}
		<p>No news to report!</p>
	{:else if $news === 'error'}
		<p>API request limit has been reached for the day. Come back for more news tomorrow!</p>
	{:else}
		<div class="flex w-full snap-x gap-8 overflow-x-auto">
			{#each $news.news.data as news}
				<article class="w-full flex-shrink-0 snap-center overflow-hidden">
					<h3 class="border-gray-150 mb-4 border-b-2 pb-2 font-bold dark:border-gray-700">
						{news.title}
					</h3>
					<img src={news.image_url} alt="" class="float-left mr-4 mb-4 max-h-full max-w-full" />
					<p class="mb-4">
						{news.snippet}
						<a
							href={news.url}
							target="_blank"
							class="underline decoration-emerald-300 dark:text-emerald-300">Read More</a
						>
					</p>
					<footer class="mb-3 flex flex-col text-sm">
						<p>Source: {news.source}</p>
						<time date={news.published_at.substring(0, 10)}
							>Posted: {news.published_at.substring(0, 10)}</time
						>
					</footer>
				</article>
			{/each}
		</div>
	{/if}
</CardWrapper>
