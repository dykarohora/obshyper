import { frontMatterParser } from './frontMatterParser.js'
import type { FrontMatter } from '../../types/index.js'

describe('frontMatterParser', () => {
	it('ObsidianのYAML FrontMatterをパースできる', () => {
		const input =
			`---
date created: 2023-09-16T09:49:18+09:00
date modified: 2023-09-19T12:13:46+09:00
tags: [Cloudflare, Pages]
aliases: [Cloudflare Pages]
title: 🗺️Cloudflare Pages
---

## MOC

`
		const result = frontMatterParser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: FrontMatter = {
			title: '🗺️Cloudflare Pages',
			aliases: ['Cloudflare Pages'],
			tags: ['Cloudflare', 'Pages'],
			createdAt: new Date('2023-09-16T09:49:18+09:00'),
			updatedAt: new Date('2023-09-19T12:13:46+09:00'),
		}

		expect(result.value).toEqual(expected)
	})

	it('tagsとaliasesがなくてもパースできる', () => {
		const input =
			`---
date created: 2023-09-16T09:49:18+09:00
date modified: 2023-09-19T12:13:46+09:00
title: 🗺️Cloudflare Pages
---

## MOC

`
		const result = frontMatterParser({ input })
		if (result.type === 'Failure') {
			throw new Error('test failed')
		}

		const expected: FrontMatter = {
			title: '🗺️Cloudflare Pages',
			aliases: [],
			tags: [],
			createdAt: new Date('2023-09-16T09:49:18+09:00'),
			updatedAt: new Date('2023-09-19T12:13:46+09:00'),
		}

		expect(result.value).toEqual(expected)
	})
})
