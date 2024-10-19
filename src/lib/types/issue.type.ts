import type { User } from './user.type';

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
	tags?: Tag[];
};

export type CreateIssue = {
	title: string;
	priority: string;
	status: string;
	dueDate: Date | null;
	description: string;
	tag_ids?: number[];
	project_id?: number;
};

export type UpdateIssuseRequest = {
	title: string;
	description?: string;
	status: string;
	priority: string;
	dueDate?: string;
};

export type CreateTag = {
	name: string;
	color: string;
};

export type Tag = {
	id: number;
	name: string;
	color: string;
	workspace_id: number;
	createdAt: string;
};

export type CreateProject = {
	name: string;
};

export type Project = {
	id: number;
	name: string;
	color?: string;
	description?: string;
	createdAt: string;
};

export type SubIssueRequest = {
	assigned_user_ids?: number[];
	description?: string;
	dueDate: Date | null;
	priority: string;
	status: string;
	tag_ids?: number[];
	title: string;
};

export type Comment = {
	content: string;
	created_at: string;
	issue_id: number;
	id: number;
	created_by: number;
};

export type CommentResponse = {
	comment: Comment;
	user: User;
};
