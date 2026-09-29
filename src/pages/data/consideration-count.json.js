import { getCollection } from 'astro:content';

// Get all indicators
let allIndicators = await getCollection('indicators');

// Get all indicator components
let allComponents = await getCollection('components');

let count = {
	continuum: {
		type: 'continuum',
		total: 0,
		initiating: 0,
		implementing: 0,
		developing: 0,
		sustaining: 0,
		components: allComponents.length,
	},
};

// Add indicator data to the object
for (let indicator of allIndicators) {
	let components = allComponents.filter((component) => component.data.indicator === indicator.id);
	count[indicator.data.tag] = {
		type: 'indicator',
		total: 0,
		initiating: 0,
		implementing: 0,
		developing: 0,
		sustaining: 0,
		components: components.length,
	};
}

for (let component of allComponents) {
	let componentTag = component.data.tag;
	let indicatorTag = componentTag.match(/^(\d+)\.\d+$/)[1];

	// Add component data to the object
	count[componentTag] = {
		type: 'component',
		total: 0,
		initiating: 0,
		implementing: 0,
		developing: 0,
		sustaining: 0,
	};

	let phases = ['initiating', 'implementing', 'developing', 'sustaining'];

	for (let phase of phases) {
		if (!component.data[phase]) continue;

		for (let consideration of component.data[phase].considerations) {
			// Add consideration connection data to the object
			count[consideration.tag] = {
				phase: phase,
				component: componentTag,
				indicator: indicatorTag,
			};

			// Update the consideration count at all levels
			count.continuum.total += 1;
			count.continuum[phase] += 1;
			count[indicatorTag].total += 1;
			count[indicatorTag][phase] += 1;
			count[componentTag].total += 1;
			count[componentTag][phase] += 1;
		}
	}
}

export function GET({ params, request }) {
	return new Response(JSON.stringify(count), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
}
