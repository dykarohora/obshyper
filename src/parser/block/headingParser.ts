import type { Parser } from '@dykarohora/funser/types'
import {
	space,
	anyChar,
	anyCharOf,
	seq,
	or,
	pipe,
	map,
	repeat,
	repeatTill,
} from '@dykarohora/funser'
import type { Heading } from '../../types/index.js'
import { lineEndParser } from '../util/lineEndParser.js'
import { constVoid } from '../util/constVoid.js'

const preSpace: Parser<Array<' '>> = pipe(
	anyCharOf(' '),
	repeat({ min: 0, max: 3 })
)

const poundSignSequence: Parser<Array<'#'>> = pipe(
	anyCharOf('#'),
	repeat({ min: 1, max: 6 }),
)

const noTitle: Parser<void> = pipe(
	space,
	repeatTill(lineEndParser),
	map(constVoid)
)

const withTitle: Parser<string> = pipe(
	space,
	repeat({ min: 1 }),
	seq(
		pipe(
			anyChar,
			repeatTill(lineEndParser)
		)
	),
	map(([_, content]) => content.join('').trim())
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

			const trimmedTitle = content.replace(/(?<=\s)#+$/, '').trim()
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
