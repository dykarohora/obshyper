import type { Parser } from '@dykarohora/funser/types'
import {
	space,
	anyChar,
	anyCharOf,
	seq,
	pipe,
	map,
	repeat,
	repeatTill,
	orParser,
} from '@dykarohora/funser'
import type { Heading } from '../../types/index.js'
import { lineEndParser } from '../util/lineEndParser.js'
import { constVoid } from '../util/constVoid.js'
import { inlineParser } from '../inline/inlineParser.js'

const preSpace: Parser<Array<' '>> = pipe(
	anyCharOf(' '),
	repeat({ min: 0, max: 3 })
)

const poundSignSequence: Parser<Array<'#'>> = pipe(
	anyCharOf('#'),
	repeat({ min: 1, max: 6 }),
)

const noContent: Parser<void> = pipe(
	space,
	repeatTill(lineEndParser),
	map(constVoid)
)

const withContent: Parser<string> = pipe(
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
			orParser(withContent, noContent)
		),
		map(([, poundSignSequence, contentStr]) => {
			const depth = poundSignSequence.length as 1 | 2 | 3 | 4 | 5 | 6
			const contentParseResult =
				pipe(
					inlineParser,
					map(
						(inlines) =>
							inlines.length === 1 &&
							inlines[0]?.type === 'text' &&
							[...inlines[0].value].every(char => char === '#')
								? []
								: inlines
					)
				)
				({ input: contentStr?.replace(/(?<=\s)#+$/, '').trim() ?? '' })

			if (contentParseResult.type === 'Failure') {
				throw new Error(`[Bug] inlineParser failed: ${contentParseResult.reason}`)
			}

			return {
				type: 'heading',
				depth,
				children: contentParseResult.value
			}
		})
	)
