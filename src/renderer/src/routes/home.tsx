import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import { useLoading } from '../hooks/useLoading';
import {
	GetAllMessage,
	GetLastNotice,
	GetPersonalInfo,
	GetTodayMessage,
	GetWebSetting,
	Grouping,
} from '../service/api/home';
import Modal from '../components/Modal';
import {
	AllMessageResponse,
	ManagerInfo,
	MessageResponse,
	Notice,
	UserInfo,
} from '../service/api/home/interface';
import { eventBus } from '../utils/event';
import AllNoticeModal from '../components/AllNoticeModal';
import { Popover, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = (): ReactNode => {
	const { updateShow } = useLoading();
	const [open, setOpen] = useState(false);
	const [allNoticeOpen, setAllNoticeOpen] = useState(false);
	const [info, setInfo] = useState<ManagerInfo | null>(null);
	const [history, setHistory] = useState<AllMessageResponse['data']>([]);
	const [today, setToday] = useState<MessageResponse['data']>([]);
	const [lastNotice, setLastNotice] = useState<Notice | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const nav = useNavigate();

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
		GetPersonalInfo().then((res) => {
			if (res.code === 200) {
				setUserInfo(res.data);
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

	const memorizedInvokeGroupingApi = useCallback((data) => {
		Grouping({ client_id: data.client_id }).then((res) => {
			if (res.code === 200) {
				toast.success('链接成功');
			}
		});
	}, []);

	useEffect(() => {
		eventBus.subscribe('GET_TODAY_MESSAGE', memorizedGetTodayMessage);
		eventBus.subscribe('GET_NEW_NOTICE', memorizedGetLastNotice);
		eventBus.subscribe('INVOKE_GROUP_API', memorizedInvokeGroupingApi);
		return () => {
			eventBus.clear('GET_TODAY_MESSAGE');
			eventBus.clear('GET_NEW_NOTICE');
			eventBus.clear('INVOKE_GROUP_API');
		};
	}, [memorizedGetTodayMessage, memorizedGetLastNotice, memorizedInvokeGroupingApi]);

	return (
		<div className='flex min-h-screen'>
			<div className={'w-[40%] border-r-[1px] border-gray-600 p-[16px]'}>
				<p className={'text-[20px] mb-[10px] font-bold'}>历史消息</p>
				<ul className={'overflow-auto h-[calc(100vh-74px)] text-white scrollbar-container'}>
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
				<div
					className={'p-[20px] border-b-[1px] border-gray-600 flex justify-between items-center'}
				>
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
						className='text-white bg-red-900 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
					>
						联系作者
					</button>
					<button
						onClick={() => {
							nav(0);
						}}
						type='button'
						className='text-white bg-red-900 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
					>
						刷新
					</button>
					<p
						className={`${userInfo?.is_trial === 1 ? 'text-gray-300' : 'linearGradient'} font-bold text-right`}
					>
						{userInfo?.is_trial === 1 ? '试用账号' : '正式账号'}
					</p>
					<p className={'text-right'}>过期时间：{userInfo?.expiration_date}</p>
					{userInfo && (
						<Popover className='relative'>
							{({ open }) => (
								<>
									<Popover.Button
										className={`
                ${open ? 'text-white' : 'text-white/90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:outline-none`}
									>
										<span>{userInfo.username}</span>
									</Popover.Button>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-200'
										enterFrom='opacity-0 translate-y-1'
										enterTo='opacity-100 translate-y-0'
										leave='transition ease-in duration-150'
										leaveFrom='opacity-100 translate-y-0'
										leaveTo='opacity-0 translate-y-1'
									>
										<Popover.Panel className='text-[12px] w-auto absolute right-0 rounded-[4px] p-[12px] bg-white z-10 mt-3 transform'>
											<div className={'gap-2 flex flex-col'}>
												<p
													onClick={() => {
														localStorage.setItem('token', '');
														nav('/login');
													}}
													className={'text-right cursor-pointer whitespace-nowrap'}
												>
													退出登录
												</p>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
					)}
				</div>
				<div className={'flex-1 h-[calc(100vh-89px)] overflow-hidden'}>
					<div className={'h-[30%] border-gray-600 border-b-[1px] p-[20px]'}>
						<div className={'flex justify-between items-center cursor-pointer'}>
							<p className={'text-[20px] mb-[10px] font-[900]'}>最新公告</p>
							<p onClick={() => setAllNoticeOpen(true)} className={'text-white'}>
								更多
							</p>
						</div>
						<div className={'overflow-auto h-[calc(100%-40px)] text-white'}>
							<p className={'text-[18px]'}>{lastNotice?.message}</p>
							<p className={'text-right'}>{lastNotice?.created_at}</p>
						</div>
					</div>
					<div className={'h-[70%] p-[20px]'}>
						<p className={'text-[20px] mb-[10px] font-[900]'}>今日消息</p>
						<ul className={'overflow-auto h-[calc(100%-40px)] text-white scrollbar-container'}>
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
