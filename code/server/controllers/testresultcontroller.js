
class TestResultController {
    constructor(testDescriptor, testResult, skuitem) {
        this.testDescriptor = testDescriptor
        this.testResult = testResult
        this.skuitem = skuitem
    }


    getTestResults = async (rfid) => {
        const skuitemRes = await this.skuitem.getItem(rfid);
        if (!skuitemRes) //res.status(404).send('no sku item associated to rfid')
            return ;//返回的数组，所以没有东西的话返回空数组，前端直接判断也会是true所以要单独查一下
        const result = await this.testResult.getTestResults(rfid);
        return result;
    }

    getTestResultByID = async (rfid, trID) => {
        /*const result = await this.testResult.getTestResultByID(rfid, trID)       
        return result;*/
        // let skuitemexist = await this.skuitem.getItem(rfid);
        // if(!skuitemexist) return null;

        return await this.testResult.getTestResultByID(rfid, trID) 
        // return ;
    }

    //POST
    addTestResult = async (tr) => {  
        const rfid = tr.rfid;
        const tdid = tr.idTestDescriptor;
        
        let skuitemRes = await this.skuitem.getItem(rfid);
        let td = await this.testDescriptor.getTestDescriptorByID(tdid);
        if (!skuitemRes || !td) {
            return false;
        }

        let result = await this.testResult.new(tr)
        // return result.changes != 0;
        return result;
        // const result = await this.testResult.new(tr)
        // return result.changes != 0
        // return;
    }

    //PUT
    // updateTestResult = async (rfid, trID, newTR) => {        
    //     const result = await this.testResult.update(rfid, trID, newTR)
    //     return result.changes != 0
    // }
    updateTestResult = async (rfid, trID,newTR) => {
        const newTrID = newTR.newIdTestDescriptor;

        let skuitemRes = await this.skuitem.getItem(rfid);
        let t1 = await this.testResult.getTestResultByID(rfid, trID)
        let t2 = await this.testDescriptor.getTestDescriptorByID(newTrID);

        if (!skuitemRes || !t1 || !t2) {
            return false;
        }

        let result = await this.testResult.update(rfid, trID, newTR)
        // return result.changes != 0;
        return result;
    }

    // deleteTestResult = async (rfid, trID) => {
    //     const result = await this.testResult.delete(rfid, trID)
    //     return result.changes != 0
    // }
    deleteTestResult = async (id, rfid) => {

        const s = await this.testResult.getTestResultByID(rfid, id)
        if (!s) {
            return false;
        }
        let result = await this.testResult.delete(rfid, id)
        // console.log(result)
        // return result.changes != 0;
        return result;
    }


}

module.exports = TestResultController;