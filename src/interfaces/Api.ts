export interface ApiError {
	code : string;
	info : string;
	'*' : string;
};

export interface ApiResult {
	error? : ApiError;
};
