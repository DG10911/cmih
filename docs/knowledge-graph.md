# Knowledge graph

`/graph` renders an interactive knowledge graph (React Flow) over the demo data.

## Node types
Mineral · Technology · Patent · R&D · Organisation · Publication (Researcher/Application as roadmap).
Each type has a distinct token-based colour. Node-type toggles show/hide categories.

## Edges
Mineral → Technology (`technology.minerals`), Technology → Patent/R&D/Publication (by `.technology`),
Patent/R&D → Organisation (applicants / organisation). The graph prioritises the Lithium and Rare-Earth
ecosystems and caps node count for readability/performance.

## Interaction
Zoom, pan, minimap, node selection → right-hand detail panel (evidence, relationships, timeline,
sources), search-highlight, and an **Explore path** affordance
(Lithium → DLE → Patent → Organisation → Publication).

## Graph analytics (roadmap, labelled "network activity indicators", not influence rankings)
Degree centrality, organisation connectivity, technology clusters, mineral–technology relationships.
