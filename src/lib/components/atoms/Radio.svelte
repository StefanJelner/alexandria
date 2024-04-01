<script context="module" lang="ts">
	export enum RadioLabelPosition {
		LEFT = 'left',
		RIGHT = 'right'
	}

	export enum RadioIconPosition {
		LEFT = 'left',
		RIGHT = 'right'
	}

	export interface RadioMethods {
		blur: () => void;
		checkValidity: (
			...args: Parameters<HTMLInputElement['checkValidity']>
		) => ReturnType<HTMLInputElement['checkValidity']>;
		focus: () => void;
		getChecked: () => boolean;
		reportValidity: (
			...args: Parameters<HTMLInputElement['reportValidity']>
		) => ReturnType<HTMLInputElement['reportValidity']>;
		setChecked: (checked: boolean) => void;
		setCustomValidity: (
			...args: Parameters<HTMLInputElement['setCustomValidity']>
		) => ReturnType<HTMLInputElement['setCustomValidity']>;
	}
</script>

<script lang="ts">
	import {
		getDefaults,
		type ComponentDefaults,
		type ReturnDefaults
	} from '$lib/helpers/defaults.helper';
	import { checkForSVG } from '$lib/helpers/svg.helper';
	// @ts-ignore
	import { get_current_component } from 'svelte/internal';
	import { v4 } from 'uuid';

	// Typing props
	interface $$Props extends ComponentDefaults {
		name?: string;
		value?: string;
		label?: string;
		hideLabel?: boolean;
		labelPosition?: RadioLabelPosition;
		checked?: boolean;
		iconPosition?: RadioIconPosition;
		disabled?: boolean;
		required?: boolean;
	}

	// Typing events
	interface $$Events {
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
		change: Event;
		invalid: Event;
	}

	// Typing slots
	interface $$Slots {
		checkedIcon: {};
		icon: {};
		uncheckedIcon: {};
	}

	// The input attributes
	export let name: string = '';
	export let value: string = '';
	export let label: string = '';
	export let hideLabel: boolean = false;
	export let labelPosition: RadioLabelPosition = RadioLabelPosition.LEFT;
	export let checked: boolean = false;
	export let iconPosition: RadioIconPosition = RadioIconPosition.LEFT;
	export let disabled: boolean = false;
	export let required: boolean = false;

	// Normal variables
	const component = get_current_component();
	const uuid = v4();
	let focused: boolean = false;
	let inputNode: HTMLInputElement;
	let defaults: ReturnDefaults;

	// Setting defaults
	$: defaults = getDefaults($$restProps, {
		class: [
			'radio',
			label.trim() !== '' ? `radio--has-label radio--has-label--${labelPosition}` : false,
			hideLabel ? 'radio--hide-label' : false,
			$$slots.icon ? `radio--has-icon radio--has-icon--${iconPosition}` : false,
			disabled ? 'radio--disabled' : false,
			required ? 'radio--required' : false,
			focused ? 'radio--focused' : false,
			$$slots.checkedIcon && $$slots.uncheckedIcon ? `radio--has-checked-unchecked` : false
		]
	});

	// Export methods for binding
	export const methods: RadioMethods = {
		blur: () => {
			inputNode.blur();
		},
		checkValidity: (...args) => {
			return inputNode.checkValidity(...args);
		},
		focus: () => {
			inputNode.focus();
		},
		getChecked: () => {
			return inputNode.checked;
		},
		reportValidity: (...args) => {
			return inputNode.reportValidity(...args);
		},
		// This method should usually not been used. It is only here for the sake of completion.
		setChecked: (checked) => {
			inputNode.checked = checked;
			inputNode.dispatchEvent(new Event('change'));
		},
		setCustomValidity: (...args) => {
			return inputNode.setCustomValidity(...args);
		}
	};

	/**
	 * Handles the focus event in a transparent way
	 *
	 * @param e the focus event
	 */
	function handleFocusEvent(e: FocusEvent): void {
		focused = true;

		// Directly hand over the event without a custom event dispatcher
		(component.$$.callbacks.focus ?? [])
			.slice()
			.forEach((callback: (e: FocusEvent) => void) => callback(e));
	}

	/**
	 * Handles the blur event in a transparent way
	 *
	 * @param e the focus event
	 */
	function handleBlurEvent(e: FocusEvent): void {
		focused = false;

		// Directly hand over the event without a custom event dispatcher
		(component.$$.callbacks.blur ?? [])
			.slice()
			.forEach((callback: (e: FocusEvent) => void) => callback(e));
	}
</script>

<div class={defaults.class}>
	<div class="radio__disabled-wrapper">
		{#if label.trim() !== ''}
			<label class="radio__label" for="radio-id-{uuid}">{label}</label>
		{/if}
		<div class="radio__input-wrapper">
			{#if $$slots.icon}
				<div class="radio__icon" use:checkForSVG={[$$slots, 'icon', 'Radio']}>
					<slot name="icon" />
				</div>
			{/if}
			<div class="radio__checked-unchecked-wrapper">
				<input
					bind:this={inputNode}
					class="radio__input"
					id={label.trim() !== '' ? `radio-id-${uuid}` : null}
					type="radio"
					name={name.trim() !== '' ? name : null}
					value={value.trim() !== '' ? value : null}
					{checked}
					tabindex={disabled ? -1 : defaults.tabindex}
					inert={disabled}
					{required}
					autocomplete="off"
					on:click
					on:focus={handleFocusEvent}
					on:blur={handleBlurEvent}
					on:keydown
					on:keyup
					on:keypress
					on:change
					on:invalid
				/>
				{#if $$slots.checkedIcon && $$slots.uncheckedIcon}
					<div class="radio__checked" use:checkForSVG={[$$slots, 'checkedIcon', 'Radio']}>
						<slot name="checkedIcon" />
					</div>
					<div class="radio__unchecked" use:checkForSVG={[$$slots, 'uncheckedIcon', 'Radio']}>
						<slot name="uncheckedIcon" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.radio {
		&__disabled-wrapper,
		&__input-wrapper {
			align-items: center;
			display: flex;
			flex: {
				direction: row;
				wrap: nowrap;
			}
			justify-content: flex-start;
		}

		&--disabled {
			cursor: not-allowed;
			opacity: 0.3;
		}

		&--disabled &__disabled-wrapper {
			pointer-events: none;
		}

		&__label {
			margin-right: var(--radio-label-margin);

			&::after {
				content: ':';
			}
		}

		&--has-label--right &__disabled-wrapper {
			flex-direction: row-reverse;
		}

		&--has-label--right &__label {
			margin: {
				right: 0;
				left: var(--radio-label-margin);
			}
		}

		&--required &__label::after {
			content: '*:';
		}

		&--hide-label &__label {
			display: none;
		}

		&__icon {
			height: var(--radio-icon-height);
			margin-right: var(--radio-icon-margin);
			width: var(--radio-icon-width);

			:global(svg) {
				height: var(--radio-icon-height);
				width: var(--radio-icon-width);
			}
		}

		&--has-icon--right &__input-wrapper {
			flex-direction: row-reverse;
		}

		&--has-icon--right &__icon {
			margin: {
				right: 0;
				left: var(--radio-icon-margin);
			}
		}

		&--has-checked-unchecked &__checked-unchecked-wrapper {
			height: var(--radio-checked-unchecked-height);
			overflow: hidden;
			position: relative;
			width: var(--radio-checked-unchecked-width);
		}

		&--has-checked-unchecked &__input,
		&__checked,
		&__unchecked {
			height: var(--radio-checked-unchecked-height);
			left: 0;
			position: absolute;
			top: 0;
			width: var(--radio-checked-unchecked-width);
		}

		&__input {
			appearance: radio;
		}

		&--has-checked-unchecked &__input {
			opacity: 0;
			z-index: 2;
		}

		&__checked,
		&__unchecked {
			z-index: 1;

			:global(svg) {
				height: var(--radio-checked-unchecked-height);
				width: var(--radio-checked-unchecked-width);
			}
		}

		&__checked {
			display: none;
		}

		&__unchecked {
			display: block;
		}

		&__input:checked ~ &__checked {
			display: block;
		}

		&__input:checked ~ &__unchecked {
			display: none;
		}
	}
</style>
