const svg = d3.select("#graph")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%");

let dataSet = [];

const input = document.getElementById("input");
const list = document.getElementById("list_space");

input.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {

        //adding list item
        let item = {
           id: dataSet.length,
           value: input.value,
           time: new Date().toISOString().match( /\d{2}:\d{2}.\d{3}/i )[0]
        };
        dataSet.push(item);
        input.value = 0;

        //rerendering view
        let list_item = document.createElement("div");
        list_item.setAttribute("class","list-item");
        list_item.setAttribute("id",item.id);
                
        let list_item_btn = document.createElement("button");
        list_item_btn.setAttribute("class","removeBtn");
        list_item_btn.innerHTML = "Remove";
        list_item_btn.addEventListener("click", function(event){
          event.preventDefault();

          list_item_btn.parentElement.remove();
          
          //delete from array
        });

        let list_item_time = document.createElement("p");
        list_item_time.innerHTML=item.time;
        list_item_time.setAttribute("class","list-item-time");

        let list_item_value = document.createElement("h4");
        list_item_value.innerHTML=item.value;
        
        list_item.appendChild(list_item_time);
        list_item.appendChild(list_item_value);
        list_item.appendChild(list_item_btn);
        list.appendChild(list_item);
        
        console.log(dataSet);
      }
});