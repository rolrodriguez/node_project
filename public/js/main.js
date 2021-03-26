
// Main elements to interact with
let searchButton = document.querySelector('#search-submit');
let queryResults = document.querySelector('#query-results');
let newIngredientBtn = document.querySelector('.round-btn');
let showReportBtn = document.querySelector('.report-btn');

/**
 * On click listener for search button
 * 
 */
searchButton.onclick = async ()=>{
  let searchquery = document.querySelector('#search').value;
  
  if(searchquery !== ''){
    let endpoint = `/api/products/${searchquery}`;
    let result = await fetch(endpoint);
    let json = await result.json();
    printListResult(json.results, '#query-results');
  }
  else{
    getLatestProducts();
  }
}

newIngredientBtn.onclick = () =>{
  SimpleLightbox.open({
    content: 'New Ingredients',
    elementClass: 'slbContentEl'
  });
}

showReportBtn.onclick = () =>{
  SimpleLightbox.open({
    content: 'Report',
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
  parent.innerHTML = '';
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

/**
 * getLatestProducts: get from the API the latest products added
 */
const getLatestProducts = async () =>{
  let result = await fetch('/api/products/');
  let json = await result.json();
  printListResult(json, '#query-results');

}
getLatestProducts();

/**
 * getProductDetailView: get all ingredients from a certain product
 * 
 * @param {Number} id product id to retrieve
 * @param {HTMLDivElement} parentSelector parent div to post the results to
 */
const getProductDetailView = async (id, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  const endpoint = `/api/product/${id}`;
  let result = await fetch(endpoint);
  let json = await result.json();
  let title = document.createElement('h2');
  title.innerText = json['name'];
  parent.appendChild(title);
  writeJsonToLS('amay_recipe', json['ingredients']);
  json['ingredients'].forEach(row =>{
    let listNode = document.createElement('div');
    listNode.classList.add('ingredient-row');

    let nodeString = document.createElement('div');
    nodeString.classList.add('ing-string');
    nodeString.innerText = row['string'];

    listNode.appendChild(nodeString);
    parent.appendChild(listNode);
    
  });

  let linkToMain = document.createElement('div');
  linkToMain.classList.add('return-to-main');
  linkToMain.innerText = 'Return';
  linkToMain.onclick = ()=>{
    getLatestProducts();
  }
  parent.appendChild(linkToMain);
}

/**
 * writeJsonToLS: function to save json to local storage
 * 
 * @param {String} key key to save the json to
 * @param {Object} jsonElem json element to be saved
 */
const writeJsonToLS = (key, jsonElem)=>{
  if (localStorage){
    localStorage.setItem(key,JSON.stringify(jsonElem));
  }
  else{
    console.log('Local storage is not supported!!!')
  }
}

/**
 * readJsonFromLS: read json previously saved from local storage
 * 
 * @param {String} key key to use to retrieve results
 * @returns JSON with results
 */
const readJsonFromLS = (key)=>{
  if(localStorage){
    const result = localStorage.getItem(key);
    if(result){
      return JSON.parse(result);
    }
    else{
      return JSON.parse({});
    }
  }
  else{
    console.log('Local storage is not supported!!!')
  }
}