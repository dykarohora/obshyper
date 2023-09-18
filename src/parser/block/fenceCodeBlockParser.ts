import type { FenceCodeBlock } from '../../types/index.js'
import type { Parser } from '@dykarohora/funser/types'
import {
	anyChar,
	eof,
	map,
	newline, noCharOf,
	option,
	orParser,
	pipe,
	repeat,
	repeatTill,
	seqParser,
	space,
	string
} from '@dykarohora/funser'

const langParser =
	pipe(
		noCharOf('`'),
		repeatTill(newline, { consumption: false, includeTillResult: false }),
		map(chars => chars.join(''))
	)

const startSequence =
	pipe(
		seqParser(
			pipe(
				space,
				repeat({ min: 0, max: 3 })
			),
			string('```'),
			option(langParser),
			newline
		),
		map(([, , lang]) => lang)
	)

const content =
	pipe(
		anyChar,
		repeatTill(
			seqParser(
				newline,
				string('```'),
				orParser(newline, eof)
			),
			{ consumption: true, includeTillResult: false }),
		map(chars => chars.join(''))
	)

export const fenceCodeBlockParser: Parser<FenceCodeBlock> =
	pipe(
		seqParser(
			startSequence,
			content
		),
		map(
			([lang, content]) => ({
				type: 'code',
				lang: lang.type === 'Some' ? lang.value : undefined,
				value: content
			}))
	)
