

 const shoppingService = {
     getAllItems(knex){
         return knex('shopping_list')
         .select('*')
     },
    addItem(knex, shoppingItem){
        return knex
        .insert(shoppingItem)
        .into('shopping_list')
        .returning('*')
        .then(rows => rows[0])
    }, 
    deleteItem(knex, id){
        return knex
        .from('shopping_list')
        .where({id})
        .delete()
    },
    updateItem(knex, id, updatedItemFields){
        return knex
        .from('shopping_list')
        .where({id})
        .update(updatedItemFields)
    }, 
    getItem(knex, id){
        return knex
        .select('*')
        .from('shopping_list')
        .where({id})
        .first()
    }
}

module.exports = shoppingService