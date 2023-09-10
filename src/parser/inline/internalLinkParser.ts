import type { Parser } from '@dykarohora/funser/types'
import type { InternalLink } from '../../types/index.js'
import { anyChar, map, noCharOf, option, orParser, pipe, repeatTill, seq, seqParser, string } from '@dykarohora/funser'

export const internalLinkParser: Parser<InternalLink> =
	pipe(
		seqParser(
			option(string('!')),
			string('[['),
			pipe(
				noCharOf('#^[]/:\\'),
				repeatTill(orParser(string('|'), string(']]')), { includeTillResult: false, consumption: false }),
				map(chars => chars.join('')),
				seq(
					pipe(
						string('|'),
						seq(
							pipe(
								anyChar,
								repeatTill(string(']]'), { includeTillResult: false, consumption: false }),
								map(chars => chars.join(''))
							)
						),
						option
					)
				)
			),
			string(']]')
		),
		map(([embedding, , [path, text]]) => {

			const internalLink: InternalLink = {
				type: 'internalLink',
				path,
				text: text.type === 'Some' ? text.value[1] : path,
				embedding: embedding.type === 'Some'
			}

			return internalLink
		})
	)
