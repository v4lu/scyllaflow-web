export type Issue = {
	id: number;
	custom_id: string;
	createdAt: string;
	title: string;
	status: string;
	priority: string;
	dueDate: string;
	version: number;
	workspace_id: number;
};

export type CreateIssue = {
	title: string;
	priority: string;
	status: string;
};
