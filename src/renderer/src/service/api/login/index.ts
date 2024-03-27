import { post } from '../../fetch';
import { CommonResponse, CreateUserApiParams, LoginApiParams, LoginApiResponse } from './interface';

export const CreateUser = (data: CreateUserApiParams): Promise<CommonResponse> => {
	return post(`/register`, data);
};

export const LoginApi = (data: LoginApiParams): Promise<LoginApiResponse> => {
	return post('/login', data);
};
