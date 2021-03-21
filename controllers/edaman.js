/**
 * Edaman API controller
 */

require('dotenv').config();
const http = require("https");
const edaman = {}


edaman.queryIngredient = (searchQuery, parent=null)=>{
    const options = {
        "method": "GET",
        "hostname": process.env.EDAMAN_HOST,
        "port": null,
        "path": '/api/nutrition-data?ingr='+encodeURIComponent(searchQuery),
        "headers": {
            "x-rapidapi-key": process.env.EDAMAN_X_RAPID_API_KEY,
            "x-rapidapi-host": process.env.EDAMAN_HOST,
            "useQueryString": true
        }
    };
    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            if(parent){
                parent.result.push(body);
                return;
            }
            else{
                const parsed = JSON.parse(body.toString()).parsed;
                response.json(parsed[0].food.nutrients);
            }
            
        });
    });
    
    req.end();
}

module.exports = edaman;