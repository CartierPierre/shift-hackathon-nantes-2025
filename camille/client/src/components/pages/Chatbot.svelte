<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public"
	import type { Analysis } from "@camille/server/models/conversation-model"
	import { tick } from "svelte"
	import SuicidalPopup from "../SuicidalPopup.svelte"
	import { startWebRTCSession } from "./startWebRTCSession"

	let showKeyboard = $state(false)
	let isRecording = $state(false)
	let connection: RTCPeerConnection | null = null
	let channel: RTCDataChannel | null = null
	let audioElement: HTMLAudioElement
	let showSuicidalPopup = $state(false)

	const messageObject = $state<Record<string, { source: number; message: string }>>({})
	const messages = $derived(Object.values(messageObject))

	let messagesContainer: HTMLDivElement

	const scrollToBottom = () => {
		console.log("scrollToBottom", messagesContainer)
		if (messagesContainer) {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: "smooth",
			})
		}
	}

	// Add ResizeObserver to handle container size changes
	// $effect(() => {
	// 	console.log("messagesContainer")
	// 	if (!messagesContainer) return

	// 	const resizeObserver = new ResizeObserver(() => {
	// 		if (messages.length > 0) {
	// 			console.warn("NEW MESSAGES")
	// 			scrollToBottom()
	// 		}
	// 	})

	// 	resizeObserver.observe(messagesContainer)

	// 	return () => {
	// 		resizeObserver.disconnect()
	// 	}
	// })

	// $effect(() => {
	// 	if (messages.length > 0) {
	// 		scrollToBottom()
	// 	}
	// })

	$inspect(messageObject)
	$inspect(messages)

	async function startRecording() {
		try {
			const prompt = localStorage.getItem("prompt")
			console.log("Prompt:", prompt)
			const sessionResponse = await startWebRTCSession(
				prompt ? { instructions: prompt } : {},
			)
			const EPHEMERAL_KEY = sessionResponse.client_secret.value as string

			// Create a peer connection
			connection = new RTCPeerConnection()

			// Set up to play remote audio from the model
			connection.ontrack = e => {
				audioElement.srcObject = e.streams[0]
				audioElement.play()
			}

			// Add local audio track for microphone input
			const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
			connection.addTrack(ms.getTracks()[0])

			// Set up data channel for sending and receiving events
			channel = connection.createDataChannel("oai-events")
			channel.addEventListener("message", async event => {
				const response = JSON.parse(event.data)
				if (response.error) {
					console.error("Server error:", response.error)
					return
				}

				switch (response.type) {
					// case "conversation.item.input_audio_transcription.delta": {
					// 	console.log("Audio transcription delta:", response.delta)
					// 	break
					// }

					// case "input_audio_buffer.speech_started": {
					case "conversation.item.input_audio_transcription.delta": {
						if (!messageObject[response.item_id]) {
							console.warn("User starts talking!", response.item_id)
							messageObject[response.item_id] = {
								source: 0,
								message: "",
							}
						}
						break
					}

					case "conversation.item.input_audio_transcription.completed": {
						const transcript = response.transcript as string
						console.warn("User talks at item", response.item_id)
						messageObject[response.item_id].message = transcript
						tick().then(() => scrollToBottom())
						setTimeout(() => scrollToBottom(), 150)
						const analysisResponse = await fetch(`${PUBLIC_API_URL}/conversation`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ sentence: transcript, speakerId: 2 }),
						})
						const { analysis } = (await analysisResponse.json()) as { analysis: Analysis }
						if (analysis.thinkingAboutSuicide) {
							showSuicidalPopup = true
						}
						console.log("Analysis:", analysis)
						break
					}
					// case "response.created": {
					// 	messageObject[response.item_id] = {
					// 		source: 1,
					// 		message: "",
					// 	}
					// 	console.warn("AI starts talking at index")
					// 	break
					// }
					case "response.audio_transcript.delta": {
						const { delta, item_id } = response
						setTimeout(() => {
							if (!messageObject[item_id]) {
								messageObject[item_id] = {
									source: 1,
									message: "",
								}
								// TODO: stream text
								console.warn("Response starts!", response.item_id)
							}
						}, 1_000)
						break
					}
					case "response.audio_transcript.done": {
						console.warn("AI has talked")
						const transcript = response.transcript as string
						messageObject[response.item_id] ??= {
							source: 1,
							message: "",
						}
						messageObject[response.item_id].message = transcript
						tick().then(() => scrollToBottom())
						setTimeout(() => scrollToBottom(), 150)
						fetch(`${PUBLIC_API_URL}/conversation`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ sentence: transcript, speakerId: 1 }),
						})
						break
					}
				}
			})

			// Start the session using SDP
			const offer = await connection.createOffer()
			await connection.setLocalDescription(offer)

			const baseUrl = "https://api.openai.com/v1/realtime"
			const model = "gpt-4o-mini-realtime-preview"
			const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
				method: "POST",
				body: offer.sdp,
				headers: {
					Authorization: `Bearer ${EPHEMERAL_KEY}`,
					"Content-Type": "application/sdp",
				},
			})

			const sdp = await sdpResponse.text()

			console.log("SDP:", sdp)

			const answer = {
				type: "answer",
				sdp,
			} as RTCSessionDescriptionInit

			await connection.setRemoteDescription(answer)

			isRecording = true
		} catch (error) {
			console.error("Error starting WebRTC session:", error)
		}
	}

	function stopRecording() {
		if (connection) {
			connection.close()
			connection = null
		}
		if (channel) {
			channel.close()
			channel = null
		}
		isRecording = false
	}
</script>

<!-- <SuicidalPopup open /> -->
<SuicidalPopup open={showSuicidalPopup} />

<section class="chatbot">
	<div class="chat-container">
		<p class="catchline">{@html "Salut, t'as envie de parler&nbsp;?"}</p>
		<div class="messages-container" bind:this={messagesContainer}>
			<ul class="messages">
				{#each messages as { source, message }}
					{#if message}
						<li class="message {source === 0 ? 'user-message' : 'bot-message'}">
							<p class="content">{message}</p>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<div class="vocal">
			<button
				class="open-mic"
				aria-label="Ouvre le micro"
				class:recording={isRecording}
				onclick={isRecording ? stopRecording : startRecording}
			>
				<i class="fa-solid fa-microphone"></i>
			</button>
		</div>
	</div>
	<div class="write">
		<button
			class="open-keyboard"
			onclick={() => (showKeyboard = !showKeyboard)}
			aria-label="Ouvre le clavier"
		>
			<i class="fa-solid fa-keyboard"></i>
		</button>
		{#if showKeyboard}
			<div class="keyboard-input">
				<input type="text" placeholder="Écrivez votre message..." />
				<button
					class="send-message"
					aria-label="Envoyer le message"
					onclick={() => (showKeyboard = !showKeyboard)}
				>
					<i class="fa-solid fa-paper-plane"></i>
				</button>
			</div>
		{/if}
	</div>

	<audio bind:this={audioElement}></audio>
</section>

<style>
	.chatbot {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;

		.chat-container {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			border: 1px solid rgba(255, 255, 255, 0.225);
			padding-bottom: 76px;

			> * {
				padding-left: 20px;
				padding-right: 20px;
			}

			.catchline {
				font-size: 40px;
				font-weight: 800;
				text-align: center;
				line-height: 1.2;
				padding-top: 20px;
			}

			.messages-container {
				display: flex;
				flex-direction: column;
				overflow-y: auto;
				height: 100%;
				width: 100%;
				margin-top: 20px;

				.messages {
					list-style-type: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 12px;

					.message {
						padding: 10px;
						margin: 5px 0;
						max-width: 80%;
					}

					.user-message {
						background-color: #ffffff8e;
						border-radius: 12px 12px 0px 12px;
						align-self: flex-end;
						box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
					}

					.bot-message {
						background-color: #ffffff;
						border-radius: 12px 12px 12px 0px;
						align-self: flex-start;
						box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
					}

					.content {
						font-size: 16px;
					}
				}
			}

			.vocal {
				display: flex;
				justify-content: center;
				align-items: center;

				.open-mic {
					background-color: #ffffff;
					border-radius: 50%;
					width: 68px;
					height: 68px;
					padding: 10px;
					border: none;
					cursor: pointer;
					font-size: 24px;
					color: black;
					box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

					&.recording {
						color: white;
						background-color: rgb(199, 74, 74);
						box-shadow: 0 0 0 0 rgb(199, 74, 74);
					}
				}
			}
		}

		.write {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.open-keyboard {
				background-color: #ffffff;
				border-radius: 12px 12px 0px 0px;
				width: 100%;
				padding: 10px;
				border: none;
				cursor: pointer;
				font-size: 24px;
				color: black;
				box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
			}

			.keyboard-input {
				display: flex;
				width: 100%;
				padding: 16px 20px;
				background-color: #ffffff;
				gap: 12px;
				border-top: 1px solid rgba(0, 0, 0, 0.05);
				transition: all 0.3s ease;

				input {
					flex: 1;
					padding: 12px 16px;
					border: 2px solid #eef1f5;
					border-radius: 12px;
					font-size: 16px;
					background-color: #f8fafc;
					transition: all 0.2s ease;
					min-width: 0;

					&:focus {
						outline: none;
						border-color: #c7d2fe;
						background-color: #ffffff;
						box-shadow: 0 0 0 4px rgba(199, 210, 254, 0.2);
					}

					&::placeholder {
						color: #94a3b8;
					}
				}

				.send-message {
					background: rgba(255, 255, 255, 0.45)
						url("/src/assets/img/background-colors.png");
					background-size: 400%;
					background-position: center;
					-webkit-backdrop-filter: blur(8px);
					backdrop-filter: blur(8px);
					border: 1px solid rgba(255, 255, 255, 0.225);
					border-radius: 12px;
					padding: 12px;
					min-width: 50px;
					cursor: pointer;
					font-size: 18px;
					color: #1a1a1a;
					transition: all 0.2s ease;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
					position: relative;
					overflow: hidden;

					&::before {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: rgba(255, 255, 255, 0.45);
						backdrop-filter: blur(8px);
						-webkit-backdrop-filter: blur(8px);
						z-index: 0;
					}

					i {
						position: relative;
						z-index: 1;
					}

					&:hover {
						background-color: rgba(255, 255, 255, 0.6);
						transform: translateY(-1px);
						box-shadow: 0 6px 8px rgba(0, 0, 0, 0.08);

						&::before {
							background-color: rgba(255, 255, 255, 0.6);
						}
					}

					&:active {
						transform: translateY(1px);
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
					}
				}
			}
		}
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
		}
		70% {
			box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		}
	}
</style>
