const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Collection = require("./schemas/Collection");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(
		`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connected to mongodb"))
	.catch((err) => console.log(err));

//Get all collections
app.get("/api/collections", async (req, res) => {
	try {
		const collections = await Collection.find({});
		res
			.status(200)
			.json({ message: "Fetched collections successfully", data: collections });
	} catch (err) {
		res.status(500).json({ message: "Error fetching collections", error: err });
	}
});
// Create a new collection
app.post("/api/collections", async (req, res) => {
	try {
		const newCollection = new Collection({
			collectionName: req.body.name,
			questions: [],
		});
		const savedCollection = await newCollection.save();
		res.status(201).json({
			message: "Collection created successfully",
			data: savedCollection,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error creating collectioncoll", error: err });
	}
});

// Create a new question
app.post("/api/collections/:collectionId/question", async (req, res) => {
	const collectionId = req.params.collectionId;
	try {
		const updatedCollection = await Collection.updateOne(
			{ _id: collectionId },
			{
				$push: {
					questions: {
						questionType: req.body.questionType,
						questionText: req.body.questionText,
						choices: req.body.choices,
					},
				},
			}
		);
		res.status(201).json({
			message: "Question added successfully",
			data: updatedCollection,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error creating collection question", err });
	}
});

// Delete a question
app.delete(
	"/api/collections/:collectionId/questions/:questionId",
	async (req, res) => {
		const collectionId = req.params.collectionId;
		const questionId = req.params.questionId;
		try {
			const deletedQuestion = await Collection.updateOne(
				{ _id: collectionId },
				{ $pull: { questions: { _id: questionId } } }
			);
			res.status(200).json({
				message: "Question deleted successfully",
				data: deletedQuestion,
			});
		} catch (err) {
			res
				.status(500)
				.json({ message: "Error deleting collection question", err });
		}
	}
);

app.all("*", (req, res) => {
	res.status(400).send("<h1>404| Page Not Found</h1>");
});

app.listen(4000, () => {
	console.log("Server listening on port 4000");
});
