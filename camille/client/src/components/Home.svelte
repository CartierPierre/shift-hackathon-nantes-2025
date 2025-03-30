<script lang="ts">
	import { swipe } from "svelte-gestures"
	import { fly } from "svelte/transition"
	import Analysis from "./pages/Analysis.svelte"
	import Chatbot from "./pages/Chatbot.svelte"
	import Info from "./pages/Info.svelte"

	let page = $state(2)

	function handleSwipe(event: CustomEvent) {
		if (event.detail.direction === "left" && page < 3) {
			page++
		} else if (event.detail.direction === "right" && page > 1) {
			page--
		}
		console.log("Current page:", page)
	}
</script>

<svelte:head>
	<style>
		body {
			margin: 0;
			overflow: hidden;
		}
	</style>
</svelte:head>

<section class="home">
	<!-- Main content -->
	<div class="home-content" use:swipe={() => ({})} onswipe={handleSwipe}>
		<div class="background"></div>
		<div class="glass">
			{#if page === 1}
				<div class="page">
					<Info />
				</div>
			{:else if page === 2}
				<div class="page">
					<Chatbot />
				</div>
			{:else if page === 3}
				<div class="page">
					<Analysis />
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.home {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.background {
		position: absolute;
		inset: 0 -20%;
		background-image: url("../assets/img/background-colors.png");
		background-position: center;
		background-size: 300%;
	}

	.home-content {
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
		height: 100%;
		width: 100%;
		position: relative;
	}

	.glass {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.45);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
	}

	.page {
		width: 100%;
		height: 100%;
	}

	/* For width larger than 420px */
	@media (min-width: 420px) {
		.home-content {
			max-width: 420px;
			height: 95%;
			border-radius: 16px;
			overflow: hidden;
		}
	}
</style>
