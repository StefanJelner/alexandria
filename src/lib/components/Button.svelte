<script context="module" lang="ts">
	export enum ButtonIconPosition {
		LEFT = 'left',
		RIGHT = 'right'
	}
</script>

<script lang="ts">
	import { getDefaults, type ComponentDefaults } from '$lib/helpers/defaults.helper';
	// @ts-ignore
	import { get_current_component } from 'svelte/internal';
	import type { ActionReturn } from 'svelte/action';

	// props
	interface $$Props extends ComponentDefaults {
		text?: string;
		hideText?: boolean;
		iconPosition?: ButtonIconPosition;
		disabled?: boolean;
	}

	// typing events
	interface $$Events {
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
	}

	// typing slots
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

	/**
	 * Checks if the icon slot contains only 1 element, which is an instance of SVGElement
	 *
	 * @param $icon the div element containing the icon slot
	 */
	function checkForSVG($icon: HTMLDivElement): ActionReturn {
		$$slots.icon = $icon.childElementCount === 1 && $icon.firstChild instanceof SVGElement;

		if ($$slots.icon === false) {
			console.error(
				`The icon slot for a Button component MUST contain a single SVG icon. Given content: ${$icon.innerHTML}`
			);
		}

		return {};
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
		<div class="button__icon" use:checkForSVG>
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

		&[disabled] {
			cursor: not-allowed;
		}

		&__icon {
			height: var(--button-icon-height);
			margin-right: var(--button-icon-margin);
			width: var(--button-icon-width);

			:global(svg) {
				height: 100%;
				width: 100%;
			}
		}

		&--has-icon--right {
			flex-direction: row-reverse;
		}

		&--has-icon--right &__icon {
			margin: {
				right: 0;
				left: var(--button-icon-margin);
			}
		}

		&--hide-text &__icon {
			margin: 0;
		}

		&--hide-text &__text {
			display: none;
		}
	}
</style>
