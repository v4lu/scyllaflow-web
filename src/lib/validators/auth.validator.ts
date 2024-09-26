import { z } from 'zod';

export const userLoginSchema = z.object({
	email: z.string().email('Please provide valid email address').trim(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
		.regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
		.regex(/\d/, 'Password must contain at least 1 number')
		.regex(/[@$!%*?&.]/, 'Password must contain at least 1 special character')
});

export type UserLoginSchema = typeof userLoginSchema;
export type UserLoginSchemaPayload = z.infer<typeof userLoginSchema>;
