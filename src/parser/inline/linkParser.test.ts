import { linkParser } from './linkParser.js'

describe('linkParser', () => {
	test.each([
		[
			'[link](   /uri\n  "title"  )',
			{
				type: 'link',
				url: '/uri',
				title: 'title',
				children: [{ type: 'text', value: 'link' }]
			}
		],
		[
			'[link](   /uri  "title"  )',
			{
				type: 'link',
				url: '/uri',
				title: 'title',
				children: [{ type: 'text', value: 'link' }]
			}
		],
		[
			'[hello](https://example.com)',
			{
				type: 'link',
				url: 'https://example.com',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'[hello](https://example.com "title")',
			{
				type: 'link',
				url: 'https://example.com',
				title: 'title',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'[hello](https://example.com \'title\')',
			{
				type: 'link',
				url: 'https://example.com',
				title: 'title',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'[hello](https://example.com (title))',
			{
				type: 'link',
				url: 'https://example.com',
				title: 'title',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'[](https://example.com)',
			{
				type: 'link',
				url: 'https://example.com',
				children: []
			}
		],
		[
			'[]()',
			{
				type: 'link',
				url: '',
				children: []
			}
		],
		[
			'[hello](</my url>)',
			{
				type: 'link',
				url: '/my%20url',
				children: [{ type: 'text', value: 'hello' }]
			}
		],
		[
			'[a](<b)c>)',
			{
				type: 'link',
				url: 'b)c',
				children: [{ type: 'text', value: 'a' }]
			}
		],
		[
			'[link](http://example.com?foo=3#frag)',
			{
				type: 'link',
				url: 'http://example.com?foo=3#frag',
				children: [{ type: 'text', value: 'link' }]
			}
		],
		[
			'[link](foo\\bar)',
			{
				type: 'link',
				url: 'foo%5Cbar',
				children: [{ type: 'text', value: 'link' }]
			}
		],
		[
			'[link]("title")',
			{
				type: 'link',
				url: '%22title%22',
				children: [{ type: 'text', value: 'link' }]
			}
		],
		[
			'[he`ll`o](https://example.com)',
			{
				type: 'link',
				url: 'https://example.com',
				children: [
					{ type: 'text', value: 'he' },
					{ type: 'codeSpans', value: 'll' },
					{ type: 'text', value: 'o' }
				]
			}
		],
		[
			'[foo*](/uri)',
			{
				type: 'link',
				url: '/uri',
				children: [
					{ type: 'text', value: 'foo*' },
				]
			}
		],
	])('入力が「%s」のとき、パースに成功する', (input, expected) => {
		const output = linkParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
		expect(output.state.position).toEqual(input.length)
	})

	it.each([
		['[hello](/my url)'],
		['[hello] (/my url)'],
		['[hello](foo\nbar)'],
		['[hello](<foo\nbar>)'],
		['[[link]](/uri)'],
		['[link](/url "title "and" title")'],
		['[link] bar](/uri)'],
	])(`入力が「%s」のとき、パースに失敗する`, (input) => {
		const output = linkParser({ input })
		expect(output.type).toEqual('Failure')
		expect(output.state.position).toEqual(0)
	})
})
