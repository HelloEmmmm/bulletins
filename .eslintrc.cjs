module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'@electron-toolkit/eslint-config-ts/recommended',
		'@electron-toolkit/eslint-config-prettier',
		'prettier'
	],
	rules: {
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
		],
	},
};
