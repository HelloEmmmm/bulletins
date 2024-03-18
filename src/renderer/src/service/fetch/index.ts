import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

let token = '';

if (typeof window !== 'undefined') {
	// Perform localStorage action
	token = localStorage.getItem('token') || '';
}

const authCode = [401, 403];

const CancelToken = axios.CancelToken;

export const cancelTokenMap: Record<'get', { [key: string]: Record<string, any> }> = { get: {} };

const service = axios.create({
	baseURL: 'http://39.105.204.185:8787',
	timeout: 10000,
	headers: {
		Authorization: token ? `Bearer ${token}` : '',
	},
});

service.interceptors.request.use(
	(config) => {
		// todo
		return config;
	},
	(error) => {
		Promise.reject(error).then((r) => console.log(r));
	}
);

service.interceptors.response.use(
	(response) => {
		const data = response.data;
		const code = data.errcode | 0;
		if (authCode.includes(code)) {
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
	// 低版本浏览器不支持promise的finally，加垫片(promise.prototype.finally)or放弃。
	// .finally(() => {
	//   if (_cancelToken) {
	//     const _item = cancelTokenMap['get'][url]
	//     if (_item && _item.count <= 1) {
	//       delete cancelTokenMap['get'][url]
	//     }
	//     _item && _item.count--
	//   }
	// });
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

const postFile = (url: string, data = {}) => {
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: '*/*',
		},
	};
	return service.post(url, data, config).then((res) => {
		return res;
	});
};

export { get, post, _delete, put, postFile, cancelAxiosToken };
