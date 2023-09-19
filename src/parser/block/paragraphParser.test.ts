import { paragraphParser } from './paragraphParser.js'
import type { Paragraph } from '../../types/index.js'

describe('paragraphParser', () => {
	it('改行がない文字列をparagraphとしてパースできる', () => {
		const input = 'hello, world. **今日**は*いい天気*です。'
		const result = paragraphParser({ input })

		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: Paragraph = {
			type: 'paragraph',
			children: [
				{ type: 'text', value: 'hello, world. ' },
				{ type: 'strong', children: [{ type: 'text', value: '今日' }] },
				{ type: 'text', value: 'は' },
				{ type: 'emphasis', children: [{ type: 'text', value: 'いい天気' }] },
				{ type: 'text', value: 'です。' }
			]
		}
		expect(result.value).toEqual(expected)
	})

	it('改行がある文字列をparagraphとしてパースできる', () => {
		const input = '`good` morning. [[js/test/greet|挨拶]]. [example](https://example.com)\nhello, world. **今日**は*いい天気*です。'
		const result = paragraphParser({ input })

		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: Paragraph = {
			type: 'paragraph',
			children: [
				{ type: 'codeSpans', value: 'good' },
				{ type: 'text', value: ' morning. ' },
				{ type: 'internalLink', path: 'js/test/greet', text: '挨拶', embedding: false },
				{ type: 'text', value: '. ' },
				{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'example' }] },
			]
		}
		expect(result.value).toEqual(expected)
	})

	it.each([
		['## test\n\nhello, world'],
		['   ### test\n\nhello, world'],
		['```js\nhello, world\n```'],
		['```\nhello, world\n```'],
		['> hello, world'],
		['   > hello, world'],
	])('入力が%sの場合はパースに失敗する', (input) => {
		const result = paragraphParser({ input })

		expect(result.type).toEqual('Failure')
		expect(result.state.position).toEqual(0)
	})
})
