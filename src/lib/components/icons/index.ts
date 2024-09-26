import High from './priorirty/high.svelte';
import Low from './priorirty/low.svelte';
import Medium from './priorirty/medium.svelte';
import Urgent from './priorirty/urgent.svelte';
import Backlog from './status/backlog.svelte';
import Blocked from './status/blocked.svelte';
import Cancelled from './status/cancelled.svelte';
import Check from './status/check.svelte';
import Done from './status/done.svelte';
import InProgress from './status/in-progress.svelte';
import Todo from './status/todo.svelte';

export type IconProps = {
	color?: string;
	size?: number | string;
	strokeWidth?: number | string;
	absoluteStrokeWidth?: boolean;
	class?: string;
} & Partial<SVGSVGElement>;

export const icons = {
	priority: {
		Low,
		Medium,
		High,
		Urgent
	},
	status: {
		Backlog,
		Todo,
		InProgress,
		Check,
		Done,
		Cancelled,
		Blocked
	}
};
