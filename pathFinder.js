var grid = document.querySelectorAll("td");
var grid_side_length = 10
var grid_matrix = []; //collecting positions of nodes
var html_grid_matrix = []; //reference to actual grid
var checkedNode = []; // stops from checking node more than once
var algoRunning = false;
var backtrace = {}; //final solution
var time = 500; //for styling
var currentNodeHtml = []; //for animating algorithm
var timers = [];
var timers2 = [];
var weights = [];
var valuesAssigned = false;
var img = document.querySelectorAll(".weights"); //for both weights and walls
var images = [];
var mouseDown = false;
var startNode;
var endNode;
var checkWall = true;
var checkWeight = true;

document.body.onmousedown = () => mouseDown = true;
document.body.onmouseup = () => mouseDown = false;

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

    addEdge(base_node, neighbour_node, weight){
        if(neighbour_node!="wall"){
            this.adjacencyList[base_node].push({node: neighbour_node, weight: weight});
            this.adjacencyList[neighbour_node].push({node: base_node, weight: weight});
        }
    }

    dijkstra(startNode, endNode){

        let times = {};
        
        let pq = new priorityQueue();
        
        algoRunning = false;

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
    }
}

//convert list to matrix
function createNodes(){
    for(let i=0; i<grid_side_length; i++){
        weights[i] = []
        images[i] = [];
        html_grid_matrix[i]=[];
        grid_matrix[i]=[];
        checkedNode[i]=[];
        
        for(let j=0; j<grid_side_length; j++){
            weights[i][j] = 1;
            images[i][j] = img[(10*i)+j];
            html_grid_matrix[i][j] = grid[(10*i)+j];
            grid_matrix[i][j]=`${i}${j}`;
            checkedNode[i][j] = false;
        }
    }
    startNode = grid_matrix[0][0];
    endNode = grid_matrix[9][9];
    valuesAssigned = true;
}

//add edges 
function addEdgePosition(pos, i, j){
    if(pos=="left"){
        if(html_grid_matrix[i][j-1]!=null){
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

function algoStyling(currentNodeHtml){
    let uniqueSet = new Set(currentNodeHtml);
    uniqueCurrentNodeHtml = [...uniqueSet]; 
    let listlength = uniqueCurrentNodeHtml.length;
    for(let i=0; i< listlength; i++){
        time += 100;
        let timer2 = setTimeout(()=>{
        uniqueCurrentNodeHtml[i].style.backgroundColor = "yellow";   
        algoRunning = "true";
        }, time);
        timers2.push(timer2);
    }
}

function finalSolution(startNode, endNode, backtrace){

    let path = [html_grid_matrix[9][9]];
        var lastStep = endNode;
        let time_final = time+50;
        while(lastStep!==startNode){
            lastStep = backtrace[lastStep];
            let lastStepNode = html_grid_matrix[Number(lastStep[0])][Number(lastStep[1])];
            path.unshift(lastStepNode)   
        }
        for(let i=0; i<path.length; i++){
            time_final += 250;
            let timer = setTimeout(()=>path[i].style.backgroundColor = "#ff9966", time_final);
            timers.push(timer);
        }
        //setTimeout(()=>html_grid_matrix[9][9].style.backgroundColor = "#ff9966", time_final);
        algoRunning = false;
}

function addWall(){
    var checkbox = document.querySelector("#check");
    if(checkWall){
        for(let i=0; i<grid_side_length; i++){
            for(let j=0; j<grid_side_length; j++){
                if(html_grid_matrix[i][j]){
                    html_grid_matrix[i][j].addEventListener("mouseover", function(){
                        
                    });
                }
            }
        }
        checkWall = false;
    }
    else{
        checkWall = true;
    }   
}

//addWeights
function addWeights(){
    let checkWeights = document.querySelector("#checkWeights");
    if(checkWeight){
        for(let i=0; i<grid_side_length; i++){
            for(let j=0; j<grid_side_length; j++){
                if(html_grid_matrix[i][j] != null){
                    html_grid_matrix[i][j].addEventListener("click", wallUI(i,j, this));
                }    
            }
        }
        checkWeight = false;
    }
    else{
        checkWeight = true;
    }
}

function reset(){
    time = 500; //to remove all the delayed animations in next visualization
    for(let p=0; p<grid_side_length*grid_side_length; p++){
        
        algoRunning = false;
        
        //remove animations
        for(let i=0; i<timers.length; i++){
            clearTimeout(timers.pop());
        }
        for(let i=0; i<timers2.length; i++){
            clearTimeout(timers2.pop());
        }
        grid[p].style.backgroundColor = "thistle";

        //remove walls
        
        for(let i=0; i<grid_side_length; i++){
            for(let j=0; j<grid_side_length; j++){
                html_grid_matrix[i][j] = undefined;
                delete(html_grid_matrix[i][j]);
                if(grid_matrix[i][j] != startNode && grid_matrix[i][j] != endNode){
                    images[i][j].src = "";
                    images[i][j].classList.remove("weightsNwalls");
                }
            }
        }
        createNodes();
    }
}

function addNeighbours(map, weights){
    //adding neighbours
    for(let i=0; i<grid_side_length; i++){
        for(let j=0; j<grid_side_length; j++){
            if(html_grid_matrix[i][j]!=null){
                if(i==0 && j==0){
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("right", i, j), weights[i][j]);
                } 
                else if(i==grid_side_length-1 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                } 
                else if(i==0 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==9 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==0 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==9 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i!=grid_side_length-1 && i!=0 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                }
                else if(i!=9 && i!=0 && j==grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                }
                else if(i!=0 && i!=grid_side_length-1 && j!=0 && j!=grid_side_length-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                }
            }
        }
    }
}



//visualise algo
function visualise(){

    //make new Graph/Grid
    var map = new Graph();

    //add Nodes in Grid
    for(let i=0; i<grid_side_length; i++){
        for(let j=0; j<grid_side_length; j++){
            map.addNode((grid_matrix[i][j]));    
        }
    }
    addNeighbours(map, weights);

    if(!algoRunning){
        map.dijkstra(startNode, endNode);
        algoStyling(currentNodeHtml);
        finalSolution(startNode, endNode, backtrace);
    }
    else{
        console.log("Algo Running");
    }
    
}

//assign values to nodes
createNodes();

function wallUI(i, j, thiss){
    if(mouseDown==true && grid_matrix[i][j] != startNode && grid_matrix[i][j] != endNode){
        for(let p=0; p<grid_side_length; p++){
            for(let q=0; q<grid_side_length; q++){
                if(html_grid_matrix[p][q] == thiss){
                    html_grid_matrix[p][q].classList.add("walls");
                    html_grid_matrix[p][q] = null;    
                }
            }
        }
    }
}

function weightUI(){

}