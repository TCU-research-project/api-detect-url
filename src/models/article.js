import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	link: {
		type: String,
		require: true
	},
	public_time: {
		type: String,
		require: true,
	}
},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		collection: 'Article',
	},);

export default mongoose.model('Article', articleSchema);
