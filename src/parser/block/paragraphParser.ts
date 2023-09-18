import type { Parser } from '@dykarohora/funser/types'
import type { Paragraph } from '../../types/index.js'
import {
	anyChar,
	anyCharOf, eof,
	map,
	newline,
	noCharOf,
	not, orParser,
	pipe,
	repeat,
	repeatTill,
	seqParser,
	string
} from '@dykarohora/funser'
import { inlineParser } from '../inline/inlineParser.js'

// TODO ブロックコンテンツが増えるごとに修正する

const heading =
	seqParser(
		pipe(
			anyCharOf(' '),
			repeat({ min: 0, max: 3 }),
		),
		pipe(
			anyCharOf('#'),
			repeat({ min: 1, max: 6 }),
		),
		anyCharOf(' '),
	)

const fence =
	seqParser(
		string('```'),
		noCharOf('`'),
	)

export const paragraphParser: Parser<Paragraph> =
	pipe(
		seqParser(
			not(heading),
			not(fence),
			pipe(
				anyChar,
				repeatTill(orParser(newline, eof), { consumption: true, includeTillResult: false })
			)
		),
		map(([, , chars]) => {
			const result = inlineParser({ input: chars.join('') })

			if (result.type === 'Failure') {
				throw new Error(`[Bug: paragraphParser] inlineParser failed: ${result.reason}`)
			}

			return {
				type: 'paragraph',
				children: result.value
			}
		})
	)
