import type { ParserInput, ParserOutput } from '@dykarohora/funser/types'
import type { InlineContent } from '../../types/index.js'
import { eof, map, orParser, pipe, repeatTill } from '@dykarohora/funser'
import { codeSpansParser } from './codeSpansParser.js'
import { textParser } from './textParser.js'
import { escapeParser } from './escapeParser.js'
import { linkParser } from './linkParser.js'
import { internalLinkParser } from './internalLinkParser.js'
import { emphasisAndStrongParser } from './emphasisAndStrongParser.js'

export function inlineParser({ input, position = 0 }: ParserInput): ParserOutput<InlineContent[]> {
	return pipe(
		orParser(
			escapeParser,
			linkParser,
			internalLinkParser,
			emphasisAndStrongParser,
			codeSpansParser,
			textParser
		),
		repeatTill(eof, { includeTillResult: false }),
		map(
			(inlines) =>
				// Textコンテンツが連続している場合、それらを結合する
				inlines.reduce<InlineContent[]>(
					(acc, inline) => {
						const tail = acc.at(-1)

						if (tail && tail.type === 'text' && inline.type === 'text') {
							acc.splice(-1, 1, {
								type: 'text' as const,
								value: tail.value + inline.value
							})
						} else {
							acc.push(inline)
						}

						return acc
					},
					[]
				)
		)
	)({ input, position })
}
