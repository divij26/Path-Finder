var grid = document.querySelectorAll("td");
var grid_side_length = 10
var grid_matrix = []; //collecting positions of nodes
var html_grid_matrix = []; //reference to actual grid
var checkedNode = []; // stops from checking node more than once
var algoRunning = true;
var backtrace = {}; //final solution
var time = 500; //for styling
var currentNodeHtml = []; //for animating algorithm

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
        if(neighbour_node!="wall"){
            this.adjacencyList[base_node].push({node: neighbour_node, weight: weight});
            this.adjacencyList[neighbour_node].push({node: base_node, weight: weight});
        }
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

            currentNodeHtml.push(html_grid_matrix[Number(currentNode[0])][Number(currentNode[1])]);

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

//make new Graph/Grid
let map = new Graph();

//add Nodes in Grid
for(let i=0; i<grid_side_length; i++){
    for(let j=0; j<grid_side_length; j++){
        map.addNode((grid_matrix[i][j]));    
    }
}

//add edges 
function addEdgePosition(pos, i, j){
    if(pos=="left"){
        if(html_grid_matrix[i][j-1]!=null){
            console.log("not wall" + html_grid_matrix[i][j]);
            return grid_matrix[i][j-1];
        }
        else{
            return "wall";
        }
    }
    if(pos=="right"){
        if(html_grid_matrix[i][j+1]!=null){
            return grid_matrix[i][j+1];
        }
        else{
            return "wall";
        }
    }
    if(pos=="top"){
        if(html_grid_matrix[i-1][j]!=null){
            return grid_matrix[i-1][j];
        }
        else{
            return "wall";
        }
    }
    if(pos=="bottom"){
        if(html_grid_matrix[i+1][j]!=null){
            return "wall";
        }
        else{
            return "wall";
        }
    }
    
}

//visualise algo
function visualise(){
    //adding neighbours
    for(let i=0; i<grid_side_length; i++){
        for(let j=0; j<grid_side_length; j++){
            if(html_grid_matrix[i][j]!=null){
                if(i==0 && j==0){
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("bottom", i, j));
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("right", i, j));
                } 
                else if(i==grid_side_length-1 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j));
                } 
                else if(i==0 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                } 
                else if(i==9 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                } 
                else if(i==0 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                } 
                else if(i==9 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                } 
                else if(i!=grid_side_length-1 && i!=0 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j));
                }
                else if(i!=9 && i!=0 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j));
                }
                else if(i!=0 && i!=grid_side_length-1 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j));
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j));
                }
            }
        }
    }

    var startNode = grid_matrix[0][0];
    var endNode = grid_matrix[9][9];
    map.dijkstra(startNode, endNode);
    coloryellow(currentNodeHtml);
    finalSolution(startNode, endNode, backtrace);
    
}

function algoStyling(currentNodeHtml){
    let uniqueSet = new Set(currentNodeHtml);
    uniqueCurrentNodeHtml = [...uniqueSet]; 
    let listlength = uniqueCurrentNodeHtml.length;
    for(let i=0; i< listlength; i++){
        time += 100;
        setTimeout(()=>{
        uniqueCurrentNodeHtml[i].style.backgroundColor = "yellow";   
    }, time);}
}

function finalSolution(startNode, endNode, backtrace){
    while(algoRunning){
        var i=0;
    }
    let path = [endNode];
        var lastStep = endNode;
        let time_final = time+50;
        while(lastStep!==startNode){
            time_final += 250;
            path.unshift(backtrace[lastStep])
            lastStep = backtrace[lastStep];
            let lastStepNode = html_grid_matrix[Number(lastStep[0])][Number(lastStep[1])];
            setTimeout(()=>lastStepNode.style.backgroundColor = "#ff9966", time_final);   
        }
        setTimeout(()=>html_grid_matrix[9][9].style.backgroundColor = "#ff9966", time_final);
            
}

function addWall(){
    var checkbox = document.querySelector("#check");
    if(checkbox.checked){
        console.log("In");
        for(let i=0; i<grid_side_length; i++){
            for(let j=0; j<grid_side_length; j++){
                //console.log(html_grid_matrix);
                if(html_grid_matrix[i][j]){
                    html_grid_matrix[i][j].addEventListener("click", function(){
                        for(let p=0; p<grid_side_length; p++){
                            for(let q=0; q<grid_side_length; q++){
                                //console.log(this);
                                //console.log(html_grid_matrix[0][9]);
                                if(html_grid_matrix[p][q] == this){
                                    console.log("In makewall if")
                                    html_grid_matrix[p][q].style.backgroundColor = "black";
                                    html_grid_matrix[p][q] = null;
                                    console.log(this);
                                }
                            }
                        }
                    });
                }
            }
        }
        
    }
    
}

