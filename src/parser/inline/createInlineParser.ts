import type { Parser } from '@dykarohora/funser/types'
import type { InlineContent } from '../../types/index.js'
import { eof, map, orParser, pipe, repeatTill } from '@dykarohora/funser'

export const createInlineParser =
	(...parsers: Array<Parser<InlineContent>>) =>
		pipe(
			orParser(...parsers),
			repeatTill(eof, { includeTillResult: false }),
			map(
				(inlines) =>
					// Textコンテンツが連続している場合、それらを結合する
					inlines.reduce<InlineContent[]>(
						(acc, inline) => {
							const tail = acc.at(-1)

							if (tail && tail.type === 'text' && inline.type === 'text') {
								acc.splice(-1, 1, {
									type: 'text',
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
		)
