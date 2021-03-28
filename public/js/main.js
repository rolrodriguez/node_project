import lib from './lib.js';

// Main elements to interact with
let searchButton = document.querySelector('#search-submit');
// let queryResults = document.querySelector('#query-results');
let newIngredientBtn = document.querySelector('.round-btn');
let showReportBtn = document.querySelector('.report-btn');
const AMAI_LS_INDEX = 'amai_recipe';

const hideMainButtons = ()=>{
  let buttons = document.querySelectorAll('.main-button');
  buttons.forEach(elem =>{
    elem.style.display = 'none';
  });
}

const showMainButtons = ()=>{
  let buttons = document.querySelectorAll('.main-button');
  buttons.forEach(elem =>{
    elem.style.display = 'block';
  });
}


/**
 * On click listener for search button
 * 
 */
searchButton.onclick = ()=>{
  let searchquery = document.querySelector('#search').value;
  
  if(searchquery !== ''){
    lib.getFromAPI('/api/products/', searchquery, (json)=>{
      printListResult(json.results, '#query-results');
    });
  }
  else{
    getLatestProducts();
  }
}

newIngredientBtn.onclick = async () =>{

  let uoms = await lib.getFromAPI('/api/uoms/', '');
  let uomsString = '';
  uoms.forEach(elem => {
    uomsString+= `<option value="${elem['id']}">${elem['name_single']}</option>`;
  });
  let html = '<div id="lb-container"><div class="search-box"><div class="search-bar">'+
  '<input type="text" name="title" id="lb-search" class="search" autocomplete="off" '+
  'placeholder="Search for ingredients to add"><i class="search-icon fa fa-search"></i>'+
  '</div><button id="lb-search-submit" class="search-submit">Search</button></div>'+
  '<div id="lb-output"><aside><label for="lb-quantity">Quantity:</label>'+
  '<input type="number" step="0.1" id="lb-quantity" name="lb-quantity" autocomplete="off" placeholder="Quantity">'+
  '<label for="lb-unit">Unit</label>'+
  `<select id="lb-unit" name="lb-unit">${uomsString}</select>`+
  '<label>ingredient: </label><span id="lb-ingr"></span>'+
  '<br/><button class="search-submit" id="lb-add">Add</button></aside>'+
  '<div id="lb-results"><div></div></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      let json = lib.readJsonFromLS(AMAI_LS_INDEX);
      if(json){
        getProductDetailViewFromLS(json, '#query-results')
      }
    }
  });

  

  let lb_search = document.querySelector('#lb-search');
  let lb_search_submit = document.querySelector('#lb-search-submit');
  let lb_add = document.querySelector('#lb-add');
  let lb_ingr = document.querySelector('#lb-ingr');
  let lb_unit = document.querySelector('#lb-unit');
  let lb_quantity = document.querySelector('#lb-quantity');


  lib.getFromAPI('/api/ingredients/', '', (json)=>{
    if (json.results){
      printListIng(json.results, '#lb-results');
    }   
  });

  lb_search_submit.onclick = async ()=>{

    lib.getFromAPI('/api/ingredients/', lb_search.value, (json)=>{
      if (json.results){
        printListIng(json.results, '#lb-results');
      }   
    });
  }

  lb_add.onclick = async ()=>{
    let name = lb_ingr.innerText;
    let quantity  = lb_quantity.value; 
    let uomJSON = await lib.getFromAPI('/api/uom/', lb_unit.value);
    let uom = '';
    let string = '';
    if(quantity > 1){
      uom = uomJSON['name_plural'];
    }
    else{
      uom = uomJSON['name_single'];
    }
    if (uom === ''){
      string = quantity + ' ' + uom + ' ' + name; 
    }
    else{
      string = quantity + ' ' + name; 
    }
    let json = lib.readJsonFromLS(AMAI_LS_INDEX);
    console.log(json);
    if(json){
      json.ingredients.push({name, quantity, uom, string});
      lib.writeJsonToLS(AMAI_LS_INDEX, json);
      lb_quantity.value = '';
      lb_ingr.value=''
      lb_ingr.innerText=''
    }

  }


}

showReportBtn.onclick = async () =>{
  let json = lib.readJsonFromLS(AMAI_LS_INDEX);
  let edamanJSON = amaiToEdamanJSON(json);
  console.log(edamanJSON);
  let html = await lib.postToAPI('/api/recipe/', edamanJSON);
  SimpleLightbox.open({
    content: getNutritionalInfoView(edamanJSON.title, html),
    elementClass: 'slbContentEl'
  });
}

/**
 * Print list results from query
 * 
 * @param {Array} results results from db query 
 * @param {*} parentSelector parent element where results will be presented
 */
const printListResult = (results, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '<h2>Select a base recipe to start</h2>';
  results.forEach(elem =>{
    let nodeRow = document.createElement('div');
    nodeRow.classList.add('result-row');

    // Image
    let nodeImg = document.createElement('img');
    nodeImg.classList.add('result-field');
    nodeImg.classList.add('result-img');
    nodeImg.src = '/img/'+elem.image;

    // ID
    let nodeID = document.createElement('div');
    nodeID.classList.add('result-field');
    nodeID.classList.add('result-id');
    nodeID.innerText = elem['id'];

    // Name
    let nodeName = document.createElement('div')
    nodeName.classList.add('result-field');
    nodeName.classList.add('result-name');
    nodeName.onclick = ()=>{
      getProductDetailView(elem['id'], '#query-results');
    }
    nodeName.innerText = elem.name;
   
    nodeRow.appendChild(nodeImg);
    nodeRow.appendChild(nodeID);
    nodeRow.appendChild(nodeName);

    parent.appendChild(nodeRow);
  });
}

const printListIng = (results, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  results.forEach(elem =>{
    let nodeRow = document.createElement('div');
    nodeRow.classList.add('result-row');

    // Name
    let nodeName = document.createElement('div');
    nodeName.classList.add('result-field');
    nodeName.classList.add('result-name');
    nodeName.onclick = ()=>{
      let dest = document.querySelector('#lb-ingr');
      dest.innerHTML = elem.name;
      dest.dataset.id = elem.id;
    }
    nodeName.innerText = elem.name;
    
    nodeRow.appendChild(nodeName);
    parent.appendChild(nodeRow);
  });
}

/**
 * getLatestProducts: get from the API the latest products added
 */
const getLatestProducts = async () =>{
  lib.getFromAPI('/api/products/', '', (json)=>{
    printListResult(json, '#query-results');
  });
  hideMainButtons();
}
getLatestProducts();

/**
 * getProductDetailView: get all ingredients from a certain product
 * 
 * @param {Number} id product id to retrieve
 * @param {HTMLDivElement} parentSelector parent div to post the results to
 */
const getProductDetailView = async (id, parentSelector) =>{
  let linkToMain = document.createElement('div');
  linkToMain.classList.add('return-to-main');
  linkToMain.innerHTML = '<i class="fa fa-arrow-circle-left"></i> Return';
  linkToMain.onclick = ()=>{
    getLatestProducts();
  }
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  parent.appendChild(linkToMain);
  const endpoint = `/api/product/${id}`;
  let result = await fetch(endpoint);
  let json = await result.json();
  let title = document.createElement('h2');

  let previouslyStarted = lib.readJsonFromLS(AMAI_LS_INDEX);
  if(previouslyStarted){
    swal({
      title: "Do you want to start with the base recipe?",
      text: "Looks like you have started a new recipe before if you accept you will lose your previous changes",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("You will be starting with the base recipe selected", {
          icon: "info",
        });
        lib.writeJsonToLS(AMAI_LS_INDEX, json);
       
      } else {
        swal("Your previous changes will be preserved!", {
          icon: "success"
        });
        json = lib.readJsonFromLS(AMAI_LS_INDEX);
      }
      title.innerText = json['name'];
      parent.appendChild(title);
      json['ingredients'].forEach((row, key) =>{
        let listNode = document.createElement('div');
        listNode.classList.add('ingredient-row');
    
        let nodeString = document.createElement('div');
        nodeString.classList.add('ing-string');
        nodeString.innerText = row['string'];
    
        let nodeRemove = document.createElement('i');
        nodeRemove.classList.add('fa');
        nodeRemove.classList.add('fa-trash');
        nodeRemove.dataset.id = key;
        nodeRemove.onclick = (e)=>{
          let index = e.target.dataset.id
          let json = lib.readJsonFromLS(AMAI_LS_INDEX);
          if(json){
            json.ingredients.splice(index, 1);
            lib.writeJsonToLS(AMAI_LS_INDEX, json);
            getProductDetailViewFromLS(json, parentSelector);
          }
        }
    
        listNode.appendChild(nodeString);
        listNode.appendChild(nodeRemove);
        parent.appendChild(listNode);
        
      });
      let linkToMain2 = linkToMain.cloneNode(true);
      linkToMain2.onclick = linkToMain.onclick;
    
      parent.appendChild(linkToMain2);
      showMainButtons();
      
    });
  }
  else{
    title.innerText = json['name'];
    parent.appendChild(title);
    lib.writeJsonToLS(AMAI_LS_INDEX, json);
    json['ingredients'].forEach((row, key) =>{
      let listNode = document.createElement('div');
      listNode.classList.add('ingredient-row');
  
      let nodeString = document.createElement('div');
      nodeString.classList.add('ing-string');
      nodeString.innerText = row['string'];
  
      let nodeRemove = document.createElement('i');
      nodeRemove.classList.add('fa');
      nodeRemove.classList.add('fa-trash');
      nodeRemove.dataset.id = key;
      nodeRemove.onclick = (e)=>{
        let index = e.target.dataset.id
        let json = lib.readJsonFromLS(AMAI_LS_INDEX);
        if(json){
          json.ingredients.splice(index, 1);
          lib.writeJsonToLS(AMAI_LS_INDEX, json);
          getProductDetailViewFromLS(json, parentSelector);
        }
      }
  
      listNode.appendChild(nodeString);
      listNode.appendChild(nodeRemove);
      parent.appendChild(listNode);
      
    });
    let linkToMain2 = linkToMain.cloneNode(true);
    linkToMain2.onclick = linkToMain.onclick;
  
    parent.appendChild(linkToMain2);
    showMainButtons(); 
  }

}

const getProductDetailViewFromLS = (json, parentSelector) =>{
  let linkToMain = document.createElement('div');
  linkToMain.classList.add('return-to-main');
  linkToMain.innerHTML = '<i class="fa fa-arrow-circle-left"></i> Return';
  linkToMain.onclick = ()=>{
    getLatestProducts();
  }
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  parent.appendChild(linkToMain);

  let title = document.createElement('h2');
  title.innerText = json['name'];
  parent.appendChild(title);
  json['ingredients'].forEach((row, key) =>{
    let listNode = document.createElement('div');
    listNode.classList.add('ingredient-row');

    let nodeString = document.createElement('div');
    nodeString.classList.add('ing-string');
    nodeString.innerText = row['string'];

    let nodeRemove = document.createElement('i');
    nodeRemove.classList.add('fa');
    nodeRemove.classList.add('fa-trash');
    nodeRemove.dataset.id = key;
    nodeRemove.onclick = (e)=>{
      let index = e.target.dataset.id
      let json = lib.readJsonFromLS(AMAI_LS_INDEX);
      if(json){
        json.ingredients.splice(index, 1);
        lib.writeJsonToLS(AMAI_LS_INDEX, json);
        getProductDetailViewFromLS(json, parentSelector);
      }
    }


    listNode.appendChild(nodeString);
    listNode.appendChild(nodeRemove);
    parent.appendChild(listNode);
    
  });
  let linkToMain2 = linkToMain.cloneNode(true);
  linkToMain2.onclick = linkToMain.onclick;

  parent.appendChild(linkToMain2);
  showMainButtons();
}

const getNutritionalInfoView = (name, json) =>{
  
  let recipeName = name;
  let portions = json.yield;
  let calories = json.calories;
  let healthLabels = json.healthLabels;
  let totalNutrients = json.totalNutrients;
  console.log(totalNutrients);
  let labelOutput='<ul>';
  healthLabels.forEach(elem=>labelOutput += `<li>${elem}</li>`);
  labelOutput+='</ul>'

  let nutrientOutput = 
  `<table>
    <thead>
      <tr>
        <th>Label</th>
        <th>Quantity</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>`;
  

  for(const [key, elem] of Object.entries(totalNutrients)){
    nutrientOutput += `<tr><td>${elem.label}</td>`;
    nutrientOutput += `<td>${Number(elem.quantity).toFixed(2)}</td>`;
    nutrientOutput += `<td>${elem.unit}</td></tr>`;
  }

  nutrientOutput += `</tbody></table>`

  let output = 
  `<div id="nutri-response"><div id="nutri-summary">
  <h3>Summary</h3>
    <table id="summaryTable">
      <tbody>
        <tr>
          <td>Recipe Name</td>
          <td>${recipeName}</td>
        </tr>
        <tr>
          <td>Portions:</td>
          <td>${portions}</td>
        </tr>
        <tr>
          <td>Calories</td>
          <td>${calories}</td>
        </tr>
      </tbody>
    </table>
</div>
  <div id="nutri-labels">
    <h3>Health Labels</h3>
    ${labelOutput}
    </div>
    <div id="nutrients">
      <h3>Nutrients</h3>
      ${nutrientOutput}
    </div>
  </div>`

return output;
}

const amaiToEdamanJSON = (amaiJSON)=>{
  let title = amaiJSON.name
  let ingr = [];
  amaiJSON.ingredients.forEach(elem=>{
    ingr.push(elem.string);
  });

  return {title, ingr}
}



