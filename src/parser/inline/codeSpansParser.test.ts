import { codeSpansParser } from './codeSpansParser.js'
import type { ParserOutput } from '@dykarohora/funser'
import type { CodeSpans } from '../../types/index.js'

describe('CodeSpansParser', () => {
	it.each([
		['`a`', 'a', 3],
		['`foo`', 'foo', 5],
		['``foo``', 'foo', 7],
		['`` foo ` bar ``', 'foo ` bar', 15],
		['` `` `', '``', 6],
		['`  ``  `', ' `` ', 8],
		['` a`', ' a', 4],
		['`　a　`', '　a　', 5],
		['`  `', '  ', 4],
		['`　`', '　', 3],
		['``\nfoo\nbar  \nbaz\n``', 'foo bar   baz', 19],
		['``\nfoo \n``', 'foo ', 10],
		['`foo   bar \nbaz`', 'foo   bar  baz', 16],
		['`foo\\`bar`', 'foo\\', 6],
		['` foo `` bar `', 'foo `` bar', 14],
	])('入力が「%s」のとき、パースに成功し結果として「%s」を取得できる', (input, expected, lastIndex) => {
		const output = codeSpansParser({ input })
		const expectedOutput: ParserOutput<CodeSpans> = {
			type: 'Success',
			value: { type: 'codeSpans', value: expected },
			state: { input, position: lastIndex }
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
