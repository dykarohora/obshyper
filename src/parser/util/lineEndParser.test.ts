import { pipe, seq, string } from '@dykarohora/funser'
import { lineEndParser } from './lineEndParser.js'

describe('lineEndParser', () => {
	const parser = pipe(
		string('a'),
		seq(lineEndParser)
	)

	it('入力が空のとき、パースに失敗する', () => {
		const input = ''
		const output = parser({ input })

		expect(output.type).toEqual('Failure')
	})

	it('入力が"a"のとき、パースに成功する', () => {
		const input = 'a'
		const output = parser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.state.position).toEqual(1)
	})

	it('入力がabのとき、パースに失敗する', () => {
		const input = 'ab'
		const output = parser({ input })

		expect(output.type).toEqual('Failure')
	})

	it('入力が"a\nb"のとき、パースに成功する', () => {
		const input = 'a\nb'
		const output = parser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.state.position).toEqual(2)
	})

	it('入力が"a\r\nb"のとき、パースに成功する', () => {
		const input = 'a\r\nb'
		const output = parser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.state.position).toEqual(3)
	})
})
