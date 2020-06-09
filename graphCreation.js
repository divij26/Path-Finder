class Graph{
    constructor(){
        this.nodes = [];
        this.adjacencyList = {};
    }

    addNode(node){
        this.nodes.push(node);
        this.adjacencyList[node] = [];
    }

    addEdge(base_node, neighbour_node, weight){
        this.adjacencyList[base_node].push({node: neighbour_node});
        this.adjacencyList[neighbour_node].push({node: base_node});
    }
}