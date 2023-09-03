import { codeSpansParser } from './codeSpansParser.js'
import { type ParserOutput } from '@dykarohora/funser'
import { type CodeSpans } from '../../types/index.js'

describe('CodeSpansParser', () => {
	it.each([
		['`foo`', 'foo'],
		['`` foo ` bar ``', 'foo ` bar'],
		['` `` `', '``'],
		['`  ``  `', '``'],
		['` a`', ' a'],
		['`　a　`', '　a　'],
		['`  `', '  '],
		['`　`', '　'],
		['``\nfoo\nbar  \nbaz``', 'foo bar   baz'],
		['``\nfoo \n``', 'foo '],
		['`foo   bar \nbaz`', 'foo   bar  baz'],
		['`foo\\`bar`', 'foo\\'],
		['` foo `` bar `', 'foo `` bar'],
	])('入力が「%s」のとき、パースに成功し結果として「%s」を取得できる', (input, expected) => {
		const output = codeSpansParser({ input })
		const expectedOutput: ParserOutput<CodeSpans> = {
			type: 'Success',
			value: { type: 'codeSpans', value: expected },
			state: { input, position: input.length }
		}

		expect(output).toEqual(expectedOutput)
	})

	it.each([
		['```foo``'],
		['`foo'],
	])(`入力が「%s」のとき、パースに失敗する`, (input) => {
		const output = codeSpansParser({ input })

		expect(output.type).toEqual('Failure')
	})
})

// TODO 以下のパターンのテストケースが必要
// 「*foo`*`」
// 「[not a `link](/foo`)」
// 「`<a href="`">`」
// 「`<http://foo.bar.`baz>`」
// 「<http://foo.bar.`baz>`」
// https://spec.commonmark.org/0.30/#backtick-string
