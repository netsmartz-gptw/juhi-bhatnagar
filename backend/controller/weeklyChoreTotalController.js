const db = require("../mysql/models/index")
const { getChildsUidsByParentUids } = require("../helpers/choreHelpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const Chore = require("../models/choresModal")

/**
 * calculate weekly chore total
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const weeklyChoreTotalController = async (req, res, next) => {
    const uid = req.body.uid
    let sumAmount
    try {

        const user = await db.Users.findOne({
            where: {
                uid
            },
            attributes: ['roleId'],
            include: {
                model: db.role,
                required: true,
                attributes: ['role']
            },

        })
        if(!user) return next(new ErrorHandler(500))

        let match = { uid };

        if (user.role.role === 'admin' || user.role.role === 'parent') {
            const childUids = await getChildsUidsByParentUids(uid)
            match = { uid: { $in: childUids } }
        }

        console.log(match)

        const data = await Chore.aggregate([{
            $match: match
        }, {
            $group:
                { _id: null, sum: { $sum: "$amount" }, count: {$sum: 1} }
        }])

        sumAmount = (data?.length && data[0]?.sum) ? data[0]?.sum?.toFixed(2) : 0.00;

        return res.status(200).send({
            statusCode: 200,
            response: {
                amount: sumAmount,
                count: data[0]?.count || 0
            }
        })

    } catch (err) {
        return next(new ErrorHandler(500))
    }
}

module.exports = weeklyChoreTotalController
