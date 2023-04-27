const { ErrorHandler } = require("../../helpers/errorHandler");
const { markChoreAsCompletedSchema } = require("../../validation-schemas")

const markChoreAsCompletedValidation = (req, res, next) => {
    const result = markChoreAsCompletedSchema.validate(req.body)
    if (result.error){
        return next(new ErrorHandler(400, result.error.details[0].message));        
    }
    next()
}

module.exports = markChoreAsCompletedValidation