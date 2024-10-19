import { z } from 'zod';

export const userLoginSchema = z.object({
	email: z.string().email('Please provide valid email address').trim()
});

export type UserLoginSchema = typeof userLoginSchema;
export type UserLoginSchemaPayload = z.infer<typeof userLoginSchema>;
