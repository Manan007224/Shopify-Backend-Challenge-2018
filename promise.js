const request_promise = require('request-promise');

const URL = 'https://backend-challenge-fall-2018.herokuapp.com/carts.json?id='

const input = {
	  "id": 1,
	  "discount_type": "product",
	  "discount_value": 2,
	  "collection": "Summer"
};

// Function to calculate the number of given pages for a particular id from the input
// returns an Integer

async function getPageCount() {
	try {
		let uri = URL + input.id;
		let body = await request_promise.get(uri);
		let apiData = JSON.parse(body);
		return Math.ceil((apiData.pagination.total)/(apiData.pagination.per_page));
	}
	catch (err) {
		console.log(err);
	}
}

// Function to get body using the API endpoint and the page number
// returns the body in JSON format

async function get_api(pgNumber) {
	try {
		let uri = 'https://backend-challenge-fall-2018.herokuapp.com/carts.json?id=' + input.id + '&page=' + pgNumber; 
		let body = await request_promise.get(uri);
		return JSON.parse(body);
	} catch(err) {
		console.log(err);
	}
}

// Function to check if the given id provided by the input is valid or not
// If there is an invalid id then API endpoint's response would be 
// body: '{"message": "Problem not found."}'
// returns a boolean

async function checkID() {
	try {
		let uri = 'https://backend-challenge-fall-2018.herokuapp.com/carts.json?id=' + input.id;
		let body = await request_promise.get(uri);
		let data = JSON.parse(body);
		if(data.hasOwnProperty('products')) return true;
		else return false;
	}
	catch(err) {
		console.log(err);
	}
}

// Calculate the discout for a particular page and a particular id
// returns a JSON object containing total_amount and discount_amount

const findDiscount = (apiData) => {
	let prices = {};
	let products = apiData.products;
	let products_length =  Object.keys(products).length;
	let total_amount = 0; let discount_amount = 0;
	for(let pr=0; pr<products_length; pr++) {
		total_amount +=products[pr].price;
		if((products[pr].hasOwnProperty('collection')) && (products[pr].collection === input.collection)) 
			discount_amount += input.discount_value;
	}
	return {
		amount: total_amount,
		discount: discount_amount
	};
}

// Function to calculate the final amount and discount
// Console.logs the JSON object containing the total_amount and total_after_discount

async function getData() {
	try {
		let validation = await checkID();
		if(validation === true) {
			let pages = await getPageCount();
			console.log('Pages = ' + pages);
			let discount = 0; let total = 0;
			for(let pg=1; pg<=pages; pg++) {
				let res = await get_api(pg);
				let prices = await findDiscount(res);
				total += prices.amount; discount += prices.discount;
			}
			output =  {
				"total_amount" : total,
				"total_after_discount" : (total-discount)
			}
			console.log(JSON.stringify(output));
		}
		else console.log('Please enter a valid ID');
	}
	catch (err) {
		console.log(err);
	}
}

getData();

