import { authAPI, catchErr } from '$lib/api';
import type {
	Comment,
	CommentResponse,
	Issue as IssueType,
	SubIssueRequest,
	UpdateIssuseRequest
} from '$lib/types/issue.type';
import { HTTPError } from 'ky';

type TParentIssue = {
	parent: IssueType;
	sub_issues: IssueType[];
};

type CommentRequest = {
	content: string;
	issue_id: number;
};

class Issue {
	error = $state(null);
	isLoading = $state(false);

	issue = $state<IssueType>();
	subIssues = $state<IssueType[]>([]);
	comments = $state<CommentResponse[]>([]);

	isSubmittingUpdate = $state(false);
	isCreatingSubIssue = $state(false);
	isCreatingComment = $state(false);
}

export function useIssue(authToken: string, id: number | undefined, slug: string, load = true) {
	const resp = new Issue();
	const api = authAPI(authToken);

	async function loadIssue() {
		resp.isLoading = true;

		const [res, err] = await catchErr(
			api.get<TParentIssue>(`issue/${slug}/${id}/sub-issues`).json()
		);

		if (res) {
			resp.issue = res.parent;
			resp.subIssues = res.sub_issues;
		}
		if (err instanceof HTTPError) {
			console.error(err.response);
		}

		resp.isLoading = false;
	}

	async function loadComments() {
		if (!id) return;
		resp.isLoading = true;

		const [res, err] = await catchErr(
			api.get<CommentResponse[]>(`comment/${slug}/issue/${id}`).json()
		);

		if (res) {
			resp.comments = res;
		}

		if (err instanceof HTTPError) {
			console.error(err.response);
		}

		resp.isLoading = false;
	}

	async function loadIssueAndComments() {
		resp.isLoading = true;
		const [issueRes, commentsRes] = await Promise.all([
			catchErr(api.get<TParentIssue>(`issue/${slug}/${id}/sub-issues`).json()),
			catchErr(api.get<CommentResponse[]>(`comment/${slug}/issue/${id}`).json())
		]);

		const [issue, issueErr] = issueRes;
		const [comments, commentsErr] = commentsRes;

		if (issue) {
			resp.issue = issue.parent;
			resp.subIssues = issue.sub_issues;
		}
		if (comments) {
			resp.comments = comments;
		}

		if (issueErr) console.error(issueErr.response);
		if (commentsErr) console.error(commentsErr.response);

		resp.isLoading = false;
	}

	async function updateIssue(issue: IssueType) {
		resp.isSubmittingUpdate = true;
		try {
			const payload: UpdateIssuseRequest = {
				title: issue.title,
				description: issue.description,
				status: issue.status,
				priority: issue.priority,
				dueDate: issue.dueDate
			};
			const response = await api
				.patch<IssueType>(`issue/${slug}/${id}`, {
					json: payload
				})
				.json();

			resp.issue = response;
			resp.isSubmittingUpdate = false;

			return response;
		} catch (error) {
			const e = error as HTTPError;
			console.error(e.response);

			resp.isSubmittingUpdate = false;
		}
	}

	async function createSubIssue(payload: SubIssueRequest) {
		if (!id) return;
		resp.isCreatingSubIssue = true;
		const [subtask, error] = await catchErr(
			api
				.post<IssueType>(`issue/${slug}/${id}/sub-issue`, {
					json: payload
				})
				.json()
		);

		if (subtask) {
			resp.subIssues = [...resp.subIssues, subtask];
		}
		if (error instanceof HTTPError) {
			console.error(error.response);
		}

		resp.isCreatingSubIssue = false;
	}

	async function commentIssue(content: string) {
		if (!id) return;

		resp.isCreatingComment = true;
		const payload: CommentRequest = {
			content,
			issue_id: id
		};
		const [res, err] = await catchErr(
			api
				.post<CommentResponse>(`comment/${slug}`, {
					json: payload
				})
				.json()
		);

		if (res) {
			resp.comments = [...resp.comments, res];
		}

		if (err instanceof HTTPError) {
			console.error(err.response);
		}
		resp.isCreatingComment = false;
	}

	if (load) loadIssueAndComments();

	return {
		updateIssue,
		commentIssue,
		resp,
		createSubIssue,
		loadComments,
		loadIssue
	};
}
