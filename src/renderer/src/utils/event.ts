interface ICallbackList {
	[id: string]: (...args: unknown[]) => void;
}

interface IEventObject {
	[eventName: string]: ICallbackList;
}

interface ISubscribe {
	unSubscribe: () => void;
}

interface IEventBus {
	publish<T extends any[]>(eventName: string, ...args: T): void;

	subscribe(eventName: string, callback: () => void): ISubscribe;

	subscribeOnce(eventName: string, callback: () => void): ISubscribe;

	clear(eventName: string): void;
}

class EventBus implements IEventBus {
	private _eventObject: IEventObject;
	private _callbackId: number;

	constructor() {
		// 初始化事件列表
		this._eventObject = {};
		// 回调函数列表的id
		this._callbackId = 0;
	}

	// 发布事件
	publish(eventName: string, ...args: unknown[]): void {
		// 取出当前事件所有的回调函数
		const callbackObject = this._eventObject[eventName];

		if (!callbackObject) return console.warn(eventName + ' not found!');

		// 执行每一个回调函数
		for (const id in callbackObject) {
			// 执行时传入参数
			callbackObject[id](...args);

			// 只订阅一次的回调函数需要删除
			if (id[0] === 'once') {
				delete callbackObject[id];
			}
		}
	}

	commonSubscribe(id: string | number, eventName: string, callback: () => void) {
		// 标示为只订阅一次的回调函数
		// 存储订阅者的回调函数
		// callbackId使用后需要自增，供下一个回调函数使用
		this._eventObject[eventName][id] = callback;

		// 每一次订阅事件，都生成唯一一个取消订阅的函数
		const unSubscribe = () => {
			// 清除这个订阅者的回调函数
			delete this._eventObject[eventName][id];

			// 如果这个事件没有订阅者了，也把整个事件对象清除
			if (Object.keys(this._eventObject[eventName]).length === 0) {
				delete this._eventObject[eventName];
			}
		};

		return { unSubscribe };
	}

	// 订阅事件
	subscribe(eventName: string, callback: () => void): ISubscribe {
		const id = this._callbackId++;
		// 初始化这个事件
		if (!this._eventObject[eventName]) {
			// 使用对象存储，注销回调函数的时候提高删除的效率
			this._eventObject[eventName] = {};
		}

		return this.commonSubscribe(id, eventName, callback);
	}

	// 只订阅一次
	subscribeOnce(eventName: string, callback: () => void): ISubscribe {
		const id = 'once' + this._callbackId++;
		// 初始化这个事件
		if (!this._eventObject[eventName]) {
			// 使用对象存储，注销回调函数的时候提高删除的效率
			this._eventObject[eventName] = {};
		}
		return this.commonSubscribe(id, eventName, callback);
	}

	// 清除事件
	clear(eventName: string): void {
		// 未提供事件名称，默认清除所有事件
		if (!eventName) {
			this._eventObject = {};
			return;
		}

		// 清除指定事件
		delete this._eventObject[eventName];
	}
}

export const eventBus = new EventBus();
