let eventControl = (() => {
	let registry = new Map() // eventType → Map(sourceId → { source, handlers: Set<fn> })

	let getSourceId = (source, selector) => {
		if (selector) return `selector:${selector}`
		if (source === document) return 'document'
		if (source === window) return 'window'
		if (source instanceof MediaQueryList) return `mql:${source.media}`
		if (source instanceof Element) return `elem:${source.tagName.toLowerCase()}#${source.id || 'anon'}`
		return 'unknown'
	}

	let attachListener = (eventType, source, sourceId) => {
		let entry = registry.get(eventType).get(sourceId)
		if (entry.listenerAttached) return

		if (source instanceof MediaQueryList) {
			source.addEventListener('change', (e) => {
				for (let fn of entry.handlers) fn(e, source)
			})
		} else {
			source.addEventListener(eventType, (e) => {
				for (let fn of entry.handlers) {
					let target = null
					if (entry.selector) {
						target = e.target.closest(entry.selector)
					} else {
						target = source
					}
					if (target) fn(e, target)
				}
			})
		}

		entry.listenerAttached = true
	}

	let add = ({ eventType, selector = null, elem = null, fn }) => {
		let source = elem ?? document
		let sourceId = getSourceId(source, selector)

		if (!registry.has(eventType)) registry.set(eventType, new Map())
		let eventMap = registry.get(eventType)

		if (!eventMap.has(sourceId)) {
			eventMap.set(sourceId, { source, selector, handlers: new Set(), listenerAttached: false })
		}

		let entry = eventMap.get(sourceId)
		if (!entry.handlers.has(fn)) {
			entry.handlers.add(fn)
			attachListener(eventType, source, sourceId)
		}
	}

	let remove = ({ eventType, selector = null, elem = null, fn }) => {
		let source = elem ?? document
		let sourceId = getSourceId(source, selector)
		let eventMap = registry.get(eventType)
		if (!eventMap) return

		let entry = eventMap.get(sourceId)
		if (!entry) return

		entry.handlers.delete(fn)

		// Clean up if no handlers remain
		if (entry.handlers.size === 0) {
			eventMap.delete(sourceId)
			if (eventMap.size === 0) registry.delete(eventType)
		}
	}

	return { add, remove, _registry: registry }
})()

export { eventControl }