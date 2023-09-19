import type { ParserInput, ParserOutput } from '@dykarohora/funser/types'
import type { BlockContent } from '../../types/index.js'
import { eof, map, newline, option, orParser, pipe, repeat, repeatTill, seqParser } from '@dykarohora/funser'
import { fenceCodeBlockParser } from './fenceCodeBlockParser.js'
import { headingParser } from './headingParser.js'
import { paragraphParser } from './paragraphParser.js'
import { blockquoteParser } from './blockquoteParser.js'
import { admotionParser } from './admotionParser.js'

export function blockParser({ input, position = 0 }: ParserInput): ParserOutput<BlockContent[]> {
	return pipe(
		pipe(
			seqParser(
				option(
					pipe(
						newline,
						repeat()
					)
				),
				orParser(
					fenceCodeBlockParser,
					headingParser,
					admotionParser,
					blockquoteParser,
					paragraphParser,
				),
			),
			map(([, block]) => block)
		),
		repeatTill(eof, { includeTillResult: false })
	)({ input, position })
}
