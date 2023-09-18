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
\`\`\`
`

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
		expect(output.state.position).toEqual(code.length)
	})

	it('```とその後ろの改行までの入力を消費する', () => {
		const code =
			`\`\`\`js
const foo = 'bar'
\`\`\`

## Heading

hello
`

		const output = fenceCodeBlockParser({ input: code })

		if(output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.state.position).toEqual(28)

		const remain =
			`
## Heading

hello
`

		expect(code.slice(output.state.position)).toEqual(remain)
	})

	it.each([
		['```foo```']
	])(`入力が「%s」のとき、パースに失敗する`, (input) => {
		const output = fenceCodeBlockParser({ input })

		expect(output.type).toEqual('Failure')
	})
})
