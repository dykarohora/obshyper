import type { Parser } from '@dykarohora/funser/types'
import type { CodeSpans } from '../../types/index.js'
import {
	anyChar,
	anyCharOf,
	map,
	noCharOf,
	not,
	pipe,
	repeat,
	repeatTill,
	seq,
	string
} from '@dykarohora/funser'

const backQuotes = pipe(
	anyCharOf('`'),
	repeat({ min: 1 })
)

const format = (value: string[]) => {
	const content = value.join('').replace(/\n/g, ' ')
	const hasNonSpaceChars = /[^ ]/.test(content)
	const hasSpaceCharsOnBothEnds = content.startsWith(' ') && content.endsWith(' ')

	return hasNonSpaceChars && hasSpaceCharsOnBothEnds
		? content.substring(1, content.length - 1)
		: content
}

export const codeSpansParser: Parser<CodeSpans> =
	({ input, position = 0 }) => {
		const prefixParseResult = backQuotes({ input, position })

		if (prefixParseResult.type === 'Failure') {
			return prefixParseResult
		}

		const prefix = prefixParseResult.value.join('')

		const postfixParser =
			pipe(
				noCharOf('`'),
				seq(string(prefix)),
				seq(not(string('`'))),
				map(([[tail, _], __]) => tail)
			)

		return pipe(
			anyChar,
			repeatTill(postfixParser),
			map(
				(value) => ({
					type: 'codeSpans' as const,
					value: format(value)
				})
			)
		)(prefixParseResult.state)
	}
