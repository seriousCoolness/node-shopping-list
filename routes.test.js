process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
const items = require('./fakeDB');

let test_item = {'name': 'banana', 'price': 2.50};

beforeEach(function() {
    items.push(test_item);
});

afterEach(function() {
    //make sure items is mutated, not redefined.
    test_item = {'name': 'banana', 'price': 2.50};
    items.splice(0,items.length);
});

//TODO: TESTS HERE

describe("GET /items", function() {
    test("Gets all items in item list.", async function() 
    {
        const res = await request(app).get('/items');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{"name":"banana","price":2.5}]);
        
    });
});


describe("GET /items/:name", function() {
    test("Gets a specific item in item list.", async function() 
    {
        const res1 = await request(app).get(`/items/banana`);
        
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({"name":"banana","price":2.5});
        

        //check that it handles attempts to retrieve a non-existant item correctly
        const res2 = await request(app).get(`/items/pickle`);
        expect(res2.statusCode).toBe(404);

        
        expect(res2.body).toEqual('404: Must be name of existing item.');
        
    });
});


describe("POST /items", function() {
    test("Adds an item to item list from json request.", async function() 
    {
        let pickles = {'name': 'pickles', 'price': 1.25};
        const res1 = await request(app).post(`/items`).send({'name': 'pickles', 'price': 1.25});
        
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({'added': pickles});
        

        //check that it was actually added to the list
        const res2 = await request(app).get(`/items`);
        expect(res2.statusCode).toBe(200);

        expect(res2.body).toEqual([test_item,pickles]);
        
        const res3 = await request(app).get(`/items/pickles`);
        expect(res3.statusCode).toBe(200);

        expect(res3.body).toEqual(pickles);
        
    });
});

describe("PATCH /items/:name", function() {
    test("Updates an item from the item list given name in URL parameter.", async function() 
    {
        const res1 = await request(app).patch(`/items/banana`).send({'name': 'bananas', 'price': 1.75});
        
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({'updated': {'name': 'bananas', 'price': 1.75}});


        const res2 = await request(app).patch(`/items/cocacola`);
        
        expect(res2.statusCode).toBe(404);
        expect(res2.body).toEqual('404: Must be name of existing item.');
        

        const res3 = await request(app).get(`/items/banana`);
        
        expect(res3.statusCode).toBe(404);
        expect(res3.body).toEqual('404: Must be name of existing item.');


        const res4 = await request(app).get(`/items/bananas`);
        
        expect(res4.statusCode).toBe(200);
        expect(res4.body).toEqual({'name': 'bananas', 'price': 1.75});

    });
});

describe("DELETE /items/:name", function() {
    test("Deletes an item from the item list given name in URL parameter.", async function() 
    {
        const res1 = await request(app).delete(`/items/banana`);
        
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({'deleted': {'name': 'banana', 'price': 2.5}});


        const res2 = await request(app).delete(`/items/cocacola`);
        
        expect(res2.statusCode).toBe(404);
        expect(res2.body).toEqual('404: Must be name of existing item.');
        

        const res3 = await request(app).get(`/items/bananas`);
        
        expect(res3.statusCode).toBe(404);
        expect(res3.body).toEqual('404: Must be name of existing item.');
    
    });
});