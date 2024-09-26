import type { Component } from 'svelte';
import { icons, type IconProps } from '../icons';

export { default as CreateIssue } from './create-issuse.svelte';

type IconsType = typeof icons;
type PriorityIconName = keyof IconsType['priority'];
type StatusIconName = keyof IconsType['status'];

export type PriorityArrType = {
	IconName: PriorityIconName;
	Icon: Component<IconProps>;
};

export type StatusArrType = {
	IconName: StatusIconName;
	Icon: Component<IconProps>;
};

export const priorityArr: PriorityArrType[] = [
	{ IconName: 'Low', Icon: icons.priority.Low },
	{ IconName: 'Medium', Icon: icons.priority.Medium },
	{ IconName: 'High', Icon: icons.priority.High },
	{ IconName: 'Urgent', Icon: icons.priority.Urgent }
];

export const statusArr: StatusArrType[] = [
	{ IconName: 'Backlog', Icon: icons.status.Backlog },
	{ IconName: 'Todo', Icon: icons.status.Todo },
	{ IconName: 'InProgress', Icon: icons.status.InProgress },
	{ IconName: 'Check', Icon: icons.status.Check },
	{ IconName: 'Done', Icon: icons.status.Done },
	{ IconName: 'Cancelled', Icon: icons.status.Cancelled },
	{ IconName: 'Blocked', Icon: icons.status.Blocked }
];
