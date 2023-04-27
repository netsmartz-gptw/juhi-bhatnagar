const db = require("../mysql/models");

/**
 * Fetch all children uid from parent uid
 * 
 * @param {String} parentUid 
 */
const getChildsUidsByParentUids = async (parentUid) => {

	// get the parent id first 
	const user = await db.Users.findOne({
		where: { uid: parentUid },
		attributes: ['id']
	})

	if (!user || !user.id) return []

	// get the uid of childs
	const childs = await db.Users.findAll({
		where: { parentId: user.id },
		attributes: ["uid"]
	})

	if(!childs || !childs.length) return []

	return childs.map(child => child.uid)
}

/**
 * Fetch all children from parent uid
 * 
 * @param {String} parentUid 
 */
const getChildrenByParentUid = async (parentUid, selectChildParams) => {
	selectChildParams = selectChildParams || ['uid', 'firstName', 'lastName', 'profileImageUrl'];
	return await db.Users.findOne({
		where: { uid: parentUid },
		attributes: ['id'],
		include: {
			model: db.Users,
			as: 'children',
			attributes: selectChildParams
		},
		logging: false
	});
}

module.exports = {
	getChildsUidsByParentUids,
	getChildrenByParentUid,
}