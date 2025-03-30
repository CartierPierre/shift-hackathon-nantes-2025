<script lang="ts">
	import { fly } from "svelte/transition"

	let { open = $bindable(false) } = $props()
</script>

{#if open}
	<div class="suicidal-popup" in:fly={{ y: -50, duration: 100 }}>
		<p>Si vous avez des pensées suicidaires, ne restez pas seul•e.</p>

		<div class="actions">
			<button class="close" onclick={() => (open = false)}>Fermer</button>
			<button class="call" onclick={() => (window.location.href = "tel:3114")}
				>Appeler 3114</button
			>
		</div>

		<div class="emergency-contact">
			<p class="description">Numéro national de prévention du suicide</p>

			<p class="support-text">
				Des professionnels bienveillants sont là pour vous accompagner et vous aider à
				traverser ce moment difficile.
			</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.suicidal-popup {
		position: fixed;
		inset: 16px;
		bottom: unset;
		background-color: white;
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 13px;
		z-index: 1;
	}

	.actions {
		display: flex;
		gap: 8px;
		justify-content: space-between;

		> button {
			border: none;
			padding: 8px;
			border-radius: 8px;
			cursor: pointer;
		}
	}

	.close {
		flex: 1;
		border: 1px solid #333;

		&:hover {
			background-color: #d9d9d9;
		}
	}

	.call {
		flex: 2;
		background-color: #fc8e9d;

		&:hover {
			background-color: #ff7a8bff;
		}
	}

	.emergency-contact {
		font-size: 10px;
	}
</style>
