import { textParser } from './textParser.js'
import type { ParserOutput } from '@dykarohora/funser'
import type { Text } from '../../types/index.js'

// TODO テストケースの充実が必要

describe('textParser', () => {
	it('入力が"hello"のとき、インラインテキストとしてパースに成功する', () => {
		const input = 'hello'
		const result = textParser({ input })

		const expected: ParserOutput<Text> = {
			type: 'Success',
			value: { type: 'text', value: 'hello' },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it('入力が"`hello"のとき、インラインテキストとしてパースに成功する', () => {
		const input = '`hello'
		const result = textParser({ input })

		const expected: ParserOutput<Text> = {
			type: 'Success',
			value: { type: 'text', value: '`hello' },
			state: { input, position: input.length }
		}

		expect(result).toEqual(expected)
	})

	it('入力が"hel*lo"のとき、インラインテキストとしてパースに成功する', () => {
		const input = 'hel*lo'
		const result = textParser({ input })

		const expected: ParserOutput<Text> = {
			type: 'Success',
			value: { type: 'text', value: 'hel' },
			state: { input, position: 3 }
		}

		expect(result).toEqual(expected)
	})
})
