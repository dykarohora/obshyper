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

	return tail && (whitespace({ input: tail }).type === 'Success')
		? { reason: 'whitespace is not allowed at the end of strong and emphasis', }
		: true
}

function emphasis({ input, position = 0 }: ParserInput): ParserOutput<Emphasis> {
	return pipe(
		seqParser(
			string('*'),
			not(orParser(whitespace, string('*'))),
			pipe(
				orParser(string('**'), escape, anyChar),
				repeatTill(
					seqParser(not(string('**')), string('*')),
					{ includeTillResult: false, consumption: true }
				),
				validate(noTrailingWhitespace)
			)
		),
		map(([, , chars]) => {
			const value = chars.join('')
			const output = inlineParser({ input: value })
			if (output.type === 'Failure') {
				throw new Error(`[bug]Unexpected error: ${output.reason}`)
			}

			return {
				type: 'emphasis' as const,
				children: output.value
			}
		})
	)({ input, position })
}

function strong({ input, position = 0 }: ParserInput): ParserOutput<Strong> {
	return pipe(
		seqParser(
			string('**'),
			not(whitespace),
			pipe(
				orParser(escape, anyChar),
				repeatTill(
					string('**'),
					{ includeTillResult: false, consumption: true }
				),
				validate(noTrailingWhitespace)
			)
		),
		map(([, , chars]) => {
			const value = chars.join('')
			const output = inlineParser({ input: value })
			if (output.type === 'Failure') {
				throw new Error(`[bug]Unexpected error: ${output.reason}`)
			}

			return {
				type: 'strong' as const,
				children: output.value
			}
		})
	)({ input, position })
}

function emphasisAndStrong({ input, position = 0 }: ParserInput): ParserOutput<Strong> {
	return pipe(
		seqParser(
			string('***'),
			not(whitespace),
			pipe(
				orParser(escape, anyChar),
				repeatTill(
					string('***'),
					{ includeTillResult: false, consumption: true }
				),
				validate(noTrailingWhitespace)
			)
		),
		map(([, , chars]) => {
			const value = chars.join('')
			const output = inlineParser({ input: value })
			if (output.type === 'Failure') {
				throw new Error(`[bug]Unexpected error: ${output.reason}`)
			}

			return {
				type: 'strong' as const,
				children: [{
					type: 'emphasis' as const,
					children: output.value
				}]
			}
		})
	)({ input, position })
}

export function emphasisAndStrongParser({ input, position = 0 }: ParserInput): ParserOutput<Strong | Emphasis> {
	return orParser(emphasisAndStrong, strong, emphasis)({ input, position })
}
