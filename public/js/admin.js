import lib from './lib.js';

let newIngredientBtn = document.querySelector('.round-btn');

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

const admin_listRecipes = async ()=>{
    hideMainButtons();
    const list = await lib.getFromAPI('/api/products/', '');
    admin_printRecipes(list, '#content');
}

const admin_printRecipes = (results, parentSelector) =>{
    let parent = document.querySelector(parentSelector);
    parent.innerHTML = '<h2>Published Recipes</h2>';
    let createRecipe = document.createElement('button');
    createRecipe.innerText = "Add New";
    createRecipe.classList.add('btn');
    createRecipe.onclick = newRecipeForm;
    parent.appendChild(createRecipe);
    results.forEach(elem =>{
      let nodeRow = document.createElement('div');
      nodeRow.classList.add('admin-row');
  
      // Image
      let nodeImg = document.createElement('img');
      nodeImg.classList.add('admin-field');
      nodeImg.classList.add('admin-img');
      nodeImg.src = '/img/'+elem.image;
  
      // ID
      let nodeID = document.createElement('div');
      nodeID.classList.add('admin-field');
      nodeID.classList.add('admin-id');
      nodeID.innerText = elem['id'];
  
      // Name
      let nodeName = document.createElement('div')
      nodeName.classList.add('admin-field');
      nodeName.classList.add('admin-name');
      nodeName.onclick = ()=>{
        getProductDetailView(elem['id'], parentSelector);
      }

      // Edit

      let nodeEdit = document.createElement('div');
      nodeEdit.classList.add('admin-edit');
      nodeEdit.innerText = "Edit";
      nodeEdit.onclick = ()=>{
        console.log('EDIT!!!');
      }
    
      // Delete
      let nodeDelete = document.createElement('div');
      nodeDelete.classList.add('admin-delete');
      nodeDelete.innerText = "Delete";
      nodeDelete.onclick = ()=>{
        swal({
            title: "Do you want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                lib.deleteFromAPI('/api/product/'+elem['id'])
                .then(()=>{
                    admin_listRecipes();
                });
            } 
        });
      }

      nodeName.innerText = elem.name;
     
      nodeRow.appendChild(nodeImg);
      nodeRow.appendChild(nodeID);
      nodeRow.appendChild(nodeName);
      nodeRow.appendChild(nodeEdit);
      nodeRow.appendChild(nodeDelete);
      parent.appendChild(nodeRow);
    });
  }

admin_listRecipes();

const getProductDetailView = async (id, parentSelector) =>{
    let linkToMain = document.createElement('div');
    linkToMain.classList.add('return-to-main');
    linkToMain.innerHTML = '<i class="fa fa-arrow-circle-left"></i> Return';
    linkToMain.onclick = ()=>{
        admin_listRecipes();
    }
    let parent = document.querySelector(parentSelector);
    parent.innerHTML = '';
    parent.appendChild(linkToMain);
    const endpoint = `/api/product/${id}`;
    let json = await lib.getFromAPI(endpoint, '');
    parent.dataset.id = id;
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
    nodeRemove.dataset.id = row['pi_id'];
    nodeRemove.onclick = (e)=>{
        // delete 
        let index = e.target.dataset.id
        lib.deleteFromAPI(`/api/product/ingredient/${index}`)
        .then((result)=>{
            getProductDetailView(id, parentSelector)
        });
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
        getProductDetailView(document.querySelector('#content').dataset.id,'#content');
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
      let productID = document.querySelector('#content').dataset.id;
      let ingredientID = lb_ingr.dataset.id;
      let quantity  = Number(lb_quantity.value).toFixed(1); 
      //insert into products_ingredients table;
        lib.postToAPI('/api/product/ingredient/', {productID: productID, ingredientID: ingredientID, uomID: lb_unit.value, quantity: quantity })
        .then((result)=>{
            lb_quantity.value = '';
            lb_ingr.value=''
            lb_ingr.innerText=''
        });
    }
  
  
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
 * New Recipe Form
 */

const newRecipeForm = ()=>{
    let html = '<div id="lb-container"><form enctype="multipart/form-data"><label for="lb-recipe-title">Title:</label>'+
    '<input type="text" name="lb-recipe-title" id="lb-recipe-title" /><label for="lb-recipe-img">Image:</label><input type="file" name="lb-recipe-img" id="name="lb-recipe-img"/><input type="submit" /></form></div>'
    SimpleLightbox.open({
      content: html,
      elementClass: 'slbContentEl',
      beforeClose: ()=>{
        getProductDetailView(document.querySelector('#content').dataset.id,'#content');
      }
    });
}