const { ErrorHandler } = require("../helpers/errorHandler");
const ChoreHistory = require("../models/choresHistoryModal")
const { APPROVED_CHORES, NO_CHORE_LOG_FOUND, FORBIDDEN_ACCESS, NOT_AUTHORIZED_EXCEPTION, NO_CHILD_FOUND } = require('../config/messages');
const { getChildsUidsByParentUids } = require("../helpers/choreHelpers");

/**
 * Approve the chrore transactions of the week as per the chore IDs
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */

const approveChoreController = async (req, res, next) => {

	try {

		const choreHistoryID = req.params.id

		// AUTHORIZATION CHECK
		// get all childs of current user,
		// get the chore log
		// check if uid in choreHistory is one of the id in child uids
		const childsUids = await getChildsUidsByParentUids(req.body.uid)
		if(!childsUids) return next(new ErrorHandler(500, null, null, NO_CHILD_FOUND))

		const choreLog = await ChoreHistory.findById(choreHistoryID)
		if(!choreLog) return next(new ErrorHandler(400, NO_CHORE_LOG_FOUND));

		if(!childsUids.includes(choreLog.uid)) return next(new ErrorHandler(400, FORBIDDEN_ACCESS, NOT_AUTHORIZED_EXCEPTION));

		// uddate choreHistory log to approved
		await ChoreHistory.updateOne({_id:choreHistoryID},{isApproved:true} )

		// return response
		return res.status(200).send({
			statusCode: 200,
			response: {
				message: APPROVED_CHORES
			}
		})
	}
	catch(error){
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = approveChoreController;