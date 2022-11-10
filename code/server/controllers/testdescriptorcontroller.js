

class TestDescriptorController {
    constructor(sku, testdesc) {
        this.sku = sku;
        this.testdesc = testdesc;
    }

    //GET
    getTestDescriptors = async()=>{
        let result = await this.testdesc.getTestDescriptors()
        return result;
    }

    getTestDescriptorByID = async (tdID) => {
        // console.log(tdID)
        let result = await this.testdesc.getTestDescriptorByID(tdID);
        // console.log(">>>>",result)
        // if (result) {
        //     return result;
        // }
        // return undefined;
        return result;
    }

    //POST
    addTestDescriptor = async (td) => {
        // const result = await this.testdesc.new(td)
        // return result.changes != 0
        const idSKU = td.idSKU;
        let t = await this.sku.getSku(idSKU);
        if (t === undefined) {
            return false;
        }
        let result = await this.testdesc.new(td)
        // return result.changes != 0;
        return result
    }

    //PUT
    updateTestDescriptor = async (tdID, newTD) => {
        // const result = await this.testdesc.update(tdID, newTD)
        // return result.changes != 0
        const idSKU = newTD.newIdSKU;

        let t1 = await this.testdesc.getTestDescriptorByID(tdID)
        let t2 = await this.sku.getSku(idSKU);
        if (t1 === undefined || t2 === undefined) {
            return false;
        }

        let result = await this.testdesc.update(tdID, newTD)
        // return result.changes != 0;
        return result;
    }

    //DELETE
    deleteTestDescriptor = async (tdID) => {
        // const result = await this.testdesc.delete(tdID)
        // return result.changes != 0
        let t = await this.testdesc.getTestDescriptorByID(tdID)

        if (!t) {
            return false;
        }
        let result = await this.testdesc.delete(tdID)
        // return result.changes != 0;
        return result;
    }

}

module.exports = TestDescriptorController;