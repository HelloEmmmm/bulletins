import { get } from '@renderer/service/fetch';
import { AllMessageResponse, GetWebSettingResponse, MessageResponse } from './interface';

export const GetTodayMessage = (): Promise<MessageResponse> => {
	return get(`/getTodayData`);
};

export const GetAllMessage = (): Promise<AllMessageResponse> => {
	return get(`/getAllData`);
};

export const GetWebSetting = (): Promise<GetWebSettingResponse> => {
	return get(`/getWebSetting`);
};
