import type { ActionReturn } from 'svelte/action';

/**
 * Checks if the icon slot contains only 1 element, which is an instance of SVGElement
 *
 * @param $el the HTML element containing the icon slot
 * @param params an array consisting of $$slots, the slot name and the component name
 * @returns an empty object
 */
export function checkForSVG(
	$el: HTMLElement,
	[$$slots, slotName, componentName]: [Record<string, any>, string, string]
): ActionReturn {
	if (slotName in $$slots) {
		$$slots[slotName] = $el.childElementCount === 1 && $el.firstChild instanceof SVGElement;

		if ($$slots[slotName] === false) {
			console.error(
				`The slot "${slotName}" for the "${componentName}" component MUST contain a single SVG icon. Given content: ${$el.innerHTML}`
			);
		}
	}

	return {};
}
