const mongoose = require("mongoose");
const { Schema } = mongoose;

const choiceSchema = new Schema({
	choiceText: String,
});
const collectionSchema = new Schema({
	collectionName: String,
	questions: [
		{ questionType: String, questionText: String, choices: [choiceSchema] },
	],
});

module.exports = mongoose.model("Collection", collectionSchema);
