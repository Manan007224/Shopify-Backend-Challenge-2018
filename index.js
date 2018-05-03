const express = require('express');
const http = require('http');
const request = require('request');
const app = express();

// Sample input
// Have to think some different mechanism to accomodate the input, but later

const input = {
	  "id": 1,
	  "discount_type": "product",
	  "discount_value": 2,
	  "collection": "Summer"
}


// Function to get the total number of pages asscociated with a particular ID

function get_page_count(callback) {
	request('https://backend-challenge-fall-2018.herokuapp.com/carts.json', (err, res, body) => {
		if(!err && res.statusCode == 200) {
			let data = JSON.parse(body);
			let pageCount = Math.ceil((data.pagination.total)/(data.pagination.per_page));
			callback(pageCount);
		}
	});
}

// Function to calculate the total amount for a given id and total amount after applying discount to it.

function calculateDiscount(callback) {
	 get_page_count((pg) => {
	 	let total_amount = 0;
	 	let discount_amount_total = 0;
	 	for(let pgCount=0; pgCount<pg; pgCount++) {
	 		let url = 'https://backend-challenge-fall-2018.herokuapp.com/carts.json?id=1&page=' + pgCount
	 		request(url, (err, response, body) => {
				if(!err && response.statusCode == 200) {
					var data = JSON.parse(body);
					let products = data.products;
					let products_length =  Object.keys(products).length;
					for(let i=0; i<products_length; i++) {
						total_amount +=products[i].price;
						if((products[i].hasOwnProperty('collection')) && (products[i].collection === input.collection)) 
							discount_amount_total += input.discount_value;
					}
					console.log("Total Amount before discount = " + total_amount);
					console.log("Total Amount after discount = " + (total_amount - discount_amount_total));
				}
			});
	 	}
	});
}

calculateDiscount();

const server = app.listen(8080, 'localhost', (err) =>{
	if(err) console.log(err);
	else console.log('server is listening at port 8080');
});

