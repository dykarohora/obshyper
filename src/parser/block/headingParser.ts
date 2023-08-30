import type { Parser } from '@dykarohora/funser/types'
import {
	anyCharOf,
	eof,
	lookAhead,
	space,
	map,
	newline,
	noCharOf,
	or,
	orParser,
	pipe,
	repeat,
	seq
} from '@dykarohora/funser'
import type { Heading } from '../../types/index.js'

const preSpace = pipe(
	anyCharOf(' '),
	repeat({ min: 0, max: 3 })
)

const poundSignSequence = pipe(
	anyCharOf('#'),
	repeat({ min: 1, max: 6 }),
)

// コンテンツなし
// 以下のOR
// 1. 改行
// 2. EOF
// 3. スペースかタブの連続からの改行orEOF

const noTitle = pipe(
	space,
	repeat(),
	seq(orParser(newline, eof)),
	map(_ => undefined)
)

// コンテンツあり
// 以下のSEQ
// 1. スペースかタブの連続
// 2. 改行を除く任意の文字の連続
// 3. 改行orEOF

const title = pipe(
	noCharOf('\n'),
	repeat()
)

const end = orParser(newline, eof)

const withTitle = pipe(
	space,
	repeat({ min: 1 }),
	seq(title, end),
)

const content = orParser(withTitle, noTitle)


const trimTitle = (title: string) => title.trim().replace(/(?<=\s)#+$/, '').trim()

export const headingParser: Parser<Heading> =
	pipe(
		preSpace,
		seq(poundSignSequence, content),
		map(([_, poundSignSequence, title]) => {
			const depth = poundSignSequence.length as 1 | 2 | 3 | 4 | 5 | 6

			if (title) {
				const [_, b, __] = title

				const trimmedTitle = trimTitle(b.join('')).trim()

				if (trimmedTitle === '') {
					return {
						type: 'heading',
						depth,
						children: []
					}
				}

				if ([...trimmedTitle].every(char => char === '#')) {
					return {
						type: 'heading',
						depth,
						children: []
					}
				}

				return {
					type: 'heading',
					depth,
					children: [{
						type: 'text',
						value: trimmedTitle
					}]
				}
			}


			return {
				type: 'heading',
				depth,
				children: []
			}

		})
	)

