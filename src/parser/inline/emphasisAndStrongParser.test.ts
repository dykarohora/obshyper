import type { Emphasis, Strong } from '../../types/index.js'
import { emphasisAndStrongParser } from './emphasisAndStrongParser.js'

describe('emphasisAndStrongParser', () => {
	it.each([
		// [
		// 	// この文字列はサポートしない
		// 	'*(**hello**)*',
		// 	{
		// 		type: 'emphasis',
		// 		children: [
		// 			{ type: 'text', value: '(' },
		// 			{ type: 'strong', children: [{ type: 'text', value: 'hello' }] },
		// 			{ type: 'text', value: ')' }
		// 		]
		// 	}
		// ],
		[
			'**(*hello*)**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: '(' },
					{ type: 'emphasis', children: [{ type: 'text', value: 'hello' }] },
					{ type: 'text', value: ')' }
				]
			}
		],
		[
			'***hello***',
			{
				type: 'strong',
				children: [
					{ type: 'emphasis', children: [{ type: 'text', value: 'hello' }] }
				]
			}
		],
		[
			'*hello*',
			{
				type: 'emphasis',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'**hello**',
			{
				type: 'strong',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'*"hello"*',
			{
				type: 'emphasis',
				children: [{ type: 'text', value: '"hello"' }]
			}
		],
		[
			'**\\***',
			{
				type: 'strong',
				children: [{ type: 'text', value: '*' }]
			}
		],
		[
			'**foo "*bar*" foo**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'foo "' },
					{ type: 'emphasis', children: [{ type: 'text', value: 'bar' }] },
					{ type: 'text', value: '" foo' }
				]
			}
		],
		[
			'**he\nllo**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'he\nllo' },
				]
			}
		],
		[
			'**he`l`lo**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'he' },
					{ type: 'codeSpans', value: 'l' },
					{ type: 'text', value: 'lo' },
				]
			}
		],
		[
			'**he[l](https://example.com)lo**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'he' },
					{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'l' }] },
					{ type: 'text', value: 'lo' },
				]
			}
		],
		[
			'**he[[ll]]o**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'he' },
					{ type: 'internalLink', text: 'll', path: 'll', embedding: false },
					{ type: 'text', value: 'o' },
				]
			}
		],
		[
			'**aaa[bbb`ccc`ddd](https://example.com)**',
			{
				type: 'strong',
				children: [
					{ type: 'text', value: 'aaa' },
					{
						type: 'link',
						url: 'https://example.com',
						children: [
							{ type: 'text', value: 'bbb' },
							{ type: 'codeSpans', value: 'ccc' },
							{ type: 'text', value: 'ddd' }
						]
					},
				]
			}
		]
	] satisfies Array<[string, Strong | Emphasis]>)
	('入力が%sのとき、パースに成功する', (input, expected) => {
		const output = emphasisAndStrongParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
		expect(output.state.position).toEqual(input.length)
	})

	it.each([
		['* hello*'],
		['** hello**'],
		['*hello *'],
		['**hello **'],
		['*hello\n*'],
		['**hello\t**'],
		['**']
	])('入力が%sのとき、パースに失敗する', (input) => {
		const output = emphasisAndStrongParser({ input })
		expect(output.type).toEqual('Failure')
		expect(output.state.position).toEqual(0)
	})
})

