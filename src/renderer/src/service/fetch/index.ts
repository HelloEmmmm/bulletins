import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
	interface AxiosInstance {
		(config: AxiosRequestConfig): Promise<any>;
	}
}

const authCode = [401, 403];

const CancelToken = axios.CancelToken;

export const cancelTokenMap: Record<'get', { [key: string]: Record<string, any> }> = { get: {} };

const service = axios.create({
	baseURL: 'http://39.105.204.185:8787',
	timeout: 10000,
	headers: {
		Authorization: localStorage.getItem('token')
			? `Bearer ${localStorage.getItem('token')}`
			: undefined,
	},
});

service.interceptors.request.use(
	(config) => {
		config.headers.Authorization = localStorage.getItem('token')
			? `Bearer ${localStorage.getItem('token')}`
			: undefined;
		return config;
	},
	(error) => {
		Promise.reject(error).then((r) => console.log(r));
	}
);

service.interceptors.response.use(
	(response) => {
		const data = response.data;
		const code = data.code;
		if (authCode.includes(code)) {
			window.location.href = '#/login';
			//todo
		} else {
			//todo
		}
		return data;
	},
	(error) => {
		if (error.response) {
			const res = error.response;
			const status = res.status;
			switch (status) {
				case 401:
					// todo
					break;
				case 504:
					// todo
					break;
				default:
					// todo
					break;
			}
		}
		if (
			error &&
			error.code &&
			error.message &&
			error.code === 'ECONNABORTED' &&
			error.message.indexOf('timeout') !== -1
		) {
			console.log('请求超时。', error.message);
		}
		return Promise.reject(error);
	}
);

const get = (url: string, params?: { [key: string]: any }, _cancelToken = false, header = {}) => {
	const _config: AxiosRequestConfig = {
		url: url,
		method: 'get',
		headers: {
			...header,
		},
	};
	if (params) {
		if (params.hasOwnProperty.call(params, 'data') && params.hasOwnProperty.call(params, 'json')) {
			_config['data'] = params.data;
		} else {
			_config['params'] = params;
		}
		if (_cancelToken) {
			let _key = url;
			const _arr: string[] = [];
			const entries = Object.entries(params);
			for (const [key, value] of entries) {
				_arr.push(key + '=' + value);
			}
			_key = _key + '?' + _arr.join('&');
			let _token = cancelTokenMap?.['get']?.[_key];
			if (!_token && cancelTokenMap) {
				cancelTokenMap['get'][_key] = {};
				_token = cancelTokenMap['get'][_key];
			}
			_token['token'] =
				_token['token'] ||
				new CancelToken(function executor(c) {
					// executor 函数接收一个 cancel 函数作为参数
					_token['cancel'] = c;
				});
			_token['count'] = _token['count'] ? _token['count'] + 1 : 1;
			_config['cancelToken'] = _token['token'];
		}
	}
	return service(_config);
};

const post = (url: string, data = {}) => {
	const _config: AxiosRequestConfig = {
		url: url,
		method: 'post',
		data,
	};
	return service(_config);
};

const put = (url: string, data = {}, header = {}): Promise<AxiosResponse> => {
	const _config = {
		url: url,
		method: 'put',
		data,
		headers: {
			...header,
		},
	};
	return service(_config);
};

const _delete = (url: string, data = {}, header = {}) => {
	const _config = {
		url: url,
		method: 'delete',
		data,
		headers: {
			...header,
		},
	};
	return service(_config);
};

const cancelAxiosToken = (url: string, params = {}, type: string | number): void => {
	if (type) {
		const item = cancelTokenMap[type];
		let _key = url;
		const _arr: string[] = [];
		const entries = Object.entries(params);
		for (const [key, value] of entries) {
			_arr.push(key + '=' + value);
		}
		if (type === 'get') {
			_key = _key + '?' + _arr.join('&');
		}
		if (item[_key]) {
			if (typeof item[_key]['cancel'] === 'function') {
				item[_key]['cancel']();
			}
			delete cancelTokenMap[type][_key];
		}
	}
};

export { get, post, _delete, put, cancelAxiosToken };
