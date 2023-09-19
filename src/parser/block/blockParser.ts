import type { ParserInput, ParserOutput } from '@dykarohora/funser/types'
import type { BlockContent } from '../../types/index.js'
import { eof, orParser, pipe, repeatTill } from '@dykarohora/funser'
import { fenceCodeBlockParser } from './fenceCodeBlockParser.js'
import { headingParser } from './headingParser.js'
import { paragraphParser } from './paragraphParser.js'
import { blockquoteParser } from './blockquoteParser.js'
import { admotionParser } from './admotionParser.js'

export function blockParser({ input, position = 0 }: ParserInput): ParserOutput<BlockContent[]> {
	return pipe(
		orParser(
			fenceCodeBlockParser,
			headingParser,
			admotionParser,
			blockquoteParser,
			paragraphParser,
		),
		repeatTill(eof, { includeTillResult: false })
	)({ input, position })
}
