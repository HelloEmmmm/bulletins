export interface ManagerInfo {
	id: number;
	phone: string;
	qq: string;
	remarks: string;
	wechat: string;
}

export interface MessageStruct {
	code: number;
	date: string;
	id: number;
	is_trial: 1 | 2;
	uid: number;
}

export interface MessageResponse {
	code: number;
	data: Pick<MessageStruct, 'date' | 'code'>[];
}

export interface AllMessageResponse {
	code: number;
	data: MessageStruct[];
}

export interface GetWebSettingResponse {
	code: number;
	data: ManagerInfo;
}

export interface Notice {
	id: number;
	message: string;
	created_at: string;
	type: 1 | 2;
	is_trial: 1 | 2;
}

export interface CommonResponse<T> {
	code: number;
	data: T;
}
