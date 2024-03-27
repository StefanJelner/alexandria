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
</script>

<script lang="ts">
	import classNames, { type Argument as ClassNamesArgument } from 'classnames';
	// @ts-ignore
	import { get_current_component } from 'svelte/internal';
	import type { ActionReturn } from 'svelte/action';
	import { v4 } from 'uuid';

	// typing events
	interface $$Events {
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
		change: Event;
		input: InputEvent;
	}

	// typing slots
	interface $$Slots {
		icon: {};
	}

	// The input attributes

	// little trick for using the reserved word "class"
	let className: ClassNamesArgument = {};
	export { className as class };

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

	// Normal variables
	const component = get_current_component();
	const uuid = v4();
	let focused: boolean = false;

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
	class={classNames(
		'textinput',
		$$slots.icon ? `textinput--has-icon textinput--has-icon--${iconPosition}` : false,
		hideLabel ? 'textinput--hide-label' : false,
		disabled ? 'textinput--disabled' : false,
		readonly ? 'textinput--readonly' : false,
		required ? 'textinput--required' : false,
		datalist.length > 0 ? 'textinput--has-datalist' : false,
		focused ? 'textinput--focused' : false,
		className
	)}
>
	{#if label.trim() !== ''}
		<label class="textinput__label" for="textinput-id-{uuid}">{label}</label>
	{/if}
	<div class="textinput__wrapper">
		{#if $$slots.icon}
			<div class="textinput__icon" use:checkForSVG>
				<slot name="icon" />
			</div>
		{/if}
		<input
			class="textinput__input"
			id={label.trim() !== '' ? `textinput-id-${uuid}` : null}
			type="text"
			placeholder={placeholder.trim() !== '' ? placeholder : null}
			{readonly}
			{disabled}
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
			on:input
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

<style lang="scss">
	.textinput {
		align-items: center;
		display: flex;
		flex: {
			direction: row;
			wrap: nowrap;
		}
		justify-content: flex-start;

		&__label {
			margin-right: var(--textinput-label-margin);

			&::after {
				content: ':';
			}
		}

		&--required &__label::after {
			content: '*:';
		}

		&__icon {
			height: var(--button-icon-height);
			width: var(--button-icon-width);

			:global(svg) {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>
