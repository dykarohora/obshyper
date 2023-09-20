import type { Parser } from '@dykarohora/funser/types'
import type { FrontMatter } from '../../types/index.js'
import { map, newline, orParser, pipe, repeat, seqParser, string } from '@dykarohora/funser'
import { arrayParser, type ArrayProperty } from './arrayParser.js'
import type { Property } from './propertyParser.js'
import { propertyParser } from './propertyParser.js'

export const frontMatterParser: Parser<FrontMatter> =
	pipe(
		seqParser(
			string('---'),
			newline,
			pipe(
				orParser(
					arrayParser('tags'),
					arrayParser('aliases'),
					propertyParser('date created'),
					propertyParser('date modified'),
					propertyParser('title'),
				),
				repeat()
			),
			string('---'),
			newline,
		),
		map(
			([, , props]) => {
				type P = (ArrayProperty<'tags'> | ArrayProperty<'aliases'> | Property<'date created'> | Property<'date modified'> | Property<'title'>)

				const titleProp = props.find((prop: P): prop is Property<'title'> => prop.key === 'title')
				const createdAtProp = props.find((prop: P): prop is Property<'date created'> => prop.key === 'date created')
				const updatedAtProp = props.find((prop: P): prop is Property<'date modified'> => prop.key === 'date modified')

				if (!titleProp || !createdAtProp || !updatedAtProp) {
					throw new Error('[bug: frontMatterParser] Invalid front matter')
				}

				const tagsArray = props.find((prop: P): prop is ArrayProperty<'tags'> => prop.key === 'tags')
				const aliasesArray = props.find((prop: P): prop is ArrayProperty<'aliases'> => prop.key === 'aliases')

				return {
					title: titleProp.value,
					createdAt: new Date(createdAtProp.value),
					updatedAt: new Date(updatedAtProp.value),
					tags: tagsArray ? tagsArray.value : [],
					aliases: aliasesArray ? aliasesArray.value : [],
				}
			}
		)
	)
