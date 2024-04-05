export interface CreateUserApiParams extends LoginApiParams {
	phone_number: string;
}

export interface CommonResponse {
	code: number;
	msg: string;
}

export interface LoginApiParams {
	username: string; // 6-20
	password: string; // 6-18 不包含特殊字符
}

export interface LoginApiResponse extends CommonResponse {
	token: string;
}
