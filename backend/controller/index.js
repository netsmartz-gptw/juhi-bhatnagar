const createChore = require('./createChoreController')
const getChoreList = require('./getChoreListController')
const fetchPredefineChore = require('./predefineChoreController')
const approveChore = require('./approveChoreController')
const pendingApprovalChores = require('./pendingApprovalChoresController')
const getAllChildsChores = require('./getAllChildsChoresController')
const disapproveChore=require('./disapproveChoreController')
const approveAllChore=require('./approveAllcontroller')
const weeklyChoreTotalController = require('./weeklyChoreTotalController')
const editChoreController = require('./editChoreController')
const deleteChore = require('./deleteChoreController')
const fetchUnpaidChores = require('./fetchUnpaidChoresController')
const markChoresAsPaid = require('./markChoresAsPaidController')



module.exports = {
    createChore,
    getChoreList,
    fetchPredefineChore,
    disapproveChore,
    approveChore,
    approveAllChore,
    pendingApprovalChores,
    getAllChildsChores,
    weeklyChoreTotalController,
    editChoreController,
    deleteChore,
    fetchUnpaidChores,
    markChoresAsPaid
}