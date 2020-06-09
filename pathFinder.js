

var grid = document.querySelectorAll("td");
var grid_side_length = 10
var grid_matrix = [];
var html_grid_matrix = [];
var checkedNode = [];
var algoRunning = true;
var backtrace = {};

var startBox;
var endBox;




//Priority Queue
class priorityQueue{
    constructor(){
        this.collection = [];
    }

    enqueue(element){
        if(this.isEmpty()){
            this.collection.push(element);
        }
        else{
            let added = false;
            for(let i=1; i <= this.collection.length; i++){
                if(element[1]<this.collection[i-1][1]){
                    this.collection.splice(i-1, 0, element);
                    added = true;
                    break;
                }
            }
            if(!added){
                this.collection.push(element);
            }
        }
    };

    dequeue(){
        let value = this.collection.shift();
        return value;
    };

    isEmpty(){
        return (this.collection.length === 0)
    };
}

//initialise graph
class Graph{
    constructor(){
        this.adjacencyList = {};
        this.nodes = [[]];
    }

    addNode(node){
        this.nodes.push(node, true);
        this.adjacencyList[node] = [];
    }

    addEdge(base_node, neighbour_node, weight=1){
        this.adjacencyList[base_node].push({node: neighbour_node, weight: weight});
        this.adjacencyList[neighbour_node].push({node: base_node, weight: weight});
    }

    dijkstra(startNode, endNode){
        let times = {};
        
        let pq = new priorityQueue();
        

        this.nodes.forEach(node => {
            if(node !== startNode){
                times[node] = Infinity;
            }
            else{
                times[startNode] = 0;
            }
        });

        pq.enqueue([startNode, 0]);     
    
        while(!pq.isEmpty()){
            let shortestStep = pq.dequeue();
            let currentNode = shortestStep[0];

            //console.log(currentNode);

            var currentNodeHtml = html_grid_matrix[Number(currentNode[0])][Number(currentNode[1])];
            currentNodeHtml.classList.add("selectedNode");
            //currentNodeHtml.classList.add("selectedNode");

            this.adjacencyList[currentNode].forEach(neighbour => {
                let time = times[currentNode] + neighbour.weight;
                
                if(time<=times[neighbour.node]){

                    times[neighbour.node] = time;
                    backtrace[neighbour.node] = currentNode;
                    
                    if(checkedNode[Number(neighbour.node[0])][Number(neighbour.node[1])] == false){
                        pq.enqueue([neighbour.node, time]);
                    }
                    checkedNode[Number(neighbour.node[0])][ Number(neighbour.node[1])] = true;
                }
            });
        }
        algoRunning = false;
    }
}

//convert list to matrix
for(let i=0; i<grid_side_length; i++){
    html_grid_matrix[i]=[];
    grid_matrix[i]=[];
    checkedNode[i]=[]
    
    for(let j=0; j<grid_side_length; j++){
        html_grid_matrix[i][j] = grid[(10*i)+j];
        grid_matrix[i][j]=`${i}${j}`;
        checkedNode[i][j] = false;
    }
}

let map = new Graph();

for(let i=0; i<grid_side_length; i++){
    for(let j=0; j<grid_side_length; j++){
        map.addNode((grid_matrix[i][j]));
        
    }
}

//adding neighbours
for(let i=0; i<grid_side_length; i++){
    for(let j=0; j<grid_side_length; j++){
        if(i==0 && j==0){
            console.log((grid_matrix[i][j+1]));
            map.addEdge(((grid_matrix[i][j])), (grid_matrix[i+1][j]));
            map.addEdge(((grid_matrix[i][j])), (grid_matrix[i][j+1]));
        } 
        else if(i==grid_side_length-1 && j==0){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j+1]));
        } 
        else if(i==0 && j==grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i+1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
        } 
        else if(i==9 && j==grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
        } 
        else if(i==0 && j!=0 && j!=grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i+1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j+1]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
        } 
        else if(i==9 && j!=0 && j!=grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j+1]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
        } 
        else if(i!=grid_side_length-1 && i!=0 && j==0){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j+1]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i+1][j]));
        }
        else if(i!=9 && i!=0 && j==grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i+1][j]));
        }
        else if(i!=0 && i!=grid_side_length-1 && j!=0 && j!=grid_side_length-1){
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i-1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j-1]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i+1][j]));
            map.addEdge((grid_matrix[i][j]), (grid_matrix[i][j+1]));
        }
    }
}
function visualise(){
    var startNode = grid_matrix[0][0];
    var endNode = grid_matrix[9][9];
    map.dijkstra(startNode, endNode);
    finalSolution(startNode, endNode, backtrace);
    html_grid_matrix[9][9].style.backgroundColor = "#ff9966";
}

function finalSolution(startNode, endNode, backtrace){
    while(algoRunning){
        var i=0;
    }
    let path = [endNode];
        var lastStep = endNode;
        let temp = 0;
        //async function colorSolution(){
            //await updateNodeColor();
            while(lastStep!==startNode){
                path.unshift(backtrace[lastStep])
                lastStep = backtrace[lastStep];
                let lastStepNode = html_grid_matrix[Number(lastStep[0])][Number(lastStep[1])];
                lastStepNode.style.backgroundColor = "#ff9966";
            }
}