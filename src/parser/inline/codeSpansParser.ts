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

export const codeSpansParser: Parser<CodeSpans> =
	({ input, position = 0 }) => {
		const output = backQuotes({ input, position })

		if (output.type === 'Failure') {
			return output
		}

		const prefix = output.value.join('')

		const postfixParser =
			pipe(
				noCharOf('`'),
				seq(string(prefix)),
				seq(not(string('`'))),
				map(([[tail, _], __]) => tail)
			)

		const parser = pipe(
			anyChar,
			repeatTill(postfixParser),
		)

		const output2 = parser(output.state)

		if (output2.type === 'Failure') {
			return {
				...output2,
				state: { input, position }
			}
		}

		let content = output2.value.join('').replace(/\n/g, ' ')
		const hasNonSpaceChars = /[^ ]/.test(content)
		const hasSpaceCharsOnBothEnds = content.startsWith(' ') && content.endsWith(' ')
		if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
			content = content.substring(1, content.length - 1)
		}

		return {
			type: 'Success',
			value: {
				type: 'codeSpans',
				value: content
			},
			state: output2.state
		}
	}
