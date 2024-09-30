import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import ky, { type KyInstance } from 'ky';
import { CLIENT_BASE_URL, SERVER_BASE_URL } from './constants';

function getBaseUrl(): string {
	return browser ? CLIENT_BASE_URL : SERVER_BASE_URL;
}

export const api = ky.create({
	prefixUrl: getBaseUrl()
});

type RefreshResponse = {
	access_token: string;
	access_token_expiry: string;
};

export function authAPI(authToken: string): KyInstance {
	return ky.create({
		prefixUrl: getBaseUrl(),
		timeout: 10000,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		retry: {
			limit: 2,
			methods: ['get', 'post', 'put', 'delete', 'patch'],
			statusCodes: [500]
		}
	});
}

export function createAuthHeaders(token: string): Headers {
	return new Headers({
		Authorization: `Bearer ${token}`
	});
}

export async function refreshToken(refresh: string, cognitoId: string): Promise<RefreshResponse> {
	try {
		const res = await ky
			.post<RefreshResponse>(`${getBaseUrl()}/auth/refresh?id=${cognitoId}`, {
				headers: {
					'Refresh-Token': refresh
				}
			})
			.json();
		return res;
	} catch (error) {
		console.error('Failed to refresh token:', error);
		throw redirect(302, '/sign-in');
	}
}

type UploadImageType = {
	file: File | Blob | null;
	setImageUrl: (val: string) => void;
	setImageUploadLoading: (val: boolean) => void;
	authToken: string;
};

export async function uploadImage({
	authToken,
	file,
	setImageUploadLoading,
	setImageUrl
}: UploadImageType): Promise<void> {
	setImageUploadLoading(true);
	const formData = new FormData();
	if (file) {
		formData.append('file', file);
		try {
			const res = await api
				.post<{ url: string }>('file/image', {
					headers: {
						Authorization: `Bearer ${authToken}`
					},
					body: formData
				})
				.json();

			setImageUrl(res.url);
			setImageUploadLoading(false);
		} catch (error) {
			//TODO toast
			console.error(error);
		}
	}
}
