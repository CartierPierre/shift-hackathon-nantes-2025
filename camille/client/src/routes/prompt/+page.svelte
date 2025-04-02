<script>
	import { defaultPrompt } from "@camille/server/startWebRTCSession"

	let promptText = $state(localStorage.getItem("prompt") || defaultPrompt)

	$effect(() => {
		localStorage.setItem("prompt", promptText)
	})
</script>

<div class="container">
	<textarea
		bind:value={promptText}
		placeholder="Enter your prompt here..."
		rows="10"
		class="prompt-textarea"
	></textarea>
</div>

<style>
	.container {
		padding: 1rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.prompt-textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
	}

	.prompt-textarea:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}
</style>
