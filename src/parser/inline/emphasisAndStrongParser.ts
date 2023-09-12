import type { Parser, ParserInput, Success } from '@dykarohora/funser/types'
import type { Emphasis, Strong } from '../../types/index.js'
import type { ParserOutput } from '@dykarohora/funser/types'
import {
	anyChar,
	anyCharOf,
	map,
	not,
	orParser,
	pipe,
	repeatTill,
	seqParser,
	validate,
	whitespace
} from '@dykarohora/funser'
import { string } from '@dykarohora/funser'
import { inlineParser } from './inlineParser.js'

type StringToChars<S extends string> = S extends `${infer T}${infer Rest}`
	? T | StringToChars<Rest>
	: never

type EscapeChars = `\\${StringToChars<'!"#$%&\'()*+,-./:;<=>?@[]\\^_`{|}~'>}`

const escape: Parser<EscapeChars> =
	pipe(
		seqParser(
			anyCharOf('\\'),
			anyCharOf('!"#$%&\'()*+,-./:;<=>?@[]\\^_`{|}~')
		),
		map(chars => chars.join('') as EscapeChars)
	)

const noTrailingWhitespace = ({ value }: Success<string[]>): true | { reason: string } => {
	const tail = value.at(-1)

	return (tail && (whitespace({ input: tail }).type === 'Success')) ?? value.join('').trim().length === 0
		? { reason: 'whitespace is not allowed at the end of strong and emphasis', }
		: true
}

function base(delimiter: '*' | '**' | '***'): Parser<Emphasis | Strong> {
	return pipe(
		seqParser(
			string(delimiter),
			not(whitespace),
			pipe(
				orParser(escape, anyChar),
				repeatTill(
					string(delimiter),
					{ includeTillResult: false, consumption: true }
				),
				validate(noTrailingWhitespace)
			)
		),
		map(([, , chars]) => {
			const output = inlineParser({ input: chars.join('') })
			if (output.type === 'Failure') {
				throw new Error(`[bug]Unexpected error: ${output.reason}`)
			}

			switch (delimiter) {
				case '*':
					return {
						type: 'emphasis' as const,
						children: output.value
					}
				case '**':
					return {
						type: 'strong' as const,
						children: output.value
					}
				case '***':
					return {
						type: 'strong' as const,
						children: [{
							type: 'emphasis' as const,
							children: output.value
						}]
					}
				default:
					throw new Error(delimiter satisfies never)
			}
		})
	)
}

export function emphasisAndStrongParser({ input, position = 0 }: ParserInput): ParserOutput<Strong | Emphasis> {
	return orParser(base('***'), base('**'), base('*'))({ input, position })
}
