import { arrayParser } from './arrayParser.js'

describe('arrayParser', () => {
	it('指定したキー名のプロパティが配列型ならばパースに成功する', () => {
		const parser = arrayParser('fruit')
		const input = 'fruit: [apple, orange, banana]'

		const result = parser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected = {
			key: 'fruit',
			value: ['apple', 'orange', 'banana']
		}

		expect(result.value).toEqual(expected)
		expect(result.state.position).toEqual(input.length)
	})

	it('指定したキー名と入力が一致しない場合はパースに失敗する', () => {
		const parser = arrayParser('meal')
		const input = 'fruit: [apple, orange, banana]'

		const result = parser({ input })
		expect(result.type).toEqual('Failure')
		expect(result.state.position).toEqual(0)
	})

	it('指定したキー名のプロパティが配列型でない場合はパースに失敗する', () => {
		const parser = arrayParser('fruit')
		const input = 'fruit: apple, orange, banana'

		const result = parser({ input })
		expect(result.type).toEqual('Failure')
		expect(result.state.position).toEqual(0)
	})
})
