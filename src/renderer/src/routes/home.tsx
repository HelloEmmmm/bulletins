import { ReactNode, useEffect } from 'react';
import { useLoading } from '../hooks/useLoading';
import { GetAllMessage, GetTodayMessage } from '../service/api/home';

const Home = (): ReactNode => {
	const { updateShow } = useLoading();

	useEffect(() => {
		updateShow(true);
		Promise.all([GetAllMessage({}), GetTodayMessage({})])
			.then((res) => {
				console.log(res);
				updateShow(false);
			})
			.catch((e) => {
				console.log(e);
				updateShow(false);
			});
	}, []);

	return (
		<div className='flex min-h-screen'>
			<div className={'w-[33.33%] bg-[red]'}>1</div>
			<div className={'flex flex-col flex-1 gap-[20px]'}>
				<div className={'bg-[yellow] p-[20px]'}>1</div>
				<div className={'flex-1 bg-[blue]'}>2</div>
			</div>
		</div>
	);
};

export default Home;
