import { get } from '@renderer/service/fetch';
import { CreateUserApiParams } from './interface';

export const GetTodayMessage = (p) => {
	return get(`/getTodayData`, p);
};

export const GetAllMessage = (p) => {
	return get(`/getAllData`, p);
};
