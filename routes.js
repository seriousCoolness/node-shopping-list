const express = require('express');
const router = express.Router();

const items = require('./fakeDB');

//Shows all shopping items.
router.get('/', (req, res) => {
    res.json(items);
});


//Accepts JSON data and add it to the shopping list.
router.post('/', (req, res) => {
    let request_json = req.body;

    let itemModified = false;
    for(let i in items)
    {
        if(items[i].name == request_json.name)
        {
            items[i].price = request_json.price;
            itemModified = true;
        }
    }
    if(itemModified == false)
        items.push(request_json);

    res.json({'added': request_json});
});


//Displays a single item’s name and price.
router.get('/:name', (req, res) => {
    const foundItem = items.find(value => value.name == req.params.name);
    if(foundItem == undefined || foundItem === undefined)
    {
        res.statusCode = 404;
        res.json('404: Must be name of existing item.');
    }
    else
        res.json(foundItem);
});


//Modifies a single item’s name and/or price. URL param is used to specify which item.
router.patch('/:name', (req, res) => {
    const foundIndex = items.findIndex(value => value.name == req.params.name);
    if(foundIndex === -1)
    {
        res.statusCode = 404;
        res.json('404: Must be name of existing item.');
    }
    else
    {
        if(req.body.name !== undefined)
            items[foundIndex].name = req.body.name;
        if(req.body.price !== undefined && parseFloat(req.body.price) !== NaN)
            items[foundIndex].price = req.body.price;
        res.json({'updated': items[foundIndex]});
    }
});

//Deletes a specific item from the item-list.
router.delete('/:name', (req, res) => {
    const foundIndex = items.findIndex(value => value.name == req.params.name);
    if(foundIndex === -1)
    {
        res.statusCode = 404;
        res.json('404: Must be name of existing item.');
    }
    else
    {
        let deleted_item = items[foundIndex];
        items.splice(foundIndex, 1);
        res.json({'deleted': deleted_item});
    }
});

module.exports = router;