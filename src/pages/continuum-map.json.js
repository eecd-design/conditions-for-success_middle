import { getCollection } from "astro:content";
import { findIndexByKey } from "src/utilities/helpers";

let map = [];

// Get all indicators
let allIndicators = await getCollection("indicators");

// Add indicator data to the map
for (let indicator of allIndicators) {
	map.push({
		id: indicator.id.trim(),
		title: indicator.data.title.trim(),
		tag: indicator.data.tag.trim(),
		components: [],
		considerationCount: 0,
	});
}

// Get all indicator components
let allComponents = await getCollection("components");


for (let component of allComponents) {

	let indicatorIndex = findIndexByKey(map, 'id', component.data.indicator);
	if (indicatorIndex === -1) continue;

	let mapIndicator = map[indicatorIndex]; 

	// Add component data to the map
	mapIndicator.components.push({
		title: component.data.title.trim(),
		tag: component.data.tag.trim(),
		considerationCount: 0,
		phases: [
			{title: 'Initiating', considerations: [], considerationCount: 0},
			{title: 'Implementing', considerations: [], considerationCount: 0},
			{title: 'Developing', considerations: [], considerationCount: 0},
			{title: 'Sustaining', considerations: [], considerationCount: 0},
		]
	});

	let componentIndex = mapIndicator.components.length - 1;
	if (componentIndex === -1) continue;

	let mapComponent = mapIndicator.components[componentIndex];

	for (let mapPhase of mapComponent.phases) {

		if (!component.data[mapPhase.title.toLowerCase()]) continue;
	
		for (let consideration of component.data[mapPhase.title.toLowerCase()].considerations) {
	
			// Add consideration data to the map
			mapPhase.considerations.push({
				tag: consideration.tag.trim(),
				description: consideration.title.trim(),
			});
	
			// Update the consideration count at all levels
			mapIndicator.considerationCount += 1;
			mapComponent.considerationCount += 1;
			mapPhase.considerationCount += 1;
	
		}

	}

}

export function GET({ params, request }) {
  return new Response(
    JSON.stringify(map),
  );
}