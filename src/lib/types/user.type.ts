export type User = {
	aws_cognito_id: string;
	created_at: string;
	id: number;
	name: string;
	profile_picture?: string | null;
	username: string;
	verified: boolean;
};
