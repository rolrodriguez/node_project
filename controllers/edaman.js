/**
 * Edaman API controller
 */

require('dotenv').config();
const http = require("https");
const edaman = {}

edaman.queryRecipe = (recipeJSONText)=>{
    const options = {
        hostname: process.env.EDAMAN_HOST,
        port: 443,
        path: `/api/nutrition-details?app_id=${process.env.EDAMAN_TEST_ID}&app_key=${process.env.EDAMAN_TEST_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': recipeJSONText.length
        }
      }
      const req = http.request(options, res => {
        let chunks = '';
        console.log(`statusCode: ${res.statusCode}`)
        
        res.on('data', data => {
          chunks += data;
        });
        res.on('end', ()=>{
            console.log(JSON.parse(chunks));
        });
      });
      
      req.on('error', error => {
        console.error(error)
      });
      
      req.write(recipeJSONText)
      req.end()
}

edaman.queryRecipePromise = (recipeJSONText)=>{
    return new Promise((resolve, reject)=>{
        const options = {
            hostname: process.env.EDAMAN_HOST,
            port: 443,
            path: `/api/nutrition-details?app_id=${process.env.EDAMAN_TEST_ID}&app_key=${process.env.EDAMAN_TEST_KEY}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': recipeJSONText.length
            }
        }
         const req = http.request(options, res => {
            let chunks = '';
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', data => {
              chunks += data;
            });
            res.on('end', ()=>{
                resolve(JSON.parse(chunks));
            });
          });
          
          req.on('error', error => {
            reject(error)
          });
          
          req.write(recipeJSONText)
          req.end()
    });
}

module.exports = edaman;