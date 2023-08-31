import type { Parser } from '@dykarohora/funser/types'
import {
	eof,
	space,
	newline,
	anyChar,
	anyCharOf,
	seq,
	or,
	pipe,
	map,
	repeat,
	repeatTill,
	lookAhead,
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

const lineEnd = pipe(
	newline,
	or(eof)
)

const noTitle = pipe(
	space,
	repeat(),
	seq(lineEnd),
	map(() => undefined)
)

const withTitle = pipe(
	space,
	repeat({ min: 1 }),
	seq(
		pipe(
			anyChar,
			repeat(),
			lookAhead(lineEnd)
		)
	),
)

export const headingParser: Parser<Heading> =
	pipe(
		preSpace,
		seq(
			poundSignSequence,
			pipe(
				withTitle,
				or(noTitle)
			)
		),
		map(([, poundSignSequence, content]) => {
			const depth = poundSignSequence.length as 1 | 2 | 3 | 4 | 5 | 6

			if (content === undefined) {
				return {
					type: 'heading',
					depth,
					children: []
				}
			}

			const [, title] = content
			const trimmedTitle = title.join('').trim().replace(/(?<=\s)#+$/, '').trim()

			return trimmedTitle === '' || [...trimmedTitle].every(char => char === '#')
				? {
					type: 'heading',
					depth,
					children: []
				}
				: {
					type: 'heading',
					depth,
					children: [{
						type: 'text',
						value: trimmedTitle
					}]
				}
		})
	)
