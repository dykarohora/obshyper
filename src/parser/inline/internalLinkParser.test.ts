import type { InternalLink } from '../../types/index.js'
import { internalLinkParser } from './internalLinkParser.js'

describe('internalLinkParser', () => {
	it.each([
		[
			'[[テクノロジー/文字コード/サロゲートペア|サロゲートペア]]',
			{
				type: 'internalLink',
				text: 'サロゲートペア',
				path: 'テクノロジー/文字コード/サロゲートペア',
				embedding: false
			}
		],
		[
			'[[hello]]',
			{
				type: 'internalLink',
				text: 'hello',
				path: 'hello',
				embedding: false
			}
		],
		[
			'![[hello]]',
			{
				type: 'internalLink',
				text: 'hello',
				path: 'hello',
				embedding: true
			}
		],
		[
			'[[hello|world]]',
			{
				type: 'internalLink',
				text: 'world',
				path: 'hello',
				embedding: false
			}
		],
		[
			'[[`hello`]]',
			{
				type: 'internalLink',
				text: '`hello`',
				path: '`hello`',
				embedding: false
			}
		],
		[
			'[[**hello**]]',
			{
				type: 'internalLink',
				text: '**hello**',
				path: '**hello**',
				embedding: false
			}
		],
		[
			'[[hello|world#^[]|/:\\]]',
			{
				type: 'internalLink',
				text: 'world#^[]|/:\\',
				path: 'hello',
				embedding: false
			}
		]
	] satisfies Array<[string, InternalLink]>)
	('入力が%sのとき、パースに成功する', (input, expected) => {
		const output = internalLinkParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
		expect(output.state.position).toEqual(input.length)
	})

	it.each([
		['[[he#llo]]'],
		['[[he^llo]]'],
		['[[he[llo]]'],
		['[[he]llo]]'],
		['[[he\\llo]]'],
		['[[he:llo]]'],
	])('入力が%sのとき、パースに失敗する', (input) => {
		const output = internalLinkParser({ input })
		expect(output.type).toEqual('Failure')
		expect(output.state.position).toEqual(0)
	})
})
