<script lang="ts">
	import '$lib/styles/custom-properties.scss';
	import '$lib/styles/normalize.scss';
	import Button, { ButtonIconPosition } from '$lib/components/Button.svelte';
	import TextInput, {
		TextInputIconPosition,
		type TextInputMethods
	} from '$lib/components/TextInput.svelte';

	const testClasses = ['test1', 'test2 test3', { test4: true }];
	let textInputMethods: TextInputMethods;
</script>

<dl>
	<dt>button</dt>
	<dd><Button text="test"></Button></dd>

	<dt>button with classes</dt>
	<dd><Button text="test" class={testClasses}></Button></dd>

	<dt>disabled button</dt>
	<dd><Button text="test" disabled={true}></Button></dd>

	<dt>button with click event</dt>
	<dd><Button text="test" on:click={console.log}></Button></dd>

	<dt>button with normalized onkeydown event</dt>
	<dd><Button text="test" on:keydown={console.log}></Button></dd>

	<dt>button with SVG icon left</dt>
	<dd><Button text="test"><svg slot="icon"></svg></Button></dd>

	<dt>button with SVG icon right</dt>
	<dd>
		<Button text="test" iconPosition={ButtonIconPosition.RIGHT}><svg slot="icon"></svg></Button>
	</dd>

	<dt>button with wrong icon</dt>
	<dd><Button text="test"><div slot="icon"></div></Button></dd>

	<dt>button with SVG icon and hidden text</dt>
	<dd><Button text="test" hideText={true}><svg slot="icon"></svg></Button></dd>

	<dt>text input</dt>
	<dd><TextInput></TextInput></dd>

	<dt>text input with classes</dt>
	<dd><TextInput class={testClasses}></TextInput></dd>

	<dt>text input with label</dt>
	<dd><TextInput label="Test"></TextInput></dd>

	<dt>text input with hidden label</dt>
	<dd><TextInput label="Test" hideLabel={true}></TextInput></dd>

	<dt>disabled text input (with label and icon)</dt>
	<dd><TextInput label="Test" disabled={true}><svg slot="icon"></svg></TextInput></dd>

	<dt>text input with placeholder</dt>
	<dd><TextInput placeholder="Enter text here..."></TextInput></dd>

	<dt>text input with label, icon and placeholder</dt>
	<dd>
		<TextInput label="Test" placeholder="Enter text here..."><svg slot="icon"></svg></TextInput>
	</dd>

	<dt>text input with label, icon right and placeholder</dt>
	<dd>
		<TextInput
			label="Test"
			placeholder="Enter text here..."
			iconPosition={TextInputIconPosition.RIGHT}><svg slot="icon"></svg></TextInput
		>
	</dd>

	<dt>text input with datalist</dt>
	<dd><TextInput datalist={['foo', 'bar', 'baz', 'quox', 'waldo']}></TextInput></dd>

	<dt>text input with input event</dt>
	<dd><TextInput on:input={console.log}></TextInput></dd>

	<dt>text input with input event undebounced</dt>
	<dd><TextInput on:input={console.log} debounceInputEvent={0}></TextInput></dd>

	<dt>text input with button to focus the input element</dt>
	<dd>
		<TextInput bind:methods={textInputMethods}></TextInput><Button
			text="focus"
			on:click={() => textInputMethods.focus()}
		></Button>
	</dd>
</dl>

<style lang="scss">
	:global(body) {
		font: {
			family: Verdana, Helvetica, sans-serif;
		}
	}

	dt,
	dd {
		margin: 1rem;
	}

	dt {
		border-bottom: 1px solid black;
	}

	dd {
		margin-bottom: 4rem;
	}
</style>
