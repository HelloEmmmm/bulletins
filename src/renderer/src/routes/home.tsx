import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLoading } from '../hooks/useLoading';
import { GetAllMessage, GetLastNotice, GetTodayMessage, GetWebSetting } from '../service/api/home';
import Modal from '../components/Modal';
import {
	AllMessageResponse,
	ManagerInfo,
	MessageResponse,
	Notice,
} from '../service/api/home/interface';
import { eventBus } from '../utils/event';
import AllNoticeModal from '../components/AllNoticeModal';

const Home = (): ReactNode => {
	const { updateShow } = useLoading();
	const [open, setOpen] = useState(false);
	const [allNoticeOpen, setAllNoticeOpen] = useState(false);
	const [info, setInfo] = useState<ManagerInfo | null>(null);
	const [history, setHistory] = useState<AllMessageResponse['data']>([]);
	const [today, setToday] = useState<MessageResponse['data']>([]);
	const [lastNotice, setLastNotice] = useState<Notice | null>(null);

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
		memorizedGetLastNotice();
	}, []);

	const memorizedGetLastNotice = useCallback(() => {
		GetLastNotice().then((res) => {
			if (res.code === 200) {
				setLastNotice(res.data);
			}
		});
	}, []);

	const memorizedGetTodayMessage = useCallback(() => {
		GetTodayMessage().then((res) => {
			if (res.code === 200) {
				setToday(res.data);
				updateShow(false);
			}
		});
	}, []);

	useEffect(() => {
		eventBus.subscribe('GET_TODAY_MESSAGE', memorizedGetTodayMessage);
		return () => {
			eventBus.clear('GET_TODAY_MESSAGE');
		};
	}, [memorizedGetTodayMessage]);

	return (
		<div className='flex min-h-screen text-white'>
			<div className={'w-[40%] border-r-[1px] border-gray-600 p-[16px]'}>
				<p className={'text-[20px] mb-[10px] font-bold'}>历史消息</p>
				<ul className={'overflow-auto h-[calc(100vh-74px)]'}>
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
			<div className={'flex flex-col flex-1 h-screen'}>
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
				<div className={'flex-1 h-[calc(100vh-89px)] overflow-hidden'}>
					<div className={'h-[50%] border-gray-600 border-b-[1px] p-[20px]'}>
						<div className={'flex justify-between items-center cursor-pointer'}>
							<p className={'text-[20px] mb-[10px] font-bold text-green-600'}>最新公告</p>
							<p onClick={() => setAllNoticeOpen(true)}>更多</p>
						</div>
						<div className={'overflow-auto h-[calc(100%-40px)]'}>
							<p>{lastNotice?.message}</p>
							<p>{lastNotice?.created_at}</p>
						</div>
					</div>
					<div className={'h-[50%] p-[20px]'}>
						<p className={'text-[20px] mb-[10px] font-bold text-green-600'}>今日消息</p>
						<ul className={'overflow-auto h-[calc(100%-40px)]'}>
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
				</div>
			</div>
			<Modal show={open} handleShowChange={setOpen} info={info} />
			<AllNoticeModal show={allNoticeOpen} handleShowChange={setAllNoticeOpen} />
		</div>
	);
};

export default Home;
