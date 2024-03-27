import { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';

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

	return (
		<>
			{show && <Loading />}
			<Outlet />
		</>
	);
};

export default Root;
