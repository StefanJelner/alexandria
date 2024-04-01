import classNames, { type Argument as ClassNamesArgument } from 'classnames';

export interface ComponentDefaults {
	class?: ClassNamesArgument;
	tabindex?: number | null;
}

export interface ReturnDefaults {
	class: string;
	tabindex: number;
}

export function getDefaults(
	$$restProps: SvelteRestProps,
	mergeProps: ComponentDefaults
): ReturnDefaults {
	return {
		class: classNames($$restProps.class ?? false, mergeProps.class ?? false),
		tabindex: $$restProps.tabindex ?? mergeProps.tabindex ?? null
	};
}
