let nodes = new vis.DataSet()
let edges = new vis.DataSet()

let network

let turn = 1
let firstMove = true

const NODE_COUNT = 7

const COLORS = {
free:"#cccccc",
available:"#4da6ff",
taken:"#ff4d4d"
}

function generateGraph(){

nodes.clear()
edges.clear()

for(let i=1;i<=NODE_COUNT;i++){

nodes.add({
id:i,
color:COLORS.free,
state:"free"
})

}

for(let i=1;i<=NODE_COUNT;i++){
for(let j=i+1;j<=NODE_COUNT;j++){

edges.add({
from:i,
to:j
})

}
}

}

function drawGraph(){

let container = document.getElementById("network")

let data={
nodes:nodes,
edges:edges
}

network = new vis.Network(container,data,{})

network.on("click",handleClick)

}

function handleClick(params){

if(params.nodes.length===0) return

let id=params.nodes[0]

let node=nodes.get(id)

if(firstMove){

infectNode(id)

firstMove=false

}else{

if(node.state!=="available") return

infectNode(id)

}

checkRemovals()

updateTurn()

checkWin()

}

function infectNode(id){

nodes.update({
id:id,
color:COLORS.taken,
state:"taken"
})

let neighbors=network.getConnectedNodes(id)

neighbors.forEach(n=>{

let node=nodes.get(n)

if(node.state==="free"){

nodes.update({
id:n,
color:COLORS.available,
state:"available"
})

}

})

}

function checkRemovals(){

let allNodes=nodes.get()

allNodes.forEach(node=>{

if(node.state!=="taken") return

let neighbors=network.getConnectedNodes(node.id)

let allRed=true

neighbors.forEach(n=>{

let neighbor=nodes.get(n)

if(neighbor && neighbor.state!=="taken"){
allRed=false
}

})

if(allRed){
nodes.remove(node.id)
}

})

}

function updateTurn(){

turn = turn===1 ? 2 : 1

document.getElementById("turn").innerText="Turno: Jugador "+turn

}

function checkWin(){

let allNodes=nodes.get()

let availableExists=false

allNodes.forEach(n=>{
if(n.state==="available") availableExists=true
})

if(!availableExists && !firstMove){

alert("Jugador "+(turn===1?2:1)+" gana!")

}

}

function resetGame(){

turn=1
firstMove=true

document.getElementById("turn").innerText="Turno: Jugador 1"

generateGraph()

drawGraph()

}

generateGraph()
drawGraph()