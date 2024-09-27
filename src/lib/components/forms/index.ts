import type { Component } from 'svelte';
import { Icons, type IconProps } from '../icons';

export { default as CreateIssue } from './create-issuse.svelte';

type IconsType = typeof Icons;
export type PriorityIconName = keyof IconsType['priority'];
export type StatusIconName = keyof IconsType['status'];

export type PriorityArrType = {
	IconName: PriorityIconName;
	Icon: Component<IconProps>;
};

export type StatusArrType = {
	IconName: StatusIconName;
	Icon: Component<IconProps>;
};

export const priorityArr: PriorityArrType[] = [
	{ IconName: 'Low', Icon: Icons.priority.Low },
	{ IconName: 'Medium', Icon: Icons.priority.Medium },
	{ IconName: 'High', Icon: Icons.priority.High },
	{ IconName: 'Urgent', Icon: Icons.priority.Urgent }
];

export const statusArr: StatusArrType[] = [
	{ IconName: 'Backlog', Icon: Icons.status.Backlog },
	{ IconName: 'Todo', Icon: Icons.status.Todo },
	{ IconName: 'InProgress', Icon: Icons.status.InProgress },
	{ IconName: 'Check', Icon: Icons.status.Check },
	{ IconName: 'Done', Icon: Icons.status.Done },
	{ IconName: 'Cancelled', Icon: Icons.status.Cancelled },
	{ IconName: 'Blocked', Icon: Icons.status.Blocked }
];
