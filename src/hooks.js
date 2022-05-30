import * as cookie from 'cookie';

export const getSession = (event) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.authToken = cookies['authToken'];
	return event.locals.authToken ? { authToken: event.locals.authToken } : {};
};
