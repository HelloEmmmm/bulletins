import { ReactNode, useCallback, useState } from 'react';
import { LoginInput } from '../components/LoginInput';
import { CreateUser, LoginApi } from '../service/api/login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PageType = 'login' | 'register';

const Login = (): ReactNode => {
	const [pageType, setPageType] = useState<PageType>('login');
	const [phone, setPhone] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const nav = useNavigate();

	const memorizedHandlePhoneChange = useCallback(
		(event: { target: { value: string | ((prevState: string) => string) } }) => {
			setPhone(event.target.value);
		},
		[]
	);

	const memorizedHandleAccountChange = useCallback(
		(event: { target: { value: string | ((prevState: string) => string) } }) => {
			setUsername(event.target.value);
		},
		[]
	);

	const memorizedHandlePasswordChange = useCallback(
		(event: { target: { value: string | ((prevState: string) => string) } }) => {
			setPassword(event.target.value);
		},
		[]
	);

	return (
		<div className={'w-full h-[100vh] flex justify-center items-center'}>
			<div className='max-w-xs'>
				<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
					<LoginInput
						label={'账号'}
						maxLength={20}
						value={username}
						onChange={memorizedHandleAccountChange}
					/>
					<LoginInput
						type={'password'}
						label={'密码'}
						maxLength={16}
						value={password}
						onChange={memorizedHandlePasswordChange}
					/>
					{pageType === 'register' && (
						<LoginInput label={'手机号'} value={phone} onChange={memorizedHandlePhoneChange} />
					)}
					<div className={`flex items-center justify-between mt-6`}>
						<button
							onClick={() => {
								const base = {
									username,
									password,
								};
								if (pageType === 'login') {
									if (username && password) {
										LoginApi(base).then((res) => {
											if (res.code === 200) {
												localStorage.setItem('token', res.token);
												nav('/home');
											} else {
												toast.error(res.msg);
											}
										});
									}
								} else {
									if (phone && username && password) {
										CreateUser({
											...base,
											phone_number: phone,
										}).then((res) => {
											if (res.code === 200) {
												toast.success(res.msg);
												LoginApi({ ...base }).then((res) => {
													if (res.code === 200) {
														localStorage.setItem('token', res.token);
														nav('/home');
													} else {
														toast.error(res.msg);
													}
												});
											} else {
												toast.error(res.msg);
											}
										});
									}
								}
							}}
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							type='button'
						>
							{pageType === 'login' ? '登录' : '注册'}
						</button>
						<a
							onClick={() => {
								setPageType(pageType === 'login' ? 'register' : 'login');
							}}
							className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
						>
							{pageType === 'login' ? '注册账号' : '返回登录'}
						</a>
					</div>
				</form>
				<p className='text-center text-gray-500 text-xs'>
					&copy;2024 Riches Corp. All rights reserved.
				</p>
			</div>
		</div>
	);
};

export default Login;
