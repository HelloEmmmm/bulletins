import { createContext, ReactNode, useCallback, useState, useContext } from 'react';

export interface LoadingContextValue {
	show: boolean;
	updateShow: (bool: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [show, setShow] = useState(false);
	const updateShow = useCallback((bool) => {
		setShow(bool);
	}, []);
	return <LoadingContext.Provider value={{ show, updateShow }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
