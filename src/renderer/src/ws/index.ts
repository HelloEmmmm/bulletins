import { eventBus } from '../utils/event';

const MessageType = {
	//websocket消息类型
	MSG: 'message', //普通消息
	HEART_BEAT: 'heart_beat', //心跳
	PING: 'ping',
	TODAY_MESSAGE: 1,
	ANNOUNCEMENT: 2,
	GROUPING: 200,
};

export default class MyWebSocket extends WebSocket {
	private heartBeat:
		| {
				time: number;
				timeout: number;
				reConnect: number;
		  }
		| undefined;
	private isReconnect: boolean | undefined;
	private reconnectTimer: number | undefined;
	private waitingTimer: number | undefined;
	private heartTimer: number | undefined;
	private webSocketState: boolean | undefined;

	constructor(url: string, protocols?: any[] | string) {
		super(url, protocols);
		return this;
	}

	/*
	 * 入口函数
	 * @param heartBeatConfig  time：心跳时间间隔 timeout：心跳超时间隔 reconnect：断线重连时间间隔
	 * @param isReconnect 是否断线重连
	 */
	init(
		heartBeatConfig?: { time: number; timeout: number; reConnect: number },
		isReconnect?: boolean
	) {
		this.onopen = this.openHandler; //连接上时回调
		this.onclose = this.closeHandler; //断开连接时回调
		this.onmessage = this.messageHandler; //收到服务端消息
		this.onerror = this.errorHandler; //连接出错
		this.heartBeat = heartBeatConfig;
		this.isReconnect = isReconnect;
		this.reconnectTimer = undefined; //断线重连时间器
		this.waitingTimer = undefined; // 超时等待时间器
		this.heartTimer = undefined; // 心跳时间器
		this.webSocketState = false; //socket状态 true为已连接
	}

	openHandler() {
		this.send('Authorization: Bearer ' + localStorage.getItem('token'));
		this.webSocketState = true; //socket状态设置为连接，做为后面的断线重连的拦截器
		!!this.heartBeat && !!this.heartBeat.time && this.startHeartBeat(this.heartBeat.time); //是否启动心跳机制
		console.log('开启');
	}

	messageHandler: ((this: WebSocket, ev: MessageEvent) => any) | null = (e) => {
		const data = this.getMsg(e);
		console.log(data);
		switch (data.type) {
			case MessageType.MSG: //普通消息
				console.log('收到消息' + data.type);
				break;
			/* useless code */
			case MessageType.HEART_BEAT: //心跳
				this.webSocketState = true;
				console.log('收到心跳响应' + data.type);
				break;
			case MessageType.PING: //心跳
				this.webSocketState = true;
				console.log('收到心跳响应' + data.type);
				break;
			case MessageType.TODAY_MESSAGE:
				eventBus.publish('GET_TODAY_MESSAGE');
				break;
			case MessageType.ANNOUNCEMENT:
				eventBus.publish('GET_NEW_NOTICE');
				break;
			case MessageType.GROUPING:
				eventBus.publish('INVOKE_GROUP_API', data);
				break;
		}
	};

	closeHandler() {
		//socket关闭
		this.webSocketState = false; //socket状态设置为断线
		console.log('关闭');
	}

	errorHandler() {
		//socket出错
		this.webSocketState = false; //socket状态设置为断线
		this.reconnectWebSocket(); //重连
		console.log('出错');
	}

	sendMsg(obj: object) {
		this.send(JSON.stringify(obj));
	}

	getMsg(e: MessageEvent<any>) {
		return JSON.parse(e.data);
	}

	/*
	 * 心跳初始函数
	 * @param time：心跳时间间隔
	 */
	startHeartBeat(time: number | undefined) {
		if (time) {
			this.heartTimer = window.setTimeout(() => {
				this.sendMsg({
					ModeCode: MessageType.HEART_BEAT,
					msg: new Date(),
				});
				this.waitingTimer = this.waitingServer();
			}, time);
		} else {
			throw new Error('Missing parameter time');
		}
	}

	//延时等待服务端响应，通过webSocketState判断是否连线成功
	waitingServer() {
		this.webSocketState = false;
		return window.setTimeout(() => {
			if (this.webSocketState) return this.startHeartBeat(this.heartBeat?.time);
			console.log('心跳无响应，已断线');
			this.reconnectTimer = this.reconnectWebSocket();
		}, this.heartBeat?.timeout);
	}

	//重连操作
	reconnectWebSocket() {
		if (!this.isReconnect) return;
		return window.setTimeout(() => {}, this.heartBeat?.reConnect);
	}

	// 清除所有定时器
	clearTimer() {
		clearTimeout(this.reconnectTimer);
		clearTimeout(this.heartTimer);
		clearTimeout(this.waitingTimer);
	}

	// 关闭连接
	clear(isReconnect = false) {
		this.isReconnect = isReconnect;
		this.clearTimer();
		this.close();
	}
}
