import type { ParserInput, ParserOutput } from '@dykarohora/funser/types'
import {
	anyCharOf,
	eof,
	map,
	newline,
	option,
	orParser,
	pipe,
	repeat,
	seqParser,
	string
} from '@dykarohora/funser'
import { blockquoteLine } from './blockquoteParser.js'
import { blockParser } from './blockParser.js'
import { type Admotion } from '../../types/index.js'

function admotionLine({ input, position = 0 }: ParserInput) {
	return pipe(
		seqParser(
			pipe(
				anyCharOf(' '),
				repeat({ min: 0, max: 3 })
			),
			anyCharOf('>'),
			option(anyCharOf(' ')),
			string('[!'),
			pipe(
				orParser(
					string('info'),
					string('warning'),
					string('danger'),
					string('check'),
				)
			),
			string(']'),
			orParser(newline, eof)
		),
		map(([, , , , type]) => type)
	)({ input, position })
}

export function admotionParser({ input, position = 0 }: ParserInput): ParserOutput<Admotion> {
	return pipe(
		seqParser(
			admotionLine,
			pipe(
				blockquoteLine,
				repeat()
			)
		),
		map(([adType, children]) => {
			const result = blockParser({ input: children.join('') })

			if (result.type === 'Failure') {
				throw new Error(`[Bug: admotionParser] blockParser failed: ${result.reason}`)
			}

			return {
				type: 'admotion' as const,
				adType,
				children: result.value
			}
		})
	)({ input, position })
}

