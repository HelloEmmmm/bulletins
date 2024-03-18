import { ReactNode, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import axios from 'axios';

const Root = (): ReactNode => {
	const _ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

	const _nav = useNavigate();

	const { show } = useLoading();

	useEffect(() => {
		window.electron.ipcRenderer.on('message', (_event, message) => {
			console.log(message, 999);
		});

		axios
			.post('http://39.105.204.185:8787/adminLogin', {
				username: 'admin',
				password: '123456',
			})
			.then((res) => {
				console.log(res);
			});
	}, []);

	return (
		<>
			{show && <Loading />}
			<Link to={'/home'}>home</Link>
			<Link to={'/login'}>login</Link>
			<Outlet />
		</>
	);
};

export default Root;
