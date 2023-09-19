import type { ParserInput, ParserOutput } from '@dykarohora/funser/types'
import type { Blockquote } from '../../types/index.js'
import {
	anyChar,
	anyCharOf,
	eof,
	map,
	newline, option,
	orParser,
	pipe,
	repeat,
	repeatTill,
	seqParser
} from '@dykarohora/funser'
import { blockParser } from './blockParser.js'

export function blockquoteLine({ input, position = 0 }: ParserInput): ParserOutput<string> {
	return pipe(
		seqParser(
			pipe(
				anyCharOf(' '),
				repeat({ min: 0, max: 3 })
			),
			anyCharOf('>'),
			option(anyCharOf(' ')),
			pipe(
				anyChar,
				repeatTill(orParser(newline, eof)),
				map(chars => chars.join(''))
			)
		),
		map(([, , , content]) => content)
	)({ input, position })
}

export function blockquoteParser({ input, position = 0 }: ParserInput): ParserOutput<Blockquote> {
	return pipe(
		blockquoteLine,
		repeat({ min: 1 }),
		map(children => {
			const result = blockParser({ input: children.join('') })

			if (result.type === 'Failure') {
				throw new Error(`[Bug: blockquoteParser] blockParser failed: ${result.reason}`)
			}

			return {
				type: 'blockquote' as const,
				children: result.value
			}
		})
	)({ input, position })
}
