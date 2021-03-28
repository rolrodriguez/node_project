/**
 * Lib.js a library of common methods for Amai Bakery
 */

const lib = {}
/**
 * writeJsonToLS: function to save json to local storage
 * 
 * @param {String} key key to save the json to
 * @param {Object} jsonElem json element to be saved
 */
 lib.writeJsonToLS = (key, jsonElem)=>{
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
lib.readJsonFromLS = (key)=>{
    if(localStorage){
      const result = localStorage.getItem(key);
      if(result){
        return JSON.parse(result);
      }
      else{
        return null;
      }
    }
    else{
      console.log('Local storage is not supported!!!')
    }
}

/**
 * getFromAPI function request an API given an endpoint
 * 
 * @param {String} endpoint API endpoint to make request to
 * @param {String} query query section of the endpoint
 * @param {Function} callback optional function to execute
 * @returns promise with the result if no callback is provided or true is callback is provided
 */
 lib.getFromAPI = (endpoint, query, callback=null)=>{
    return new Promise((resolve, reject)=>{
   
        let apiEndpoint = endpoint + query;
        fetch(apiEndpoint).then(result =>{
          return result.json();
        }).then(json=>{
          if (callback){
            callback(json)
            resolve(true);
          }
          else{
            resolve(json);
          }
        }).catch(err=>{
          reject(err);
        });
  
  
    });
    
  }

  lib.postToAPI = (endpoint, JSONBody, callback=null)=>{
    return new Promise((resolve, reject)=>{
   
      let apiEndpoint = endpoint;
      let options = {
        method: "POST",
        body: JSON.stringify(JSONBody),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
      
      fetch(apiEndpoint, options).then(result =>{
        return result.json();
      }).then(json=>{
        if (callback){
          callback(json)
          resolve(true);
        }
        else{
          resolve(json);
        }
      }).catch(err=>{
        reject(err);
      });


  });
  }

export default lib;