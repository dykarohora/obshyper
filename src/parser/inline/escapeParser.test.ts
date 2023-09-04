import { escapeParser } from './escapeParser.js'

describe('escapeParser', () => {
	it.each([
		['\\!', { type: 'text', value: '!' }],
		['\\"', { type: 'text', value: '"' }],
		['\\#', { type: 'text', value: '#' }],
		['\\$', { type: 'text', value: '$' }],
		['\\%', { type: 'text', value: '%' }],
		['\\&', { type: 'text', value: '&' }],
		['\\\'', { type: 'text', value: '\'' }],
		['\\(', { type: 'text', value: '(' }],
		['\\)', { type: 'text', value: ')' }],
		['\\*', { type: 'text', value: '*' }],
		['\\+', { type: 'text', value: '+' }],
		['\\,', { type: 'text', value: ',' }],
		['\\-', { type: 'text', value: '-' }],
		['\\.', { type: 'text', value: '.' }],
		['\\/', { type: 'text', value: '/' }],
		['\\:', { type: 'text', value: ':' }],
		['\\;', { type: 'text', value: ';' }],
		['\\<', { type: 'text', value: '<' }],
		['\\=', { type: 'text', value: '=' }],
		['\\>', { type: 'text', value: '>' }],
		['\\?', { type: 'text', value: '?' }],
		['\\@', { type: 'text', value: '@' }],
		['\\[', { type: 'text', value: '[' }],
		['\\\\', { type: 'text', value: '\\' }],
		['\\]', { type: 'text', value: ']' }],
		['\\^', { type: 'text', value: '^' }],
		['\\_', { type: 'text', value: '_' }],
		['\\`', { type: 'text', value: '`' }],
		['\\{', { type: 'text', value: '{' }],
		['\\|', { type: 'text', value: '|' }],
		['\\}', { type: 'text', value: '}' }],
		['\\~', { type: 'text', value: '~' }],
	])(`入力が%sのとき、パースに成功する`, (input, expected) => {
		const output = escapeParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
		expect(output.state.position).toEqual(input.length)
	})
})
