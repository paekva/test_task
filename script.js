let dataSet=[];
const input = document.getElementById("input");
const list = document.getElementById("list_container");

// defining field for the graph
const svg = d3.select("#graph")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%");

let ID = () => ( '_' + Math.random().toString(36).substr(2, 9) ); //simple id generator for items in list

// Check for previous history
if(localStorage.getItem("dataSet") !== null) {
  dataSet = JSON.parse(localStorage.getItem("dataSet"));
  dataSet.forEach(element => {
    addNewItemToView(element);
  });
  
  drawGraph();
}

// Addition of new item to the list 
input.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        addNewItem(input.value, new Date()); 
        
        input.value = 0; 
        drawGraph(); // drawing graph representation
        localStorage.setItem("dataSet",JSON.stringify(dataSet));
        
        console.log(dataSet);
      }
});


function addNewItem(inputValue, inputDate){

  //forming item and adding it to the data model
  let item = {
    id: ID(),
    value: inputValue,
    time: inputDate.getTime()
  };
  dataSet.push(item);

  addNewItemToView(item);
  
  drawGraph();
}

function addNewItemToView(item){
  //forming list item for the view
  let list_item = document.createElement("div");
  list_item.setAttribute("class","list-item");
  list_item.setAttribute("id",item.id);
          
  let item_remove_btn = document.createElement("button");
  item_remove_btn.setAttribute("class","removeBtn");
  item_remove_btn.innerHTML = "Remove";

  item_remove_btn.addEventListener("click", function(event){
    event.preventDefault();

    let list_item_tmp = item_remove_btn.parentElement; 
    let list_item_id = dataSet.findIndex(x => x.id === list_item_tmp.getAttribute("id"));
    dataSet.splice(list_item_id,1); //delete from data model

    localStorage.setItem("dataSet",JSON.stringify(dataSet)); //remember new data model in the storage

    item_remove_btn.parentElement.remove();//delete from view 
    
    drawGraph();
  });

  
  let list_item_time = document.createElement("p");
  let ms = item.time%1000;
  let s = parseInt(item.time/1000)-parseInt(item.time/60/1000)*60;
  let m = parseInt(item.time/60/1000)-parseInt(item.time/60/60/1000)*60;
  list_item_time.innerHTML=m+":"+s+"."+ms; // setting up time field
  list_item_time.setAttribute("class","list-item-time");

  let list_item_value = document.createElement("h4");
  list_item_value.innerHTML=item.value;
  
  list_item.appendChild(list_item_time);
  list_item.appendChild(list_item_value);
  list_item.appendChild(item_remove_btn);
  list.appendChild(list_item); //adding new item to the view
}

function drawGraph(){
  
  if(dataSet.length===0) return;

  //SCALING
  //from domain values
  let minY = d3.min(dataSet, (d) => parseInt(d.value) );
  let maxY = d3.max(dataSet, (d) => parseInt(d.value) );

  let minX = 0;
  let maxX = dataSet[dataSet.length-1].time - dataSet[0].time;

  //to range values
  let graph = document.getElementById('graph');
  let svgHeight = graph.offsetHeight;
  let svgWidth = graph.offsetWidth; 
  let padding = 30;


  let xScale = d3.scale.linear()
                            .domain([minX,maxX])
                            .range([padding,svgWidth-padding]);
  
  let yScale = d3.scale.linear()
                            .domain([minY,maxY])
                            .range([-svgHeight/2+padding,svgHeight/2-padding]);

  //cleaning up old data
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  let graphData = [];
  
  for(let i=0;i<dataSet.length;i++)
  {
    let item = {
      x: xScale(dataSet[i].time - dataSet[0].time),
      y: svgHeight*0.5 - yScale(dataSet[i].value)
    };

    graphData[i] = item;
  }

  var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; });

  //drawing new graph
  svg.append("path")
    .attr("d", lineFunction(graphData))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  svg.selectAll("text")
    .data(dataSet)
    .enter()
    .append("text")
    .text((d)=>d.value)
    .attr("x", (d) => xScale(d.time - dataSet[0].time) + 5 )
    .attr("y", (d)=> svgHeight*0.5 - yScale(d.value) );
}

//watching resize window event
window.onresize = function() { drawGraph(); } ;

// handlers for clicking buttons on side bars
const leftBtn = document.getElementById("left-side-bar-btn");

leftBtn.addEventListener("click", function(event){
    event.preventDefault();
    
    let leftBar = leftBtn.parentElement;

    if(leftBar.getAttribute("open")==="true"){

      leftBtn.setAttribute("class", "btn absolute");
      leftBar.setAttribute("class", "right side-bar closed");
      leftBar.setAttribute("open", "false");
      
    }
    else {

      leftBtn.setAttribute("class", "btn");
      leftBar.setAttribute("class", "left side-bar opened");
      leftBar.setAttribute("open","true");
      
    }

    setTimeout(drawGraph, 500);
});

const rightBtn = document.getElementById("right-side-bar-btn");

rightBtn.addEventListener("click", function(event){
    event.preventDefault();

    let rightBar = rightBtn.parentElement;

    if(rightBar.getAttribute("open")==="true"){

      rightBar.setAttribute("class", "left side-bar closed");
      rightBar.setAttribute("open","false");
      
      rightBtn.setAttribute("class", "btn absolute");
      
    }
    else {

      rightBar.setAttribute("class", "right side-bar opened");
      rightBar.setAttribute("open","true");

      rightBtn.setAttribute("class", "btn");
      
    }

    setTimeout(drawGraph, 500);
});

