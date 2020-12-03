require("dotenv").config();
const knex = require('knex')
const knexInstance = knex({
    client: 'pg', 
    connection: process.env.DB_URL
})

function search(searchTerm){
    knexInstance.select('*')
    .from('shopping_list')
    .where('name', 'ilike', `%${searchTerm}%`).then(result => console.log(result))
}

function paginate(pageNumber){
    const limit = 6;
    knexInstance.select('*')
    .from('shopping_list')
    .limit(limit)
    .offset(limit * (pageNumber - 1))
    .then(results => console.log(results))
}


function after(daysAgo){
    knexInstance.select('*')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(results => {console.log(results)})
}
// search('burger')

function totalCost(){
knexInstance.select('category')
.sum('price')
.from('shopping_list')
.groupBy('category')
.then(results => console.log(results))
}
totalCost()
// after(2)