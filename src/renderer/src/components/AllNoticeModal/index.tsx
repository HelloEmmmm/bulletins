import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Notice } from '../../service/api/home/interface';
import { GetAllNotice } from '../../service/api/home';

export interface ModalProps {
	show: boolean;
	handleShowChange: (b: boolean) => void;
}

const AllNoticeModal = (props: ModalProps) => {
	const { show, handleShowChange } = props;

	const [list, setList] = useState<Notice[]>([]);

	const cancelButtonRef = useRef(null);

	const memorizedGetAllNotice = useCallback(() => {
		GetAllNotice().then((res) => {
			if (res.code === 200) {
				setList(res.data);
			}
		});
	}, []);

	useEffect(() => {
		memorizedGetAllNotice();
	}, []);

	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				initialFocus={cancelButtonRef}
				onClose={() => {
					handleShowChange(false);
				}}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-lg'>
								<div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
									<div className='sm:flex sm:items-start'>
										<div className='w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
											<Dialog.Title
												as='h3'
												className='text-base font-semibold leading-6 text-gray-900'
											>
												历史公告：
											</Dialog.Title>
											<div className='mt-4 relative overflow-x-auto'>
												<table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
													<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
														<tr>
															<th scope='col' className='px-6 py-3'>
																公告内容
															</th>
															<th scope='col' className='px-6 py-3'>
																创建时间
															</th>
														</tr>
													</thead>
													<tbody>
														{list.map((item) => {
															return (
																<tr
																	key={item.id}
																	className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
																>
																	<th
																		scope='row'
																		className='px-6 py-4 font-medium text-gray-900 whitespace-pre-wrap dark:text-white'
																	>
																		{item.message}
																	</th>
																	<td className='px-6 py-4'>{item.created_at}</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
										onClick={() => handleShowChange(false)}
										ref={cancelButtonRef}
									>
										确定
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default AllNoticeModal;
