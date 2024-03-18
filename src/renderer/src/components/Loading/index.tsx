import styles from './index.module.less';

const Loading = () => {
	return (
		<div className={'flex justify-center items-center bg-amber-50 h-full w-full fixed'}>
			<div className={styles.loader}></div>
		</div>
	);
};

export default Loading;
