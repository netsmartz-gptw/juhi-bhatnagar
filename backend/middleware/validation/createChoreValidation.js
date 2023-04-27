const { ErrorHandler } = require("../../helpers/errorHandler");
const { createChoreSchema } = require("../../validation-schemas")

const createChoreValidation = (req, res, next) => {
    const result = createChoreSchema.validate(req.body)
    if (result.error){
        return next(new ErrorHandler(400, result.error.details[0].message));        
    }
    next()
}

module.exports = createChoreValidation