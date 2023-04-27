'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChoresHistorySchema = new Schema({
	choreId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Chore'
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	uid: {
		type: String,
		required: true
	},
	days: [{
		type: String,
		required: false
	}],
	completed_on: [{
		type: String,
		required: false
	}],
	choreType: {
		type: String,
		enum: ['weekly', 'asNeeded'],
		required: true,
		default: "weekly"
	},
	amount: {
		type: Number,
		required: true,
		default: 0
	},
	isApproved: {
		type: Boolean,
		required: true,
		default: false
	},
	isPaid: {
		type: Boolean,
		required: true,
		default: false
	},
	started_on: {
		type: Date,
		default: Date.now
	},
	ended_on: {
		type: Date,
		default: Date.now
	},
	week: {
		type: Number,
		required: true,
	}
},
	{ timestamps: true }
);

const ChoresHistory = mongoose.model("ChoresHistory", ChoresHistorySchema);

module.exports = ChoresHistory;