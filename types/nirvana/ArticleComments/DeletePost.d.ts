export interface Request {
	controller: 'ArticleComments',
	method: 'deletePost',
	namespace: number,
	title: string,
	postId: `${ bigint }`,
	suppressContent: 'true' | 'false',
	token: string
}

// 200: "[]"
export interface Response {}
