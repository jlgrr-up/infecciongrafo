let nodes = new vis.DataSet()
let edges = new vis.DataSet()

let network

let turn = 1

const NODE_COUNT = 18
const EXTRA_EDGES = 20

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

/* árbol base para asegurar conectividad */

for(let i=2;i<=NODE_COUNT;i++){

let parent=Math.floor(Math.random()*(i-1))+1

edges.add({
from:i,
to:parent
})

}

/* aristas extra */

for(let i=0;i<EXTRA_EDGES;i++){

let a=Math.floor(Math.random()*NODE_COUNT)+1
let b=Math.floor(Math.random()*NODE_COUNT)+1

if(a!==b){

edges.add({
from:a,
to:b
})

}

}

}

function drawGraph(){

let container=document.getElementById("network")

let data={
nodes:nodes,
edges:edges
}

network=new vis.Network(container,data,{
physics:{enabled:true}
})

network.on("click",handleClick)

}

/* nodo inicial aleatorio */

function startGame(){

let startNode=Math.floor(Math.random()*NODE_COUNT)+1

nodes.update({
id:startNode,
color:COLORS.taken,
state:"taken"
})

openNeighbors(startNode)

}

/* abrir vecinos */

function openNeighbors(id){

let neighbors=network.getConnectedNodes(id)

neighbors.forEach(n=>{

let neighbor=nodes.get(n)

if(neighbor && neighbor.state==="free"){

nodes.update({
id:n,
color:COLORS.available,
state:"available"
})

}

})

}

function handleClick(params){

if(params.nodes.length===0) return

let id=params.nodes[0]

let node=nodes.get(id)

if(!node) return

if(node.state!=="available") return

infectNode(id)

}

function infectNode(id){

nodes.update({
id:id,
color:COLORS.taken,
state:"taken"
})

checkRemovals()

checkWin()

}

/* eliminar nodos cerrados */

function checkRemovals(){

let currentNodes=nodes.get()

currentNodes.forEach(node=>{

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

/* fin de turno */

function endTurn(){

let takenNodes=nodes.get({
filter:function(n){
return n.state==="taken"
}
})

takenNodes.forEach(n=>{
openNeighbors(n.id)
})

checkWin()

turn = turn===1 ? 2 : 1

document.getElementById("turn").innerText="Turno: Jugador "+turn

}

/* victoria correcta */

function checkWin(){

let remaining=nodes.get()

if(remaining.length===0){

alert("Jugador "+turn+" gana!")

}

}

/* reset */

function resetGame(){

turn=1

document.getElementById("turn").innerText="Turno: Jugador 1"

generateGraph()

drawGraph()

startGame()

}

/* iniciar */

generateGraph()
drawGraph()
startGame()

document.addEventListener("keydown", function(event){

if(event.code === "Space"){

event.preventDefault()

endTurn()

}

})