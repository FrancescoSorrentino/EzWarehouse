const newitemcrud = require('./crud/test-CRUD-NewItem');
const newrestockordercrud = require('./crud/test-CRUD-NewRestockOrder');
const newreturnorder = require('./crud/test-CRUD-NewReturnOrder');

testChange1();

function testChange1(){
        
    describe('Testing Change1 requirements', () => {
        newitemcrud.testNewItemCRUD();
        newrestockordercrud.testNewRestockOrderCRUD();
        newreturnorder.testNewReturnOrderCRUD();
    });
}
