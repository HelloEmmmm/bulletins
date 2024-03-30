import { ReactNode, useEffect, useState } from 'react';
import { useLoading } from '../hooks/useLoading';
import { GetAllMessage, GetTodayMessage, GetWebSetting } from '../service/api/home';
import Modal from '../components/Modal';
import { AllMessageResponse, ManagerInfo, MessageResponse } from '../service/api/home/interface';
import MyWebSocket from '../ws';

const Home = (): ReactNode => {
	const { updateShow } = useLoading();
	const [open, setOpen] = useState(false);
	const [info, setInfo] = useState<ManagerInfo | null>(null);
	const [history, setHistory] = useState<AllMessageResponse['data']>([]);
	const [today, setToday] = useState<MessageResponse['data']>([]);

	useEffect(() => {
		GetAllMessage().then((res) => {
			if (res.code === 200) {
				setHistory(res.data);
				updateShow(false);
			}
		});
		GetTodayMessage().then((res) => {
			if (res.code === 200) {
				setToday(res.data);
				updateShow(false);
			}
		});
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
		<div className='flex min-h-screen text-white'>
			<div className={'w-[40%] border-r-[1px] border-gray-600 p-[16px]'}>
				<p className={'text-[20px] mb-2'}>今日消息</p>
				<ul>
					{today.map((item, index) => {
						return (
							<li className={'flex justify-between'} key={index}>
								<p>{item.code}</p>
								<p>{item.date}</p>
							</li>
						);
					})}
				</ul>
			</div>
			<div className={'flex flex-col flex-1'}>
				<div className={'p-[20px] border-b-[1px] border-gray-600 flex flex-row-reverse'}>
					<button
						onClick={() => {
							GetWebSetting().then((res) => {
								if (res.code === 200) {
									setOpen(true);
									setInfo(res.data);
								}
							});
						}}
						type='button'
						className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
					>
						联系作者
					</button>
				</div>
				<div className={'flex-1 p-[20px]'}>
					<p className={'text-[20px] mb-2'}>历史消息</p>
					<ul>
						{history.map((item) => {
							return (
								<li className={'flex justify-between'} key={item.id}>
									<p>{item.code}</p>
									<p>{item.date}</p>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<Modal show={open} handleShowChange={setOpen} info={info} />
		</div>
	);
};

export default Home;
