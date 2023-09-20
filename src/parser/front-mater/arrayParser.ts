import type { Parser } from '@dykarohora/funser/types'
import {
	anyChar,
	anyCharOf,
	eof,
	map,
	newline,
	option,
	orParser,
	pipe,
	repeat,
	repeatTill,
	seqParser,
	string
} from '@dykarohora/funser'

export type ArrayProperty<K extends string> = {
	key: K
	value: string[]
}

export const arrayParser =
	<K extends string>(key: K): Parser<ArrayProperty<K>> =>
		pipe(
			seqParser(
				string(`${key}:`),
				option(
					pipe(
						anyCharOf(' '),
						repeat()
					)
				),
				anyCharOf('['),
				pipe(
					anyChar,
					repeatTill(anyCharOf(']'), { consumption: true, includeTillResult: false }),
				),
				orParser(newline, eof)
			),
			map(([, , , chars]) => ({
				key,
				value: chars.join('').split(',').map(s => s.trim())
			}))
		)
