import type { Parser } from '@dykarohora/funser/types'
import type { Link } from '../../types/index.js'
import {
	anyChar,
	anyCharOf,
	map,
	noCharOf,
	not,
	option,
	orParser,
	pipe,
	repeat,
	repeatTill,
	seq,
	seqParser,
	string,
	whitespace
} from '@dykarohora/funser'
import { escapeParser } from './escapeParser.js'
import { codeSpansParser } from './codeSpansParser.js'
import { textParser } from './textParser.js'
import { createInlineParser } from './createInlineParser.js'


const brackets =
	pipe(
		anyCharOf('['),
		seq(
			pipe(
				anyChar,
				repeatTill(anyCharOf(']')),
				map(chars => chars.join(''))
			)
		),
		map(chars => chars.join(''))
	)

const escaped =
	pipe(
		anyCharOf('\\'),
		seq(anyChar),
		map(chars => chars.join(''))
	)

const linkText =
	pipe(
		not(string('[')),
		seq(
			pipe(
				orParser(brackets, escaped, noCharOf('[]\\')),
				repeat(),
				map(strings => strings.join(''))
			)
		),
		map(([_, title]) => title)
	)

const url =
	pipe(
		orParser(
			noCharOf('\n<>\\'),
			pipe(
				seqParser(anyCharOf('\\'), anyChar),
				map(chars => chars.join(''))
			)
		),
		repeat({ min: 1 }),
		map(chars => chars.join(''))
	)

const dest1 =
	pipe(
		seqParser(anyCharOf('<'), url, anyCharOf('>')),
		map(([, url,]) => url)
	)

const dest2 =
	pipe(
		noCharOf(' \n\t)'),
		repeat(),
		map(chars => chars.join(''))
	)

const linkDestination = orParser(dest1, dest2)

const title = (delimiter: '"' | '\'' | '(') =>
	pipe(
		anyCharOf(delimiter),
		seq(
			pipe(
				orParser(
					string(`\\${delimiter === '(' ? ')' : delimiter}`),
					noCharOf(`\\${delimiter === '(' ? ')' : delimiter}`)
				),
				repeat(),
				map(chars => chars.join(''))
			),
			anyCharOf(delimiter === '(' ? ')' : delimiter)
		)
	)

const linkTitle =
	pipe(
		whitespace,
		repeat({ min: 1 }),
		seq(
			orParser(title('"'), title('\''), title('('))
		)
	)

const inlineTextParser =
	createInlineParser(
		escapeParser,
		codeSpansParser,
		textParser
	)

export const linkParser: Parser<Link> =
	pipe(
		seqParser(
			anyCharOf('['),
			linkText,
			string(']('),
			pipe(
				whitespace,
				repeat(),
			),
			linkDestination,
			option(linkTitle),
			pipe(
				whitespace,
				repeat()
			),
			string(')')
		),
		map(([, link,, , url, t,]) => {
			const result = inlineTextParser({ input: link })

			if (result.type === 'Failure') {
				throw new Error(`[Bug] linkTextParser failed: ${result.reason}`)
			}

			if (t.type === 'None') {
				return {
					type: 'link',
					url: encodeURI(url),
					children: result.value
				}
			}

			const [, [, title,]] = t.value

			return {
				type: 'link',
				url: encodeURI(url),
				title,
				children: result.value
			}
		})
	)
