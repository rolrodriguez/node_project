import lib from './lib.js';

let newIngredientBtn = document.querySelector('.round-btn');


const postForm = async(endpoint)=>{
  let image = document.querySelector('#lb-recipe-img').files[0];
  let title = document.querySelector('#lb-recipe-title');
  let desc = document.querySelector('#lb-recipe-desc');
  let formData = new FormData();
  formData.append('img', image);
  formData.append('title', title.value);
  formData.append('desc', desc.value)
  console.log(formData);
  try {
    let result = await fetch(endpoint, {
      method: "POST",
      body: formData
    })
  } catch (error) {
    console.error(error);
  }
}

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

const admin_listIngredients = async ()=>{
  hideMainButtons();
  const list = await lib.getFromAPI('/api/ingredients/', '');
  admin_printIngredients(list, '#content');
}

const admin_listUOMs = async ()=>{
  hideMainButtons();
  const list = await lib.getFromAPI('/api/uoms/', '');
  admin_printUOMS(list, '#content');
}

const admin_printRecipes = (results, parentSelector) =>{
    let parent = document.querySelector(parentSelector);
    parent.innerHTML = '';
    let flexCont = document.createElement('div');
    flexCont.id = 'flex-cont';
    parent.appendChild(flexCont);
    flexCont.innerHTML = '<h2>Published Recipes</h2>';
    
    let createRecipe = document.createElement('button');
    createRecipe.onclick = newRecipeForm;
    createRecipe.innerText = "Add New";
    createRecipe.classList.add('btn');
    flexCont.appendChild(createRecipe);
    
    
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
      nodeID.innerText = "ID: "+elem['id'];
  
      // Name
      let nodeName = document.createElement('div')
      nodeName.classList.add('admin-field');
      nodeName.classList.add('admin-name');
      nodeName.innerText = "NAME: "+elem.name;
      nodeName.onclick = ()=>{
        getProductDetailView(elem['id'], parentSelector);
      }
      
      // Edit

      let nodeEdit = document.createElement('div');
      nodeEdit.classList.add('admin-edit');
      nodeEdit.innerHTML = '<i class="fa fa-edit">';
      nodeEdit.onclick = ()=>{
        editRecipeForm(elem['id']);
      }
    
      // Delete
      let nodeDelete = document.createElement('div');
      nodeDelete.classList.add('admin-delete');
      nodeDelete.innerHTML = '<i class="fa fa-trash">';
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
           
      nodeRow.appendChild(nodeImg);
      nodeRow.appendChild(nodeID);
      nodeRow.appendChild(nodeName);
      nodeRow.appendChild(nodeEdit);
      nodeRow.appendChild(nodeDelete);
      parent.appendChild(nodeRow);
    });
    
  }

admin_listRecipes();

const admin_printIngredients = (results, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML = '';
  let flexCont = document.createElement('div');
  flexCont.id = 'flex-cont';
  parent.appendChild(flexCont);
  flexCont.innerHTML = '<h2>Published Ingredients</h2>';
  let createRecipe = document.createElement('button');
  createRecipe.innerText = "Add New";
  createRecipe.classList.add('btn');
  createRecipe.onclick = newIngredientForm;
  flexCont.appendChild(createRecipe);
  
  let elems = results.results;
  if(elems){
  elems.forEach(elem =>{
    let nodeRow = document.createElement('div');
    nodeRow.classList.add('admin-row-other');

    // Name
    let nodeName = document.createElement('div')
    nodeName.classList.add('admin-field');
    nodeName.classList.add('admin-desc');
    nodeName.innerText = "NAME: "+elem.name;
    
    // Description
    let nodeDesc = document.createElement('div');
    nodeDesc.classList.add('admin-field');
    nodeDesc.classList.add('admin-desc');
    nodeDesc.innerText = "DESCRIPTION: "+elem['description'];

    // Edit

    let nodeEdit = document.createElement('div');
    nodeEdit.classList.add('admin-edit');
    nodeEdit.innerHTML = '<i class="fa fa-edit">';
    nodeEdit.onclick = ()=>{
      editIngredientForm(elem['id']);
    }
  
    // Delete
    let nodeDelete = document.createElement('div');
    nodeDelete.classList.add('admin-delete');
    nodeDelete.innerHTML = '<i class="fa fa-trash">';
    nodeDelete.onclick = ()=>{
      swal({
          title: "Do you want to delete this ingredient?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
              lib.deleteFromAPI('/api/ingredient/'+elem['id'])
              .then(()=>{
                  admin_listIngredients();
              });
          } 
      });
    }
       
    nodeRow.appendChild(nodeName);
    nodeRow.appendChild(nodeDesc);
    nodeRow.appendChild(nodeEdit);
    nodeRow.appendChild(nodeDelete);
    parent.appendChild(nodeRow);
  });
}
}

const admin_printUOMS = (results, parentSelector) =>{
  let parent = document.querySelector(parentSelector);
  parent.innerHTML='';
  let flexCont = document.createElement('div');
  flexCont.id = 'flex-cont';
  parent.appendChild(flexCont);
  flexCont.innerHTML = '<h2>Published Units of Measure</h2>';
  let createRecipe = document.createElement('button');
  createRecipe.innerText = "Add New";
  createRecipe.classList.add('btn');
  createRecipe.onclick = newUOMForm;
  flexCont.appendChild(createRecipe);

  results.forEach(elem =>{
    let nodeRow = document.createElement('div');
    nodeRow.classList.add('admin-row-other');

    // Abbr
    let abbr = document.createElement('div')
    abbr.classList.add('admin-field');
    abbr.classList.add('admin-desc');
    abbr.innerText = "ABBR: "+elem.abbr;
    
    // Name Single
    let nameSingle = document.createElement('div');
    nameSingle.classList.add('admin-field');
    nameSingle.classList.add('admin-desc');
    nameSingle.innerText = "SINGLE NAME: "+elem['name_single'];

    // Name Plural

    let namePlural = document.createElement('div');
    namePlural.classList.add('admin-field');
    namePlural.classList.add('admin-desc');
    namePlural.innerText = "PLURAL NAME: "+elem['name_plural'];

    // Edit

    let nodeEdit = document.createElement('div');
    nodeEdit.classList.add('admin-edit');
    nodeEdit.innerHTML = '<i class="fa fa-edit">';
    nodeEdit.onclick = ()=>{
      editUOMForm(elem['id']);
    }
  
    // Delete
    let nodeDelete = document.createElement('div');
    nodeDelete.classList.add('admin-delete');
    nodeDelete.innerHTML = '<i class="fa fa-trash">';
    nodeDelete.onclick = ()=>{
      swal({
          title: "Do you want to delete this unit of measure?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
              lib.deleteFromAPI('/api/uom/'+elem['id'])
              .then(()=>{
                  admin_listUOMs();
              });
          } 
      });
    }
       
    nodeRow.appendChild(abbr);
    nodeRow.appendChild(nameSingle);
    nodeRow.appendChild(namePlural);
    nodeRow.appendChild(nodeEdit);
    nodeRow.appendChild(nodeDelete);
    parent.appendChild(nodeRow);
  });
  
}

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
    '<button class="search-submit" id="lb-add">Add</button></aside>'+
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
 * Forms
 */

const newRecipeForm = ()=>{

    let html = '<div id="lb-container"><form enctype="multipart/form-data" method="POST"><label for="lb-recipe-title">Title:</label>'+
    '<input type="text" name="lb-recipe-title" id="lb-recipe-title" /><label for="lb-recipe-desc">Description</label>'+
    '<input type="text" name="lb-recipe-desc" id="lb-recipe-desc"><label for="lb-recipe-img">Image:</label>'+
    '<input type="file" name="lb-recipe-img" id="lb-recipe-img"/><input type="submit" id="lb-recipe-submit" value="Send" /></form></div>'
    SimpleLightbox.open({
      content: html,
      elementClass: 'slbContentEl',
      beforeClose: ()=>{
        admin_listRecipes();
      }
    });
    let submitButton = document.querySelector('#lb-recipe-submit');
    submitButton.parentElement.onsubmit = (e)=>{
      e.preventDefault();
      postForm('/api/product/').then(()=>{
        swal({
          title: "The product was created",
          icon: "success",
        })
      })
      .catch((error)=>{
        swal({
          title: "There was an error",
          icon: "failure",
        })
      });
    }
}

const editRecipeForm = (id)=>{
  
  let html = `<div id="lb-container" data-id="${id}"><form enctype="multipart/form-data" method="POST"><label for="lb-recipe-title">Title:</label>`+
  '<input type="text" name="lb-recipe-title" id="lb-recipe-title" /><label for="lb-recipe-desc">Description</label>'+
  '<input type="text" name="lb-recipe-desc" id="lb-recipe-desc">'+
  '<input type="submit" id="lb-recipe-submit" value="Send" /></form></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      admin_listRecipes();
    }
  });
  
  let submitButton = document.querySelector('#lb-recipe-submit');
  let name = document.querySelector('#lb-recipe-title');
  let desc = document.querySelector('#lb-recipe-desc');
  let elemID = document.querySelector('#lb-container').dataset.id;
  lib.getFromAPI(`/api/product/`, elemID).then((data)=>{
    name.value = data.name;
    desc.value = data.description;
  });
  // name.value = data.title;
  // desc.value = data.description;
  submitButton.parentElement.onsubmit = (e)=>{
    e.preventDefault();
    lib.putToAPI(`/api/product/${elemID}`, {name: name.value, desc: desc.value}).then(()=>{
      swal({
        title: "The product was updated",
        icon: "success",
      })
    })
    .catch((error)=>{
      swal({
        title: "There was an error",
        icon: "error",
      })
    });
  }
}

const newIngredientForm = ()=>{
  let html = `<div id="lb-container"><form method="POST"><label for="lb-ingredient-name">Name:</label>`+
  '<input type="text" name="lb-ingredient-name" id="lb-ingredient-name" /><label for="lb-ingredient-desc">Description</label>'+
  '<input type="text" name="lb-ingredient-desc" id="lb-ingredient-desc">'+
  '<input type="submit" id="lb-ingredient-submit" value="Send" /></form></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      admin_listIngredients();
    }
  });
  let submitButton = document.querySelector('#lb-ingredient-submit');
  let name = document.querySelector('#lb-ingredient-name');
  let desc = document.querySelector('#lb-ingredient-desc');

  submitButton.parentElement.onsubmit = (e)=>{
    e.preventDefault();
    lib.postToAPI(`/api/ingredient/`, {name: name.value, description: desc.value}).then(()=>{
      swal({
        title: "The ingredient was created",
        icon: "success",
      })
    })
    .catch((error)=>{
      swal({
        title: "There was an error",
        icon: "error",
      })
    });
  }
}

const editIngredientForm = (id)=>{
  let html = `<div id="lb-container" data-id="${id}"><form method="POST"><label for="lb-ingredient-name">Name:</label>`+
  '<input type="text" name="lb-ingredient-name" id="lb-ingredient-name" /><label for="lb-ingredient-desc">Description</label>'+
  '<input type="text" name="lb-ingredient-desc" id="lb-ingredient-desc">'+
  '<input type="submit" id="lb-ingredient-submit" /></form></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      admin_listIngredients();
    }
  });
  let submitButton = document.querySelector('#lb-ingredient-submit');
  let name = document.querySelector('#lb-ingredient-name');
  let desc = document.querySelector('#lb-ingredient-desc');
  let elemID = document.querySelector('#lb-container').dataset.id;
  lib.getFromAPI(`/api/ingredient/`, elemID).then((data)=>{
    name.value = data.name;
    desc.value = data.description;
  });

  submitButton.parentElement.onsubmit = (e)=>{
    e.preventDefault();
    lib.putToAPI(`/api/ingredient/${elemID}`, {name: name.value, description: desc.value}).then(()=>{
      swal({
        title: "The ingredient was updated",
        icon: "success",
      })
    })
    .catch((error)=>{
      swal({
        title: "There was an error",
        icon: "error",
      })
    });
  }
}

const newUOMForm = ()=>{
  let html = `<div id="lb-container"><form method="POST"><label for="lb-uom-abbr">Abbreviation: </label>`+
  '<input type="text" name="lb-uom-abbr" id="lb-uom-abbr" /><label for="lb-uom-name-single">Single Name: </label>'+
  '<input type="text" name="lb-uom-name-single" id="lb-uom-name-single"><label for="lb-uom-name-plural">Plural Name: </label>'+
  '<input type="text" name="lb-uom-name-plural" id="lb-uom-name-plural"><input type="submit" id="lb-uom-submit" /></form></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      admin_listUOMs();
    }
  });
  let submitButton = document.querySelector('#lb-uom-submit');
  let abbr = document.querySelector('#lb-uom-abbr');
  let nameSingle = document.querySelector('#lb-uom-name-single');
  let namePlural = document.querySelector('#lb-uom-name-plural');

  submitButton.parentElement.onsubmit = (e)=>{
    e.preventDefault();
    lib.postToAPI(`/api/uom/`, {abbr: abbr.value, name_single: nameSingle.value, name_plural: namePlural.value}).then(()=>{
      swal({
        title: "The unit of measure was created",
        icon: "success",
      })
    })
    .catch((error)=>{
      swal({
        title: "There was an error",
        icon: "error",
      })
    });
  }
}

const editUOMForm = (id)=>{
  let html = `<div id="lb-container" data-id="${id}"><form method="POST"><label for="lb-uom-abbr">Abbreviation: </label>`+
  '<input type="text" name="lb-uom-abbr" id="lb-uom-abbr" /><label for="lb-uom-name-single">Single Name: </label>'+
  '<input type="text" name="lb-uom-name-single" id="lb-uom-name-single"><label for="lb-uom-name-plural">Plural Name: </label>'+
  '<input type="text" name="lb-uom-name-plural" id="lb-uom-name-plural"><input type="submit" id="lb-uom-submit" /></form></div>'
  SimpleLightbox.open({
    content: html,
    elementClass: 'slbContentEl',
    beforeClose: ()=>{
      admin_listUOMs();
    }
  });
  let submitButton = document.querySelector('#lb-uom-submit');
  let abbr = document.querySelector('#lb-uom-abbr');
  let nameSingle = document.querySelector('#lb-uom-name-single');
  let namePlural = document.querySelector('#lb-uom-name-plural');
  let elemID = document.querySelector('#lb-container').dataset.id;
  lib.getFromAPI(`/api/uom/`, elemID).then((data)=>{
    abbr.value = data.abbr;
    nameSingle.value = data.name_single;
    namePlural.value = data.name_plural;
  });

  submitButton.parentElement.onsubmit = (e)=>{
    e.preventDefault();
    lib.putToAPI(`/api/uom/${elemID}`, {abbr: abbr.value, name_single: nameSingle.value, name_plural: namePlural.value}).then(()=>{
      swal({
        title: "The unit of measure was updated",
        icon: "success",
      })
    })
    .catch((error)=>{
      swal({
        title: "There was an error",
        icon: "error",
      })
    });
  }
}

/**
 * Menu items listeners
 */

let menuProductsItem = document.querySelector('#menu-products');
let menuIngredientsItem = document.querySelector('#menu-ingredients');
let menuUOMSItem = document.querySelector('#menu-uoms');

menuProductsItem.onclick = admin_listRecipes;
menuIngredientsItem.onclick = admin_listIngredients;
menuUOMSItem.onclick = admin_listUOMs;