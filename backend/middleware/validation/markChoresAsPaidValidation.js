const { ErrorHandler } = require("../../helpers/errorHandler");
const { markChoresAsPaidSchema } = require("../../validation-schemas")

const markChoresAsPaidValidation = (req, res, next) => {
    const result = markChoresAsPaidSchema.validate(req.body)
    if (result.error) {
        return next(new ErrorHandler(400, result.error.details[0].message));        
    }
    next()
}

module.exports = markChoresAsPaidValidation