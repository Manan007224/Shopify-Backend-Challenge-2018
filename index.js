const express = require('express');
const http = require('http');
const request = require('request');
const app = express();
const SYNC = require('sync');

// Sample input
// Have to think some different mechanism to accomodate the input, but later

const input = {
	  "id": 1,
	  "discount_type": "product",
	  "discount_value": 2,
	  "collection": "Summer"
}

// Funtion to return the id of the input

function get_input_id() {
	return input.id;
}


// Function to get the total number of pages asscociated with a particular ID

function get_page_count() {
	request('https://backend-challenge-fall-2018.herokuapp.com/carts.json?id=3&page=1', (err, res, body) => {
		if(!err && res.statusCode == 200) {
			let data = JSON.parse(body);
			let pageCount = Math.ceil((data.pagination.total)/(data.pagination.per_page));
			return pageCount;
		}
	});
}

function processDiscount(pageNum) {
	let url = 'https://backend-challenge-fall-2018.herokuapp.com/carts.json?id=3&page=' + pageNum;
	request(url, (err, response, body) => {
		if(!err && response.statusCode == 200) {
			var data = JSON.parse(body);
			console.log(data);
			let products = data.products;
			let products_length =  Object.keys(products).length;
			let total_amount = 0; let discount_amount_total = 0;
			for(let i=0; i<products_length; i++) {
						total_amount +=products[i].price;
						if((products[i].hasOwnProperty('collection')) && (products[i].collection === input.collection)) 
							discount_amount_total += input.discount_value;
			}
			console.log(price);
			price = {amount: total_amount, discount: discount_amount_total};
			return price;
		}
	}); 
}

// Function to calculate the total amount for a given id and total amount after applying discount to it.

function calculateDiscount() {
	let pg = get_page_count
 	let total_amount = 0;
 	let discount_amount_total = 0;
 	for(let pgCount=0; pgCount<=pg; pgCount++) {
 		prices = processDiscount(pgCount);
 		total_amount += prices.amount;
 		discount_amount_total += prices.discount;
 		console.log(prices);
 	}
 	console.log('Price before applying discount' + total_amount);
 	console.log('Price after applying discount' + discount_amount_total);
}

calculateDiscount();

