import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
	manga_id: String,
	number: Number,
	title: {
		type: String,
		default: "none",
	},
	//pages: Number,
	imgCollection: [
		{
			type: Object,
			size: Number,
			filename: String,
			originalname: String,

			default: [
				{
					originalname: "none",
					size: 0,
					filename: "none",
				},
			],
		},
	],
	views: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	//comments?
});

export default mongoose.model("Chapter", ChapterSchema);
