module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	ignorePatterns: ['/dist/*', '/node_modules/*'],
	extends: 'xo',
	overrides: [
		{
			extends: [
				'xo',
				'xo-typescript',
				'prettier'
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: {},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},

}
