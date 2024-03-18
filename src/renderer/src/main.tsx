import './assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import Home from './routes/home';
import Login from './routes/login';
import { LoadingProvider } from './hooks/useLoading';

const router = createHashRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: 'home',
				element: <Home />,
			},
			{
				path: 'login',
				element: <Login />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<LoadingProvider>
			<RouterProvider router={router} />
		</LoadingProvider>
	</React.StrictMode>
);
