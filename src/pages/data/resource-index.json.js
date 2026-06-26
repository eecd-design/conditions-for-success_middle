import { getCollection } from 'astro:content';

let resourceIndex = [];
let itemIndex = 1;

// Get all resources
let allResources = await getCollection('resources', ({ data }) => {
	return data.published === true;
});

for (let resource of allResources) {
	let resourceData = {
		id: `res-${itemIndex}`,
		title: resource.data.title.toLowerCase().trim(),
		description: resource.data.description
			? resource.data.description.toLowerCase().trim()
			: '',
		type: resource.data.type,
	};
	resourceIndex.push(resourceData);
	itemIndex += 1;
}

export function GET({ params, request }) {
	return new Response(JSON.stringify(resourceIndex), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
}
