const { ErrorHandler } = require("../../helpers/errorHandler");
const { editChoreSchema } = require("../../validation-schemas")

const editChoreValidation = (req, res, next) => {
    const result = editChoreSchema.validate(req.body)
    if (result.error){
        return next(new ErrorHandler(400, result.error.details[0].message));        
    }
    next()
}

module.exports = editChoreValidation