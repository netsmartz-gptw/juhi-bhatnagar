const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const jwk = require('../config/jwks.json')

const { ACCESS_TOKEN_REQUIRED, ACCESS_TOKEN_EXCEPTION, NOT_AUTHORIZED_EXCEPTION, ACCESS_TOKEN_EXPIRED } = require('../config/messages');
const { ErrorHandler } = require('../helpers/errorHandler');
const db = require("../mysql/models/index");
const { FORBIDDEN_ACCESS, FORBIDDEN_ACCESS_EXCEPTION } = require('../config/messages');

const auth = async (req, res, next) => {

	// first check if accesstoken exist or not
	if (!req.headers.accesstoken) {
		return next(new ErrorHandler(400, ACCESS_TOKEN_REQUIRED, ACCESS_TOKEN_EXCEPTION));
	}

	// decode access token and check if valid, if not return error
	try {

		// get the access token secret by selecting the correct pair of keys
		const env = process.env.NODE_ENV === 'production' ? process.env.DB_ENVIRONMENT : process.env.DB_ENVIRONMENT_LOCAL
		const pem = jwkToPem(jwk[env].keys[1])

		jwt.verify(req.headers.accesstoken, pem, { algorithms: ['RS256'] }, async function (err, decodedToken) {
			if (err) return next(new ErrorHandler(400, ACCESS_TOKEN_EXPIRED, NOT_AUTHORIZED_EXCEPTION));
			if (decodedToken.sub && req.headers.childuid) {
				/* Check if child UID has valid association to the parent UID along with the admin/parent's role */
				const child = await db.Users.findOne({
					where: { uid: req.headers.childuid },
					attributes: ['id', 'uid', 'roleId'],
					include: {
						model: db.Users,
						as: 'parent',
						required: true,
						where: { uid: decodedToken.sub },
						attributes: ['id', 'uid', 'parentId'],
						include: {
							model: db.role,
							where: {
								role: ['admin', 'parent']
							}
						}
					},
					logging: false		// console.log
				});
				if (!child || !child.parent) {
					return next(new ErrorHandler(403, FORBIDDEN_ACCESS, FORBIDDEN_ACCESS_EXCEPTION));
				}
				req.body.uid = req.headers.childuid;
				req.parentUid = decodedToken.sub;
				next();
			} else {
				req.body.uid = decodedToken.sub;
				next();
			}
		});
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = auth