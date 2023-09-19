import { blockquoteParser } from './blockquoteParser.js'
import { type Blockquote } from '../../types/index.js'

describe('blockquoteParser', () => {
	it('引用ブロックをパースできる', () => {
		const input =
			`> hello ![[world]] [site](https://example.com) \`code\` **strong** *emphasis*`

		const result = blockquoteParser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: Blockquote = {
			type: 'blockquote',
			children: [
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'hello ' },
						{ type: 'internalLink', path: 'world', text: 'world', embedding: true },
						{ type: 'text', value: ' ' },
						{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'site' }] },
						{ type: 'text', value: ' ' },
						{ type: 'codeSpans', value: 'code' },
						{ type: 'text', value: ' ' },
						{ type: 'strong', children: [{ type: 'text', value: 'strong' }] },
						{ type: 'text', value: ' ' },
						{ type: 'emphasis', children: [{ type: 'text', value: 'emphasis' }] }
					]
				}
			]
		}

		expect(result.value).toEqual(expected)
	})

	it('複数行にわたる引用ブロックをパースできる', () => {
		const input =
			`> hello ![[world]] [site](https://example.com) \`code\` **strong** *emphasis*
> hello ![[world]] [site](https://example.com) \`code\` **strong** *emphasis*`

		const result = blockquoteParser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: Blockquote = {
			type: 'blockquote',
			children: [
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'hello ' },
						{ type: 'internalLink', path: 'world', text: 'world', embedding: true },
						{ type: 'text', value: ' ' },
						{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'site' }] },
						{ type: 'text', value: ' ' },
						{ type: 'codeSpans', value: 'code' },
						{ type: 'text', value: ' ' },
						{ type: 'strong', children: [{ type: 'text', value: 'strong' }] },
						{ type: 'text', value: ' ' },
						{ type: 'emphasis', children: [{ type: 'text', value: 'emphasis' }] }
					]
				},
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'hello ' },
						{ type: 'internalLink', path: 'world', text: 'world', embedding: true },
						{ type: 'text', value: ' ' },
						{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'site' }] },
						{ type: 'text', value: ' ' },
						{ type: 'codeSpans', value: 'code' },
						{ type: 'text', value: ' ' },
						{ type: 'strong', children: [{ type: 'text', value: 'strong' }] },
						{ type: 'text', value: ' ' },
						{ type: 'emphasis', children: [{ type: 'text', value: 'emphasis' }] }
					]
				},
			]
		}

		expect(result.value).toEqual(expected)
	})

	it('行頭のスペースは3つまでなら引用ブロックとみなされる', () => {
		const validInput = '   > hello'
		const validInputResult = blockquoteParser({ input: validInput })
		expect(validInputResult.type).toEqual('Success')

		const invalidInput = '    > hello'
		const invalidInputResult = blockquoteParser({ input: invalidInput })
		expect(invalidInputResult.type).toEqual('Failure')
	})

	it('多段の引用ブロックをパースできる', () => {
		const input =
			`> hello
> > world`

		const result = blockquoteParser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: Blockquote = {
			type: 'blockquote',
			children: [
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'hello' }
					]
				},
				{
					type: 'blockquote',
					children: [
						{
							type: 'paragraph',
							children: [
								{ type: 'text', value: 'world' }
							]
						}
					]
				}
			]
		}

		expect(result.value).toEqual(expected)
	})
})
