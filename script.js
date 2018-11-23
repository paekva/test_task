
let dataSet = [];


// LIST OF VALUES representation on the view
const input = document.getElementById("input");
const list = document.getElementById("list_space");

input.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {

        //forming item and adding it to the data model
        let item = {
           id: dataSet.length,
           value: input.value,
           time: new Date()
        };
        dataSet.push(item);
        input.value = 0;

        //forming list item for the view
        let list_item = document.createElement("div");
        list_item.setAttribute("class","list-item");
        list_item.setAttribute("id",item.id);
                
        let list_item_btn = document.createElement("button");
        list_item_btn.setAttribute("class","removeBtn");
        list_item_btn.innerHTML = "Remove";
        list_item_btn.addEventListener("click", function(event){
          // "remove btn" - click event
          event.preventDefault();

          let list_item_tmp = list_item_btn.parentElement; //delete from data model
          let list_item_id = list_item_tmp.getAttribute("id");
          dataSet.splice(list_item_id,1);

          list_item_btn.parentElement.remove();//delete from view          
        });

        let list_item_time = document.createElement("p");
        list_item_time.innerHTML=item.time.toISOString().match( /\d{2}:\d{2}.\d{3}/i )[0];
        list_item_time.setAttribute("class","list-item-time");

        let list_item_value = document.createElement("h4");
        list_item_value.innerHTML=item.value;
        
        list_item.appendChild(list_item_time);
        list_item.appendChild(list_item_value);
        list_item.appendChild(list_item_btn);
        list.appendChild(list_item); //adding new item to the view
        
        drawGraph(); // drawing graph representation
        console.log(dataSet);
      }
});


// simple points drawing, without any scaling yet
const svg = d3.select("#graph")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%");

function drawGraph(){
  svg.selectAll("circle")
    .data(dataSet)
    .enter()
    .append("circle")
    .attr("r",5)
    .attr("cx", (d) => 0.01*(d.time.getTime() - dataSet[0].time.getTime()) )
    .attr("cy", (d,i)=>{ 
      return window.innerHeight*0.5-d.value ;
    });

  svg.selectAll("text")
    .data(dataSet)
    .enter()
    .append("text")
    .text((d)=>d.value)
    .attr("y",(d, i) => window.innerHeight*0.5-d.value )
    .attr("x", (d) => 0.01*(d.time.getTime() - dataSet[0].time.getTime()) + 5 );
    
}



// handlers for clicking buttons on side bars
const leftBtn = document.getElementById("left-side-bar-btn");

leftBtn.addEventListener("click", function(event){
    event.preventDefault();
    
    let leftBar = leftBtn.parentElement;

    if(leftBar.getAttribute("open")==="true"){

      leftBtn.setAttribute("class", "btn absolute");
      leftBar.setAttribute("class", "right side-bar closed");
      leftBar.setAttribute("open","false");
      
    }
    else {

      leftBtn.setAttribute("class", "btn");
      leftBar.setAttribute("class", "left side-bar");
      leftBar.setAttribute("open","true");
      
    }
});

const rightBtn = document.getElementById("right-side-bar-btn");

rightBtn.addEventListener("click", function(event){
    event.preventDefault();

    let rightBar = rightBtn.parentElement;

    if(rightBar.getAttribute("open")==="true"){

      rightBtn.setAttribute("class", "btn absolute");
      rightBar.setAttribute("class", "left side-bar closed");
      rightBar.setAttribute("open","false");
      
    }
    else {

      rightBtn.setAttribute("class", "btn");
      rightBar.setAttribute("class", "right side-bar");
      rightBar.setAttribute("open","true");
      
    }
});

