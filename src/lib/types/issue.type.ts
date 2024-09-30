export type Issue = {
	id: number;
	custom_id: string;
	createdAt: string;
	title: string;
	description?: string;
	status: 'Backlog' | 'Todo' | 'InProgress' | 'Check' | 'Done' | 'Cancelled' | 'Blocked';
	priority: 'Low' | 'Medium' | 'High' | 'Urgent';
	dueDate: string;
	version: number;
	workspace_id: number;
};

export type CreateIssue = {
	title: string;
	priority: string;
	status: string;
	dueDate: Date | null;
	description: Object;
};
