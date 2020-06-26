var grid = document.querySelectorAll("td");
var grid_height = 10;
var grid_width = 30;
var grid_matrix = []; //collecting positions of nodes
var html_grid_matrix = []; //reference to actual grid
var checkedNode = []; // stops from checking node more than once
var algoRunning = false;
var backtrace = {}; //final solution
var time = 500; //for styling
var currentNodeHtml = []; //for animating algorithm
var weights = [];
var valuesAssigned = false;
var img = document.querySelectorAll(".weights"); //for both weights and walls
var images = [];
var mouseDown = false;
var startNode;
var endNode;
var checkWall = true;
var checkWeight = true;
var ddbutton = document.querySelector(".ddbutton"); //change text of add wall or weight dropsown button

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
            //let number_of_neighbours = 0;
            let x = Number(currentNode[0])
            let y = Number(currentNode[1])

            console.log(currentNode);

            currentNodeHtml.push(html_grid_matrix[Number(currentNode[0])][Number(currentNode[1])]);

            this.adjacencyList[currentNode].forEach(neighbour => {
                let time = times[currentNode] + neighbour.weight;
                
                if(time<=times[neighbour.node]){

                    times[neighbour.node] = time;
                    backtrace[neighbour.node] = currentNode;
                    
                    //check if node is visited or not
                    if(checkedNode[Number(neighbour.node[0])][Number(neighbour.node[1])] == false){
                        pq.enqueue([neighbour.node, time]);
                    }

                    //set node as visited/checked
                    checkedNode[Number(neighbour.node[0])][ Number(neighbour.node[1])] = true;
                }  
            });

            //final solution found - end loop
            if(grid_matrix[Number(currentNode[0])][Number(currentNode[1])] == endNode){
                console.log("Braking");
                break;
            }
        }
    }
}

//convert list to matrix
function createNodes(){
    let setter = 0;
    for(let i=0; i<grid_height; i++){
        weights[i] = []
        images[i] = [];
        html_grid_matrix[i]=[];
        grid_matrix[i]=[];
        checkedNode[i]=[];
        
        for(let j=0; j<grid_width; j++){
            weights[i][j] = 1;
            images[i][j] = img[setter];
            html_grid_matrix[i][j] = grid[setter];
            grid_matrix[i][j]=[`${i}`,`${j}`];
            checkedNode[i][j] = false;
            setter++;
        }
    }
    startNode = grid_matrix[4][5];
    endNode = grid_matrix[4][23];
    start = html_grid_matrix[4][5];
    end = html_grid_matrix[4][23];
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
    let time2 = 0
    for(let i=0; i< listlength; i++){
        time += 50;
        time2 += 10;
        setTimeout(()=>{
        uniqueCurrentNodeHtml[i].style.backgroundColor = "#c57f07";   
        algoRunning = "true";
        }, time);
    }
}

function finalSolution(startNode, endNode, backtrace){

    let path = [end];
    var lastStep = endNode;
    let time_final = time+50;
    while(lastStep!==startNode && lastStep != undefined){
        lastStep = backtrace[lastStep];
        let lastStepNode = html_grid_matrix[Number(lastStep[0])][Number(lastStep[1])];
        path.unshift(lastStepNode)   
    }
    for(let i=0; i<path.length; i++){
        time_final += 100;
        setTimeout(()=>{path[i].style.backgroundColor = "#27b042";
                        path[i].style.border = "none"}, time_final);   
    }
    algoRunning = false;
}

function addWall(){
    ddbutton.textContent = "Wall";
    for(let i=0; i<grid_height; i++){
        for(let j=0; j<grid_width; j++){
            if(html_grid_matrix[i][j]){
                html_grid_matrix[i][j].removeEventListener("click", weightUI);
                html_grid_matrix[i][j].addEventListener("mouseover", wallUI);
            }
        }
    }   
}

//addWeights
function addWeights(){
    ddbutton.textContent = "Weight";
    for(let i=0; i<grid_height; i++){
        for(let j=0; j<grid_width; j++){
            if(html_grid_matrix[i][j] != null){
                html_grid_matrix[i][j].removeEventListener("mouseover", wallUI);
                html_grid_matrix[i][j].addEventListener("click", weightUI);
            }
        }
    }
}

function reset(){
    time = 500; //to remove all the delayed animations in next visualization

    location.reload();

    var links = document.getElementsByTagName("link");
    for (let cl in links)
    {
        var link = links[cl];
        if (link.rel === "stylesheet")
            link.href += "";
    }

}

function addNeighbours(map, weights){
    for(let i=0; i<grid_height; i++){
        for(let j=0; j<grid_width; j++){
            if(html_grid_matrix[i][j]!=null){
                if(i==0 && j==0){
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge(((grid_matrix[i][j])), addEdgePosition("right", i, j), weights[i][j]);
                } 
                else if(i==grid_height-1 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                } 
                else if(i==0 && j==grid_width-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==grid_height-1 && j==grid_width-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==0 && j!=0 && j!=grid_width-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i==grid_height-1 && j!=0 && j!=grid_width-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                } 
                else if(i!=grid_height-1 && i!=0 && j==0){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("right", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                }
                else if(i!=grid_height-1 && i!=0 && j==grid_width-1){
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("top", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("left", i, j), weights[i][j]);
                    map.addEdge((grid_matrix[i][j]), addEdgePosition("bottom", i, j), weights[i][j]);
                }
                else if(i!=0 && i!=grid_height-1 && j!=0 && j!=grid_width-1){
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
    for(let i=0; i<grid_height; i++){
        for(let j=0; j<grid_width; j++){
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

function wallUI(){
    if(mouseDown==true && start != this && end != this){
        for(let p=0; p<grid_height; p++){
            for(let q=0; q<grid_width; q++){
                if(html_grid_matrix[p][q] == this){
                    html_grid_matrix[p][q].classList.add("walls");
                    html_grid_matrix[p][q] = null;  
                }
            }
        }
    }
}

function weightUI(){
    //not works if node is startNode or endNode
    if(start != this && end != this){
        for(let p=0; p<grid_height; p++){
            for(let q=0; q<grid_width; q++){
                if(html_grid_matrix[p][q] == this){
                    weights[p][q] = 5;
                    images[p][q].src = "weight.png";
                    images[p][q].classList.add("weightsNwalls");
                }
            }
        }
    } 
}