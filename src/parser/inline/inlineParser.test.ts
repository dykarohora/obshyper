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
		]
	])('入力が%sのとき、パースに成功する', (input, expected) => {
		const output = inlineParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
	})
})
