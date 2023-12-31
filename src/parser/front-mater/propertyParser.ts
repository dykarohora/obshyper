import type { Parser } from '@dykarohora/funser/types'
import {
	anyChar,
	eof,
	newline,
	anyCharOf,
	map,
	option,
	orParser,
	pipe,
	repeat,
	repeatTill,
	seqParser,
	string
} from '@dykarohora/funser'

export type Property<K extends string> = {
	key: K
	value: string
}

export const propertyParser =
	<K extends string>(key: K): Parser<Property<K>> =>
		pipe(
			seqParser(
				string(`${key}:`),
				option(
					pipe(
						anyCharOf(' '),
						repeat()
					)
				),
				pipe(
					anyChar,
					repeatTill(orParser(newline, eof), { consumption: true, includeTillResult: false }),
				)
			),
			map(([, , chars]) => ({
				key,
				value: chars.join('')
			}))
		)
