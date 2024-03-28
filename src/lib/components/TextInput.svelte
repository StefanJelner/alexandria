<script context="module" lang="ts">
	export enum TextInputIconPosition {
		LEFT = 'left',
		RIGHT = 'right'
	}

	/**
	 * All autocomplete values
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
	 */
	export type TextInputAutocomplete =
		| 'on'
		| 'off'
		| 'name'
		| 'honorific-prefix'
		| 'given-name'
		| 'additional-name'
		| 'family-name'
		| 'honorific-suffix'
		| 'nickname'
		| 'email'
		| 'username'
		| 'new-password'
		| 'current-password'
		| 'one-time-code'
		| 'organization-title'
		| 'organization'
		| 'street-address'
		| 'address-line1'
		| 'address-line2'
		| 'address-line3'
		| 'address-level1'
		| 'address-level2'
		| 'address-level3'
		| 'address-level4'
		| 'country'
		| 'country-name'
		| 'postal-code'
		| 'cc-name'
		| 'cc-given-name'
		| 'cc-additional-name'
		| 'cc-family-name'
		| 'cc-number'
		| 'cc-exp'
		| 'cc-exp-month'
		| 'cc-exp-year'
		| 'cc-csc'
		| 'cc-type'
		| 'transaction-currency'
		| 'transaction-amount'
		| 'language'
		| 'bday'
		| 'bday-day'
		| 'bday-month'
		| 'bday-year'
		| 'sex'
		| 'tel'
		| 'tel-country-code'
		| 'tel-national'
		| 'tel-area-code'
		| 'tel-local'
		| 'tel-extension'
		| 'impp'
		| 'url'
		| 'photo';

	export interface TextInputMethods {
		blur: () => void;
		checkValidity: (
			...args: Parameters<HTMLInputElement['checkValidity']>
		) => ReturnType<HTMLInputElement['checkValidity']>;
		empty: () => void;
		focus: () => void;
		getValue: () => string;
		reportValidity: (
			...args: Parameters<HTMLInputElement['reportValidity']>
		) => ReturnType<HTMLInputElement['reportValidity']>;
		select: (
			...args: Parameters<HTMLInputElement['select']>
		) => ReturnType<HTMLInputElement['select']>;
		setCustomValidity: (
			...args: Parameters<HTMLInputElement['setCustomValidity']>
		) => ReturnType<HTMLInputElement['setCustomValidity']>;
		setRangeText: (
			...args: Parameters<HTMLInputElement['setRangeText']>
		) => ReturnType<HTMLInputElement['setRangeText']>;
		setSelectionRange: (
			...args: Parameters<HTMLInputElement['setSelectionRange']>
		) => ReturnType<HTMLInputElement['setSelectionRange']>;
		setValue: (value: string) => void;
	}
</script>

<script lang="ts">
	import { getDefaults, type ComponentDefaults } from '$lib/helpers/defaults.helper';
	// @ts-ignore
	import { get_current_component } from 'svelte/internal';
	import type { ActionReturn } from 'svelte/action';
	import { v4 } from 'uuid';
	// @ts-ignore
	import { debounce } from 'throttle-debounce';

	// props
	interface $$Props extends ComponentDefaults {
		label?: string;
		hideLabel?: boolean;
		placeholder?: string;
		iconPosition?: TextInputIconPosition;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		pattern?: string;
		autocomplete?: TextInputAutocomplete;
		spellcheck?: boolean;
		minlength?: number;
		maxlength?: number;
		datalist?: Array<string>;
		debounceInputEvent?: number;
	}

	// typing events
	interface $$Events {
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
		change: Event;
		input: Event;
		invalid: Event;
	}

	// typing slots
	interface $$Slots {
		icon: {};
	}

	// The input attributes
	export let label: string = '';
	export let hideLabel: boolean = false;
	export let placeholder: string = '';
	export let iconPosition: TextInputIconPosition = TextInputIconPosition.LEFT;
	export let disabled: boolean = false;
	export let readonly: boolean = false;
	export let required: boolean = false;
	export let pattern: string = '';
	export let autocomplete: TextInputAutocomplete = 'off';
	export let spellcheck: boolean = false;
	export let minlength: number = -1;
	export let maxlength: number = -1;
	export let datalist: Array<string> = [];
	export let debounceInputEvent: number = 400;

	// Normal variables
	const component = get_current_component();
	const uuid = v4();
	let focused: boolean = false;
	let inputNode: HTMLInputElement;

	// export methods for binding
	export const methods: TextInputMethods = {
		blur: () => {
			inputNode.blur();
		},
		checkValidity: (...args) => {
			return inputNode.checkValidity(...args);
		},
		empty: () => {
			inputNode.value = '';
		},
		focus: () => {
			inputNode.focus();
		},
		getValue: () => {
			return inputNode.value;
		},
		reportValidity: (...args) => {
			return inputNode.reportValidity(...args);
		},
		select: (...args) => {
			return inputNode.select(...args);
		},
		setCustomValidity: (...args) => {
			return inputNode.setCustomValidity(...args);
		},
		setRangeText: (...args) => {
			return inputNode.setRangeText(...args);
		},
		setSelectionRange: (...args) => {
			return inputNode.setSelectionRange(...args);
		},
		setValue: (value) => {
			inputNode.value = value;
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

	/**
	 * Handles the input event in a transparent way
	 *
	 * @param e the input event
	 */
	function handleInputEvent(e: Event): void {
		// Directly hand over the event without a custom event dispatcher
		(component.$$.callbacks.input ?? [])
			.slice()
			.forEach((callback: (e: Event) => void) => callback(e));
	}

	// debounce the input event handler if necessary (in a reactive way)
	let debouncedHandleInputEvent = handleInputEvent;
	$: debouncedHandleInputEvent =
		debounceInputEvent <= 0 ? handleInputEvent : debounce(debounceInputEvent, handleInputEvent);

	/**
	 * Checks if the icon slot contains only 1 element, which is an instance of SVGElement
	 *
	 * @param $icon the div element containing the icon slot
	 */
	function checkForSVG($icon: HTMLDivElement): ActionReturn {
		$$slots.icon = $icon.childElementCount === 1 && $icon.firstChild instanceof SVGElement;

		if ($$slots.icon === false) {
			console.error(
				`The icon slot for a TextInput component MUST contain a single SVG icon. Given content: ${$icon.innerHTML}`
			);
		}

		return {};
	}
</script>

<div
	{...getDefaults($$restProps, {
		class: [
			'textinput',
			$$slots.icon ? `textinput--has-icon textinput--has-icon--${iconPosition}` : false,
			hideLabel ? 'textinput--hide-label' : false,
			disabled ? 'textinput--disabled' : false,
			readonly ? 'textinput--readonly' : false,
			required ? 'textinput--required' : false,
			datalist.length > 0 ? 'textinput--has-datalist' : false,
			focused ? 'textinput--focused' : false
		]
	})}
>
	<div class="textinput__disabled-wrapper">
		{#if label.trim() !== ''}
			<label class="textinput__label" for="textinput-id-{uuid}">{label}</label>
		{/if}
		<div class="textinput__input-wrapper">
			{#if $$slots.icon}
				<div class="textinput__icon" use:checkForSVG>
					<slot name="icon" />
				</div>
			{/if}
			<input
				bind:this={inputNode}
				class="textinput__input"
				id={label.trim() !== '' ? `textinput-id-${uuid}` : null}
				type="text"
				placeholder={placeholder.trim() !== '' ? placeholder : null}
				{readonly}
				tabindex={disabled ? -1 : null}
				inert={disabled}
				{required}
				pattern={pattern.trim() !== '' ? pattern : null}
				{autocomplete}
				{spellcheck}
				minlength={minlength >= 0 ? minlength : null}
				maxlength={maxlength >= 0 ? maxlength : null}
				list={datalist.length > 0 ? `textinput-datalist-${uuid}` : null}
				on:click
				on:focus={handleFocusEvent}
				on:blur={handleBlurEvent}
				on:keydown
				on:keyup
				on:keypress
				on:change
				on:input={debouncedHandleInputEvent}
				on:invalid
			/>
			{#if datalist.length > 0}
				<datalist id="textinput-datalist-{uuid}">
					{#each datalist as value}
						<option {value}></option>
					{/each}
				</datalist>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.textinput {
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
			margin-right: var(--textinput-label-margin);

			&::after {
				content: ':';
			}
		}

		&--required &__label::after {
			content: '*:';
		}

		&--hide-label &__label {
			display: none;
		}

		&__input-wrapper {
			border: var(--textinput-border);
			width: 100%;
		}

		&__icon {
			height: var(--textinput-icon-height);
			margin-right: var(--textinput-icon-margin);
			width: var(--textinput-icon-width);

			:global(svg) {
				height: var(--textinput-icon-height);
				width: var(--textinput-icon-width);
			}
		}

		&--has-icon--right &__input-wrapper {
			flex-direction: row-reverse;
		}

		&--has-icon--right &__icon {
			margin: {
				right: 0;
				left: var(--textinput-icon-margin);
			}
		}

		&__input {
			border: 0;
			height: var(--textinput-icon-height);
			width: 100%;
		}
	}
</style>
