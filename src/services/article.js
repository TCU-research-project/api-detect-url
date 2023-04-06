import article from "../models/article";

export default class cArticle {
	Create = async (data) => {

		const newArticle = new article(data);
		const response = await newArticle.save();

		if (response) {
			return response;
		}

	};

	Find = async (query = {}, skip = null, limit = null, sort = null) => {

		const Query = article.find(query);
		if (skip) Query.skip(skip);
		if (limit) Query.limit(limit);
		if (sort) Query.sort(sort);

		const results = await Query;

		return results || [];

	};

	Count = async (query) => {
		const count = await article.countDocuments(query).exec();

		return count;
	};

	FindOne = async (query) => {
		const response = await article.findOne(query).exec();

		return response || null;
	};

	FindById = async (id) => {
		const response = await article.findById(id).exec();

		return response || null;
	};

	Update = async (query, dataUpdate) => {
		const articleUpdate = await article.findOneAndUpdate(
			query,
			{
				$set: { ...dataUpdate },
			},
			{
				returnDocument: 'after',
			},
		);

		return articleUpdate;
	};

	Upsert = async (query, dataUpdate) => {
		const articleUpdate = await url.findOneAndUpdate(
			query,
			{
				$set: { ...dataUpdate },
			},
			{
				returnDocument: 'after',
				upsert: true,
			},
		);

		return articleUpdate;
	};
}
