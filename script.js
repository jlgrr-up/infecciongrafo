let nodes = new vis.DataSet()
let edges = new vis.DataSet()

let network

let turn = 1
let firstMove = true
let moveMade = false

const NODE_COUNT = 18
const EXTRA_EDGES = 25

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

for(let i=2;i<=NODE_COUNT;i++){

let parent=Math.floor(Math.random()*(i-1))+1

edges.add({
from:i,
to:parent
})

}

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

physics:{
enabled:true,
stabilization:false
}

})

network.on("click",handleClick)

}

function handleClick(params){

if(params.nodes.length===0) return

let id=params.nodes[0]

let node=nodes.get(id)

if(firstMove){

infectNode(id)

firstMove=false

return

}

if(node.state!=="available") return

infectNode(id)

checkRemovals()

}

function infectNode(id){

moveMade = true

nodes.update({
id:id,
color:COLORS.taken,
state:"taken"
})

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

function endTurn(){

if(!moveMade) return

checkRemovals()

checkWin()

turn = turn===1 ? 2 : 1

document.getElementById("turn").innerText="Turno: Jugador "+turn

moveMade=false

}

function checkWin(){

let allNodes = nodes.get()

let availableExists = false

allNodes.forEach(n => {

if(n.state === "available"){
availableExists = true
}

})

if(!availableExists && !firstMove){

let winner = (turn === 1) ? 2 : 1

setTimeout(() => {

alert("🏆 Jugador " + winner + " gana!")

}, 100)

}

}

function resetGame(){

turn=1
firstMove=true
moveMade=false

document.getElementById("turn").innerText="Turno: Jugador 1"

generateGraph()
drawGraph()

}

document.addEventListener("keydown", function(event){

if(event.code==="Space"){

event.preventDefault()

endTurn()

}

})

generateGraph()
drawGraph()