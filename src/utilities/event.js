let eventControl = (() => {
	let registry = {}

	let ensureListener = (eventType) => {
		if (!registry[eventType]) {
			registry[eventType] = new Map()
			document.addEventListener(eventType, (e) => {
				// console.log(`Event Triggered (${eventType})`)
				for (let { selector, fn } of registry[eventType].values()) {
					let target;
					if (selector === 'document') {
						target = document
					} else if (selector === 'window') {
						target = window
					} else {
						target = e.target.closest(selector)
					}
					if (target) {
						// console.log(`Running Function (${fn.name}) in`, selector)
						fn(e, target)

					}
				}
			})
		}
	}

	let add = ({ eventType, selector, fn }) => {
		ensureListener(eventType)
		let key = `${selector}::${fn.toString()}`
		if (!registry[eventType].has(key)) {
			registry[eventType].set(key, { selector, fn })
		}
	}

	let remove = ({ eventType, selector, fn }) => {
		let key = `${selector}::${fn.toString()}`
		registry[eventType]?.delete(key)
	}

	return { add, remove }
})()

export { eventControl };