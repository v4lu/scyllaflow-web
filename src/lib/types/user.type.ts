export type User = {
	created_at: string;
	id: number;
	name?: string;
	profile_picture?: string | null;
	role: string;
};

export type AuthUser = {
	created_at: string;
	email: string;
	id: number;
	last_login: string;
	user_id: number;
};

export type UserResponse = {
	user: User;
	auth_user: AuthUser;
};
