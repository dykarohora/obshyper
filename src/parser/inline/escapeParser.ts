import type { Parser } from '@dykarohora/funser/types'
import type { Text } from '../../types/index.js'
import { anyCharOf, map, pipe, seqParser } from '@dykarohora/funser'

/**
 * エスケープシーケンスのパーサ
 */
export const escapeParser: Parser<Text> =
	pipe(
		seqParser(
			anyCharOf('\\'),
			anyCharOf('!"#$%&\'()*+,-./:;<=>?@[]\\^_`{|}~')
		),
		map(([, char]) => ({
				type: 'text',
				value: char
			})
		)
	)
