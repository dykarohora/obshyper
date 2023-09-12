import { inlineParser } from './inlineParser.js'

describe('inlineParser', () => {
	it.each([
		[
			'**hello****',
			[
				{ type: 'strong', children: [{ type: 'text', value: 'hello' }] },
				{ type: 'text', value: '**' }
			]
		],
		[
			'*hello****',
			[
				{ type: 'emphasis', children: [{ type: 'text', value: 'hello' }] },
				{ type: 'text', value: '***' }
			]
		],
		[
			'foo*bar*',
			[
				{ type: 'text', value: 'foo' },
				{ type: 'emphasis', children: [{ type: 'text', value: 'bar' }] }
			]
		],
		[
			'* hello*',
			[
				{ type: 'text', value: '* hello*' }
			]
		],
		[
			'** hello**',
			[
				{ type: 'text', value: '** hello**' }
			]
		],
		[
			'*hello *',
			[
				{ type: 'text', value: '*hello *' }
			]
		],
		[
			'**hello **',
			[
				{ type: 'text', value: '**hello **' }
			]
		],
		[
			'*hello\n*',
			[
				{ type: 'text', value: '*hello\n*' }
			]
		],
		[
			'**hello\t**',
			[
				{ type: 'text', value: '**hello\t**' }
			]
		],
		[
			'**',
			[
				{ type: 'text', value: '**' }
			]
		],
		[
			'5*6*78',
			[
				{ type: 'text', value: '5' },
				{ type: 'emphasis', children: [{ type: 'text', value: '6' }] },
				{ type: 'text', value: '78' }
			]
		],
		[
			'aa*"bb"*cc',
			[
				{ type: 'text', value: 'aa' },
				{ type: 'emphasis', children: [{ type: 'text', value: '"bb"' }] },
				{ type: 'text', value: 'cc' }
			]
		],
		[
			'foo-*(bar)*-',
			[
				{ type: 'text', value: 'foo-' },
				{ type: 'emphasis', children: [{ type: 'text', value: '(bar)' }] },
				{ type: 'text', value: '-' }
			]
		],
		[
			'*foo*bar',
			[
				{ type: 'emphasis', children: [{ type: 'text', value: 'foo' }] },
				{ type: 'text', value: 'bar' }
			]
		],
		[
			'*(bar)*.',
			[
				{ type: 'emphasis', children: [{ type: 'text', value: '(bar)' }] },
				{ type: 'text', value: '.' }
			]
		],
		[
			'**hello***',
			[
				{ type: 'strong', children: [{ type: 'text', value: 'hello' }] },
				{ type: 'text', value: '*' }
			]
		],
		[
			'hello, `world`!!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'codeSpans', value: 'world' },
				{ type: 'text', value: '!!' },
			]
		],
		[
			'`hello`, world `!!`',
			[
				{ type: 'codeSpans', value: 'hello' },
				{ type: 'text', value: ', world ' },
				{ type: 'codeSpans', value: '!!' },
			]
		],
		[
			'hello, \\*world\\*!!',
			[
				{ type: 'text', value: 'hello, *world*!!' },
			]
		],
		[
			'hello, [[world]] !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'internalLink', text: 'world', path: 'world', embedding: false },
				{ type: 'text', value: ' !!' },
			]
		],
		[
			'hello, [[test|world]] !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'internalLink', text: 'world', path: 'test', embedding: false },
				{ type: 'text', value: ' !!' },
			]
		],
		[
			'hello, [world](http://example.com) !!',
			[
				{ type: 'text', value: 'hello, ' },
				{ type: 'link', url: 'http://example.com', children: [{ type: 'text', value: 'world' }] },
				{ type: 'text', value: ' !!' },
			]
		]
	])('入力が%sのとき、パースに成功する', (input, expected) => {
		const output = inlineParser({ input })

		if (output.type === 'Failure') {
			throw new Error('test failed')
		}

		expect(output.value).toEqual(expected)
	})
})
