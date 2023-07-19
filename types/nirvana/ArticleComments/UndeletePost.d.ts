export interface Request {
	controller: 'ArticleComments',
	method: 'undeletePost',
	namespace: number,
	title: string,
	postId: `${ bigint }`,
	token: string
}

// 200: "[]"
export interface Response {}
