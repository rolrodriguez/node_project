
let searchButton = document.querySelector('#search-submit');
let queryResults = document.querySelector('#query-results');

searchButton.onclick = async (e)=>{
  let searchquery = document.querySelector('#search').value;
  let typeSelect = document.querySelector('#type').value
  if(searchquery !== ''){
    let endpoint = '';
    switch(typeSelect){
      case 'products':
        endpoint = `/api/products/${searchquery}`;
      break;
      case 'ingredients':
        endpoint = `/api/ingredients/${searchquery}`;
      break;
      default:
        
    }
    let result = await fetch(endpoint);
    let json = await result.json();
    queryResults.innerHTML = ''
    json.results.forEach(elem =>{
      let nodeRow = document.createElement('div');
      nodeRow.classList.add('result-row');

      let nodeID = document.createElement('div');
      nodeID.classList.add('result-field');
      nodeID.classList.add('result-id');
      nodeID.innerText = elem['id'];

      let nodeName = document.createElement('div')
      nodeName.classList.add('result-field');
      nodeName.classList.add('result-name');
      nodeName.innerText = elem.name;

      nodeRow.appendChild(nodeID);
      nodeRow.appendChild(nodeName);

      queryResults.appendChild(nodeRow);
    });
  }
}