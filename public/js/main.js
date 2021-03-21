
let searchButton = document.querySelector('#search-submit');
let queryResults = document.querySelector('#query-results');

searchButton.onclick = async (e)=>{
  let searchquery = document.querySelector('#search').value;
  
  if(searchquery !== ''){
    let endpoint = `/api/products/${searchquery}`;
    let result = await fetch(endpoint);
    let json = await result.json();
    printListResult(json.results, '#query-results');
  }
}

const printListResult = (results, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  results.forEach(elem =>{
    let nodeRow = document.createElement('div');
    nodeRow.classList.add('result-row');

    let nodeID = document.createElement('div');
    nodeID.classList.add('result-field');
    nodeID.classList.add('result-id');
    nodeID.innerText = elem['id'];

    let nodeName = document.createElement('div')
    nodeName.classList.add('result-field');
    nodeName.classList.add('result-name');
    nodeName.onclick = ()=>{
      getDetailView(elem['id'], '#query-results');
    }
    nodeName.innerText = elem.name;
   
    nodeRow.appendChild(nodeID);
    nodeRow.appendChild(nodeName);

    parent.appendChild(nodeRow);
  });
}

const getLatestProducts = async () =>{
  let result = await fetch('/api/products/');
  let json = await result.json();
  printListResult(json, '#query-results');

}
getLatestProducts();

const getDetailView = async (id, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  const endpoint = `/api/product/${id}`;
  let result = await fetch(endpoint);
  let json = await result.json();
  let title = document.createElement('h2');
  title.innerText = json['name'];
  parent.appendChild(title);

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