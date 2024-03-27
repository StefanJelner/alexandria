<script lang="ts">
	import '$lib/styles/custom-properties.scss';
	import '$lib/styles/normalize.scss';
	import Button, { ButtonIconPosition } from '$lib/components/Button.svelte';
	import TextInput, { TextInputIconPosition } from '$lib/components/TextInput.svelte';
</script>

<dl>
	<dt>button</dt>
	<dd><Button text="test"></Button></dd>

	<dt>button with classes</dt>
	<dd><Button text="test" class={['test1', 'test2 test3', { test4: true }]}></Button></dd>

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

	<dt>button with SVG icon left and hidden text</dt>
	<dd><Button text="test" hideText={true}><svg slot="icon"></svg></Button></dd>

	<dt>text input</dt>
	<dd><TextInput></TextInput></dd>

	<dt>text input with label</dt>
	<dd><TextInput label="Test"></TextInput></dd>
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
