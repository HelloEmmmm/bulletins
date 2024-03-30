import { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import MyWebSocket from '../ws';

const Root = (): ReactNode => {
	const _ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

	const _nav = useNavigate();

	const { show } = useLoading();

	useEffect(() => {
		window.electron.ipcRenderer.on('message', (_event, message) => {
			console.log(message, 999);
		});
		const token = localStorage.getItem('token');
		if (!token) {
			_nav('login');
		} else {
			_nav('home');
		}
	}, []);

	useEffect(() => {
		const url = 'ws://39.105.204.185:7272';
		const ws = new MyWebSocket(url);
		ws.init();
		// ws.init(
		// 	{
		// 		//time：心跳时间间隔 timeout：心跳超时间隔 reconnect：断线重连时间，一般的，断线重连时间等于心跳时间间隔加断线重连时间（忽略超时等待）
		// 		time: 30 * 1000,
		// 		timeout: 1000,
		// 		reConnect: 5 * 1000,
		// 	},
		// 	true
		// );
	}, []);

	return (
		<>
			{show && <Loading />}
			<Outlet />
		</>
	);
};

export default Root;
