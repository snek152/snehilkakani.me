import { projectUrls } from '$lib/projectUrls';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return Object.hasOwn(projectUrls, param);
};
