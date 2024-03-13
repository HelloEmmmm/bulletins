import { post } from '../../fetch';
import { CreateUserApiParams } from './interface';

export const CreateUser = (data: CreateUserApiParams) => {
	return post(`/register`, data);
};
