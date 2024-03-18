export interface CreateUserApiParams {
	invitation_code: string;
	username: string; // 6-20
	password: string; // 6-18 不包含特殊字符
	phone_number: string;
}
