const shoppingService = require("../src/shopping-list-service");
require("dotenv").config();
const knex = require("knex");
const { expect } = require("chai");

describe(`Shopping list services object`, () => {
  let db;
  let testItems = [
    {
      name: "Fish tricks1",
      id: 1,
      price: 13.0,
      category: "Main",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks2",
      id: 2,
      price: 13.11,
      category: "Snack",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks3",
      id: 3,
      price: 13.12,
      category: "Lunch",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks4",
      id: 4,
      price: 13.13,
      category: "Main",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks5",
      id: 5,
      price: 13.14,
      category: "Snack",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks6",
      id: 6,
      price: 13.15,
      category: "Lunch",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks7",
      id: 7,
      price: 13.16,
      category: "Breakfast",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks8",
      id: 8,
      price: 13.17,
      category: "Breakfast",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks9",
      id: 9,
      price: 13.18,
      category: "Lunch",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks10",
      id: 10,
      price: 13.19,
      category: "Main",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      name: "Fish tricks11",
      id: 12,
      price: 13.2,
      category: "Main",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db("shopping_list").truncate());
  after(() => db.destroy());
  afterEach(() => db("shopping_list").truncate());
  context(`Given shopping-lists has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return shoppingService.getAllItems(db).then((results) => {
        results = results.map((item) => {
          return { ...item, price: parseFloat(item.price) };
        });
        expect(results).to.eql(testItems);
      });
    });
    it(`getItem() resolves the item with specified id`, () => {
      const id = 3;
      let target = testItems[id - 1];
      return shoppingService.getItem(db, id).then((result) => {
        result = { ...result, price: parseFloat(result.price) };
        expect(result).to.eql(target);
      });
    });
    it(`deleteItem() deletes item by id`, () => {
      const id = 3;
      const target = testItems.filter((current) => current.id !== id);
      return shoppingService
        .deleteItem(db, id)
        .then(() => shoppingService.getAllItems(db))
        .then((results) => {
          expect(
            results.map((current) => {
              return { ...current, price: parseFloat(current.price) };
            })
          ).to.eql(target);
        });
    });
    it(`updateItem() resolves with an updated version of the item`, () => {
      const id = 3;
      let newInfo = {
        name: "Fish tricks8",
        price: 14.17,
        category: "Breakfast",
        checked: false,
        date_added: new Date("2029-01-22T16:28:32.615Z"),
      }
      return shoppingService
        .updateItem(db, id, newInfo)
        .then(() => shoppingService.getItem(db, id))
        .then((results) => {
          results = {...results, price: parseFloat(results.price)}
          expect(results).to.eql({...newInfo, id});
        });
    });  
  });

  context('resolves when no data is present in the database', () => {
      it('getAllItems() returns an empty array when database is empty', () => {
          return shoppingService
          .getAllItems(db)
          .then(results => {
              expect(results).to.eql([])
          })

      })
      it(`addItem() resolves with a new item we just added`, () => {
        let newItem = { 
            name: "I'm a piney bitch",
            price: 14.17,
            category: "Breakfast",
            checked: false,
            date_added: new Date("2029-01-22T16:28:32.615Z"),
          }
          return shoppingService
          .addItem(db, newItem)
          .then(results => {
              console.log("hello")
              expect({...results, price: parseFloat(results.price)}).to.eql({...newItem, id: results.id})
          })
    })
  })
});
