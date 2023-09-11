import { inlineParser } from './inlineParser.js'

describe('inlineParser', () => {
	it.each([
		[
			'hello, `world`!!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'codeSpans', value: 'world' },
				{ type: 'text', value: '!!' },
			]
		],
		[
			'`hello`, world `!!`',
			[
				{ type: 'codeSpans', value: 'hello' },
				{ type: 'text', value: ', world ' },
				{ type: 'codeSpans', value: '!!' },
			]
		],
		[
			'hello, \\*world\\*!!',
			[
				{ type: 'text', value: 'hello, *world*!!' },
			]
		],
		[
			'hello, [[world]] !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'internalLink', text: 'world', path: 'world', embedding: false },
				{ type: 'text', value: ' !!' },
			]
		],
		[
			'hello, [[test|world]] !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'internalLink', text: 'world', path: 'test', embedding: false },
				{ type: 'text', value: ' !!' },
			]
		],
		[
			'hello, [world](http://example.com) !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'link', url: 'http://example.com', children: [{ type: 'text', value: 'world' }] },
				{ type: 'text', value: ' !!' },
			]
		]
	])('入力が%sのとき、パースに成功する', (input, expected) => {
		const output = inlineParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
	})
})
