import { get } from '@renderer/service/fetch';
import {
	AllMessageResponse,
	CommonResponse,
	GetWebSettingResponse,
	MessageResponse,
	Notice,
	UserInfo,
} from './interface';
import { post } from '../../fetch';

export const GetTodayMessage = (): Promise<MessageResponse> => {
	return get(`/getTodayData`);
};

export const GetAllMessage = (): Promise<AllMessageResponse> => {
	return get(`/getAllData`);
};

export const GetWebSetting = (): Promise<GetWebSettingResponse> => {
	return get(`/getWebSetting`);
};

export const GetLastNotice = (): Promise<CommonResponse<Notice>> => {
	return get(`/getDayNotice`);
};

export const GetAllNotice = (): Promise<CommonResponse<Notice[]>> => {
	return get(`/getNoticeList`);
};

export const GetPersonalInfo = (): Promise<CommonResponse<UserInfo>> => {
	return get('/getPersonalInfo');
};

export const Grouping = (data: { client_id: string }): Promise<CommonResponse<UserInfo>> => {
	return post('/updateGroupUser', data);
};
