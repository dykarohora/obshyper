import { propertyParser } from './propertyParser.js'

describe('propertyParser', () => {
	it('指定したキー名のプロパティを持っているかパースできる', () => {
		const parser = propertyParser('key')
		const input = 'key: value'

		const result = parser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(result.value).toEqual({ key: 'key', value: 'value' })
		expect(result.state.position).toEqual(input.length)
	})

	it('指定したキー名と入力が一致しない場合はパースに失敗する', () => {
		const parser = propertyParser('key')
		const input = 'prop: value'

		const result = parser({ input })
		expect(result.type).toEqual('Failure')
		expect(result.state.position).toEqual(0)
	})
})
