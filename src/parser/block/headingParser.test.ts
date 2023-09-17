import { headingParser } from './headingParser.js'
import type { ParserOutput } from '@dykarohora/funser'
import type { Heading } from '../../types/index.js'

describe('headingParser', () => {
	it.each([
		[`# Heading`, 1],
		['## Heading', 2],
		['### Heading', 3],
		['#### Heading', 4],
		['##### Heading', 5],
		['###### Heading', 6],
		['## Heading  ##', 2],
		['  ### Heading     ###', 3],
		['# Heading ######################', 1],
		['##### Heading ##', 5],
		['##### Heading ##     ', 5],
		['##### Heading ##\t\t', 5],
	] satisfies Array<[string, 1 | 2 | 3 | 4 | 5 | 6]>)
	('入力が %s のとき、深さ%dの見出しとしてパースできる', (input, depth) => {
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth, children: [{ type: 'text', value: 'Heading' }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it.each([
		['####### Heading'],
		['#5 bolt'],
		['#hashtag'],
		['\\## foo'],
	])('入力が %s のとき、パースに失敗する', (input) => {
		const result = headingParser({ input })
		expect(result.type).toEqual('Failure')
		// TODO パラグラフとしてパースされるように実装する
		// throw new Error('Not implemented')
	})

	it('見出し名はインラインコンテンツとしてパースされる', () => {
		const input = '# foo [[bar]] [b`a`z](http://example.com)'
		const result = headingParser({ input })

		if(result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected = {
			'type': 'heading',
			'depth': 1,
			'children': [
				{
					'type': 'text',
					'value': 'foo '
				},
				{
					'type': 'internalLink',
					'path': 'bar',
					'text': 'bar',
					'embedding': false
				},
				{
					'type': 'text',
					'value': ' '
				},
				{
					'type': 'link',
					'url': 'http://example.com',
					'children': [
						{
							'type': 'text',
							'value': 'b'
						},
						{
							'type': 'codeSpans',
							'value': 'a'
						},
						{
							'type': 'text',
							'value': 'z'
						}
					]
				}
			]
		}

		expect(result.value).toEqual(expected)
	})

	it('見出し名の前後にあるタブとスペースは無視される', () => {
		const input = '#    \t foo   \t   '
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth: 1, children: [{ type: 'text', value: 'foo' }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it.each([
		['### foo'],
		[' ### foo'],
		['  ### foo'],
		['   ### foo'],
	])('行頭のスペースは3つまでなら見出しとしてパースされる。入力 %s', (input) => {
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth: 3, children: [{ type: 'text', value: 'foo' }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it('行頭のスペースが4つ以上の場合は、パースに失敗する', () => {
		const input = '    ### foo'
		const result = headingParser({ input })
		expect(result.type).toEqual('Failure')
		// TODO コードブロックとしてパースされるように実装する
		// TODO foo \n    # fooの場合はパラグラフとしてパースされる
	})

	it('末尾の#のシーケンスの後に空白とタブ以外の文字が出現した場合は、#のシーケンスはインラインコンテンツの一部とみなされる', () => {
		const input = '### foo ### b'
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth: 3, children: [{ type: 'text', value: 'foo ### b' }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it('インラインコンテンツと#の終了シーケンスとの間にはスペースかタブが必要となる。入力 %s', () => {
		const input = '# foo#'
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth: 1, children: [{ type: 'text', value: 'foo#' }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it.each([
		['### foo \\###', 'foo ###'],
		['### foo #\\##', 'foo ###'],
		['### foo \\#', 'foo #'],
	])('#がエスケープされている場合は終了シーケンスとはみなされない。入力 %s', (input, content) => {
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth: 3, children: [{ type: 'text', value: content }] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it.each([
		['## ', 2],
		['#', 1],
		['### ###', 3]
	] satisfies Array<[string, 1 | 2 | 3 | 4 | 5 | 6]>)
	(`見出し名は空でも良い。入力 %s`, (input, depth) => {
		const result = headingParser({ input })
		const expected: ParserOutput<Heading> = {
			type: 'Success',
			value: { type: 'heading', depth, children: [] },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	//
	// it('見出しは段落を中断させることができる', () => {
	// 	const input = '****\n## foo\n****'
	// 	const result = headingParser({ input })
	//
	// 	// TODO パラグラフ、見出し、パラグラフとしてパースされるように実装する
	// 	throw new Error('Not implemented')
	// })
})
