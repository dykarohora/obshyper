import { fenceCodeBlockParser } from './fenceCodeBlockParser.js'

describe('fenceCodeBlockParser', () => {
	it('コードブロックをパースできる', () => {
		const code =
			`\`\`\`js
const foo = 'bar'
const func = (str: string) => {
	return str
}

console.log(func(foo))
\`\`\``

		const output = fenceCodeBlockParser({ input: code })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		const expectedContent =
			`const foo = 'bar'
const func = (str: string) => {
	return str
}

console.log(func(foo))`

		expect(output.value.lang).toEqual('js')
		expect(output.value.value).toEqual(expectedContent)
	})

	it.each([
		['```foo```']
	])(`入力が「%s」のとき、パースに失敗する`, (input) => {
		const output = fenceCodeBlockParser({ input })

		expect(output.type).toEqual('Failure')
	})
})
