let idSku = [];
let filteredIdSkuItems = [];
let idTestDescriptor = [];
let idSuppliers = []; 
let idRestockOrders = [];
let idRestockOrdersIssued = [];
let idReturnOrders = [];
let idTestResultsOnRFID = [];
let skuitem;

function getIdSku() {
    return idSku;
}

function setIdSku(id) {
    idSku = id;
}

function getFilteredIdSkuItems() {
    return filteredIdSkuItems;
}

function setFilteredIdSkuItems(id) {
    filteredIdSkuItems = id;
}

function getSkuItem() {
    return skuitem;
}

function setSkuItem(sk) {
    skuitem = sk;
}

function getIdTestDescriptor(){
    return idTestDescriptor;
}

function setIdTestDescriptor(id){
    idTestDescriptor = id;
}

function getIdSuppliers(){
    return idSuppliers;
}

function setIdSuppliers(id){
    idSuppliers = id;
}

function getIdRestockOrders(){
    return idRestockOrders;
}

function setIdRestockOrders(id){
    idRestockOrders = id;
}

function getIdRestockOrdersIssued(){
    return idRestockOrdersIssued;
}

function setIdRestockOrdersIssued(id){
    idRestockOrdersIssued = id;
}

function getIdReturnOrders(){
    return idReturnOrders;
}

function setIdReturnOrders(id){
    idReturnOrders = id;
}

function getIdTRonRFID() {
    return idTestResultsOnRFID;
}

function setIdTRonRFID(id) {
    idTestResultsOnRFID = id;
}


exports.getIdReturnOrders = getIdReturnOrders
exports.setIdReturnOrders = setIdReturnOrders
exports.getIdRestockOrdersIssued = getIdRestockOrdersIssued;
exports.setIdRestockOrdersIssued = setIdRestockOrdersIssued;
exports.getIdRestockOrders = getIdRestockOrders;
exports.setIdRestockOrders = setIdRestockOrders;
exports.getIdSku = getIdSku;
exports.setIdSku = setIdSku;
exports.getFilteredIdSkuItems = getFilteredIdSkuItems;
exports.setFilteredIdSkuItems = setFilteredIdSkuItems;
exports.getSkuItem = getSkuItem;
exports.setSkuItem = setSkuItem;
exports.getIdTestDescriptor = getIdTestDescriptor
exports.setIdTestDescriptor = setIdTestDescriptor
exports.getIdSuppliers = getIdSuppliers
exports.setIdSuppliers = setIdSuppliers
exports.getIdTRonRFID = getIdTRonRFID
exports.setIdTRonRFID = setIdTRonRFID