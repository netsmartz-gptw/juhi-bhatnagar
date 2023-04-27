const { ErrorHandler } = require("../helpers/errorHandler");
const { ChoresHistory } = require("../models")
const { MARK_CHORE_PAID } = require('../config/messages')

/**
 *  Mark chores as paid
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const markChoresAsPaid = async (req, res, next) => {
	const choreIds = req.body.choreIds

	try {
		const paidChores = await ChoresHistory.updateMany({ choreId: { $in: choreIds }, isApproved: true }, { isPaid: true }).exec();
		// send the ok response 
		return res.status(200).send({
			statusCode: 200,
			message: MARK_CHORE_PAID,
		})
	} catch (error) {
		return next(new ErrorHandler(500, null, null, error))
	}
}

module.exports = markChoresAsPaid