const express = require('express');
const router = express.Router()
const chore = require('../controller/index');
const { auth, parentRole, childRole, markAsComplete, markAllCompleted } = require('../middleware');
const checkSyncCompeltedChores = require('../middleware/checkSyncCompeltedChores');
const createChoreValidation = require('../middleware/validation/createChoreValidation');
const editChoreValidation = require('../middleware/validation/editChoreValidation')
const markChoreAsCompletedValidation = require('../middleware/validation/markChoreAsCompleted')
const markChoresAsPaidValidation = require('../middleware/validation/markChoresAsPaidValidation')


router.get('/list', auth, childRole, chore.getChoreList)
router.get('/predefined', auth, parentRole, chore.fetchPredefineChore)
router.get('/pendingApproval', auth, parentRole, chore.pendingApprovalChores)
router.delete('/chorehistory/:id/disapprove',  auth, parentRole, chore.disapproveChore);
router.put('/chorehistory/approveall', auth, parentRole, chore.approveAllChore);
router.put('/chorehistory/:id/approve', auth, parentRole, chore.approveChore);
router.get('/allChildChores', auth, parentRole, chore.getAllChildsChores)
router.get('/weeklyChoreTotal',auth, chore.weeklyChoreTotalController)

// new endpoints after deprication
router.delete('/:id/',auth, parentRole, chore.deleteChore)
router.post('/', createChoreValidation, auth, parentRole, chore.createChore)

// depricated
router.delete('/:id/delete',auth, parentRole, chore.deleteChore)
router.put('/:choreId/edit',editChoreValidation,auth,parentRole, chore.editChoreController)
router.post('/create', createChoreValidation, auth, parentRole, chore.createChore)

router.post('/markAsCompleted',markChoreAsCompletedValidation, auth, childRole, markAsComplete, checkSyncCompeltedChores)
router.post('/markAllCompleted', auth, childRole, markAllCompleted, checkSyncCompeltedChores)


router.get('/unpaid/:uid', chore.fetchUnpaidChores)
router.put('/mark/paid', markChoresAsPaidValidation, chore.markChoresAsPaid)

router.put('/:choreId', editChoreValidation, auth, parentRole, chore.editChoreController)
module.exports = router;