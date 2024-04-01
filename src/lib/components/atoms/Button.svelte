<script context="module" lang="ts">
	export enum ButtonIconPosition {
		LEFT = 'left',
		RIGHT = 'right'
	}
</script>

<script lang="ts">
	import { getDefaults, type ComponentDefaults } from '$lib/helpers/defaults.helper';
	import { checkForSVG } from '$lib/helpers/svg.helper';
	// @ts-ignore
	import { get_current_component } from 'svelte/internal';

	// Typing props
	interface $$Props extends ComponentDefaults {
		text?: string;
		hideText?: boolean;
		iconPosition?: ButtonIconPosition;
		disabled?: boolean;
	}

	// Typing events
	interface $$Events {
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
	}

	// Typing slots
	interface $$Slots {
		icon: {};
	}

	// The input attributes
	export let text: string = '';
	export let hideText: boolean = false;
	export let iconPosition: ButtonIconPosition = ButtonIconPosition.LEFT;
	export let disabled: boolean = false;

	// Normal variables
	const component = get_current_component();

	/**
	 * Normalizes keydown event on button element
	 *
	 * Modern browsers transform enter or space on keydown into a click event. We prevent this unwanted behaviour
	 * here.
	 *
	 * @param e the keyboard event
	 */
	function normalizeKeydownEvent(e: KeyboardEvent): void {
		// Prevent click event
		if (['Enter', 'NumpadEnter', 'Space'].indexOf(e.code) !== -1) {
			e.preventDefault();
		}

		// Directly hand over the event without a custom event dispatcher
		(component.$$.callbacks.keydown ?? [])
			.slice()
			.forEach((callback: (e: KeyboardEvent) => void) => callback(e));
	}
</script>

<button
	{...getDefaults($$restProps, {
		class: [
			'button',
			$$slots.icon ? `button--has-icon button--has-icon--${iconPosition}` : false,
			hideText ? 'button--hide-text' : false
		]
	})}
	{disabled}
	on:click
	on:focus
	on:blur
	on:keydown={normalizeKeydownEvent}
	on:keyup
	on:keypress
>
	{#if $$slots.icon}
		<div class="button__icon" use:checkForSVG={[$$slots, 'icon', 'Button']}>
			<slot name="icon" />
		</div>
	{/if}
	{#if text.trim() !== ''}
		<div class="button__text">{text}</div>
	{/if}
</button>

<style lang="scss">
	.button {
		align-items: center;
		cursor: pointer;
		display: flex;
		flex: {
			direction: row;
			wrap: nowrap;
		}
		justify-content: center;
		padding: var(--button-padding);
		width: 100%;

		&[disabled] {
			cursor: not-allowed;
		}

		&__icon {
			height: var(--button-icon-height);
			margin-right: var(--button-icon-margin);
			width: 100%;

			:global(svg) {
				height: var(--button-icon-height);
				width: var(--button-icon-width);
			}
		}

		&--has-icon--right {
			flex-direction: row-reverse;
		}

		&--has-icon--left &__icon {
			text-align: right;
		}

		&--has-icon--right &__icon {
			margin: {
				right: 0;
				left: var(--button-icon-margin);
			}
			text-align: left;
		}

		&--hide-text &__icon {
			margin: 0;
			text-align: center;
		}

		&__text {
			text-align: center;
			width: 100%;
		}

		&--has-icon--left &__text {
			text-align: left;
		}

		&--has-icon--right &__text {
			text-align: right;
		}

		&--hide-text &__text {
			display: none;
		}
	}
</style>
