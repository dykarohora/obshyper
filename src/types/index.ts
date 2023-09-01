export type Heading = {
	type: 'heading'
	depth: 1 | 2 | 3 | 4 | 5 | 6
	children: InlineContent[]
}

export type Text = {
	type: 'text'
	value: string
}

export type Strong = {
	type: 'strong'
	children: InlineContent[]
}


export type BlockContent =
	| Heading

export type InlineContent =
	| Text
