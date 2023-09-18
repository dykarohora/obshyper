import type { Parser } from '@dykarohora/funser/types'
import type { InternalLink } from '../../types/index.js'
import { anyChar, map, noCharOf, option, orParser, pipe, repeatTill, seqParser, string } from '@dykarohora/funser'

const path =
	pipe(
		noCharOf('#^[]:\\'),
		repeatTill(orParser(string('|'), string(']]')), { includeTillResult: false, consumption: false }),
		map(chars => chars.join(''))
	)

const displayText =
	pipe(
		seqParser(
			string('|'),
			pipe(
				anyChar,
				repeatTill(string(']]'), { includeTillResult: false, consumption: false }),
			)
		),
		map(([, chars]) => chars.join(''))
	)

export const internalLinkParser: Parser<InternalLink> =
	pipe(
		seqParser(
			option(string('!')),
			string('[['),
			path,
			option(displayText),
			string(']]')
		),
		map(([embedding, _, path, text]) => ({
			type: 'internalLink',
			path,
			text: text.type === 'Some' ? text.value : path,
			embedding: embedding.type === 'Some'
		}))
	)
