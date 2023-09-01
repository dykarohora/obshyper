import type { Parser } from '@dykarohora/funser/types'
import type { Text } from '../../types/index.js'
import {
	anyChar,
	eof,
	newline,
	anyCharOf,
	exactly,
	lookAhead,
	map,
	noCharOf,
	orParser,
	pipe,
	repeat, repeatTill,
	seq
} from '@dykarohora/funser'

const head =
	orParser(
		noCharOf('`'),
		pipe(
			anyCharOf('`'),
			repeat({ min: 1 }),
			map(chars => chars.join(''))
		)
	)

const end =
	pipe(
		anyCharOf(' '),
		repeat({ min: 2 }),
		seq(newline)
	)

const first: Parser<Text> =
	pipe(
		head,
		lookAhead(end),
		map(text => ({
			type: 'text',
			value: text
		}))
	)


const subA =
	pipe(
		anyChar,
		repeatTill(
			orParser(
				anyCharOf('\\<![`*_'),
				eof
			),
			{ consumption: false, includeTillResult: false }
		),
	)

const second: Parser<Text> =
	pipe(
		head,
		seq(subA),
		map(([h, t]) => ({
			type: 'text',
			value: h + t.join('')
		}))
	)

const subB =
	pipe(
		anyChar,
		repeat(),
		lookAhead(
			pipe(
				anyCharOf(' '),
				exactly(2),
				seq(newline)
			)
		),
		map(chars => chars.join(''))
	)

const third: Parser<Text> =
	pipe(
		head,
		seq(subB),
		map(a => ({
			type: 'text',
			value: a.join('')
		}))
	)

export const textParser: Parser<Text> =
	orParser(
		first,
		second,
		third
	)
