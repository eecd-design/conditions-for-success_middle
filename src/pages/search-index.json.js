import { getCollection } from "astro:content";

let searchIndex = [];
let itemIndex = 1;

// Get all indicators
let allIndicators = await getCollection("indicators");
for (let indicator of allIndicators) {
	let indicatorData = {
		id: `loc-${itemIndex}`,
		category: 'indicator',
		title: indicator.data.title.toLowerCase().trim(),
		titleWords: indicator.data.title ? indicator.data.title.toLowerCase().trim().split(' ') : [],
		tag: indicator.data.tag.toLowerCase().trim(),
	}
	searchIndex.push(indicatorData);
	itemIndex += 1;
}

// Get all components
let allComponents = await getCollection("components");
for (let component of allComponents) {
	let componentData = {
		id: `loc-${itemIndex}`,
		category: 'component',
		title: component.data.title.toLowerCase().trim(),
		titleWords: component.data.title ? component.data.title.toLowerCase().trim().split(' ') : [],
		tag: component.data.tag.toLowerCase().trim(),
	}
	searchIndex.push(componentData);
	itemIndex += 1;

	let phases = ["initiating", "implementing", "developing", "sustaining"];
	for (let phase of phases) {
		for (let consideration of component.data[phase].considerations) {
			let considerationData = {
				id: `loc-${itemIndex}`,
				category: 'consideration',
				title: consideration.title.toLowerCase().trim(),
				titleWords: consideration.title ? consideration.title.toLowerCase().trim().split(' ') : [],
				tag: consideration.tag.toLowerCase().trim(),
			}
			searchIndex.push(considerationData);
			itemIndex += 1;
		}
	}
}

itemIndex = 1;

// Get all components
let allResources = await getCollection("resources", ({ data }) => {
	return data.published === true;
});
for (let resource of allResources) {
	let resourceData = {
		id: `res-${itemIndex}`,
		category: 'resource',
		title: resource.data.title.toLowerCase().trim(),
		titleWords: resource.data.title ? resource.data.title.toLowerCase().trim().split(' ') : [],
		description: resource.data.description ? resource.data.description.toLowerCase().trim() : '',
		descWords: resource.data.description ? resource.data.description.toLowerCase().trim().split(' ') : [],
		date: new Date(resource.data.dateAdded).getTime(),
		type: resource.data.type,
		indicators: resource.data.linkedIndicators,
		components: resource.data.linkedComponents,
		considerations: resource.data.linkedConsiderations,
	}
	searchIndex.push(resourceData);
	itemIndex += 1;
}


export function GET({ params, request }) {
	return new Response(
		JSON.stringify(searchIndex), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600, immutable'
		}
	}
	);
}