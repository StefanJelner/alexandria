import classNames, { type Argument as ClassNamesArgument } from 'classnames';

export interface ComponentDefaults {
	class?: ClassNamesArgument;
}

export interface ReturnDefaults {
	class: string;
}

export function getDefaults(
	$$restProps: SvelteRestProps,
	mergeProps: ComponentDefaults
): ReturnDefaults {
	return {
		class: classNames($$restProps.class ?? false, mergeProps.class ?? false)
	};
}
