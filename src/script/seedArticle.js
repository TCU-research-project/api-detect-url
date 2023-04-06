import cArticle from "../services/article";
import mongoose from "mongoose";
import { MONGODB_URL, MONGODB_AUTHSOURCE } from '../config';
const rp = require("request-promise");
const cheerio = require("cheerio");

const URL = `https://nhandan.vn/an-ninh-mang-tag10306.html?gidzl=ve-b6j-jq17gaAqVqhFM4k6IgnFFvuKJhCsjJPthW1UadFKRmRY0HgEO_4l7kTP1yS-jI3G04qmurwpU5G`;

const data = [];

const options = {
	uri: URL,
	transform: function (body) {
		//Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
		return cheerio.load(body);
	},
};

(async function crawler() {
	try {
		// Lấy dữ liệu từ trang crawl đã được parseDOM
		var $ = await rp(options);
	} catch (error) {
		return error;
	}

	const title = $("h3.story__heading a");

	title.each(function (index, item) {
		data.push({
			title: $(this).text().trim(),
			link: item['attribs']['href']
		});
	});

	const content = $("div.story__summary");

	content.each(function (index, item) {
		data[index].description = $(this).text();
	});

	const time = $("div.story__meta a.text2");

	time.each(function (index, item) {
		data[index].public_time = $(this).text().trim();
	});

	// console.log(data);

	await seederFunction();

	console.log('done seeder');

})();

const seederFunction = async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(`mongodb://${MONGODB_URL}?authSource=${MONGODB_AUTHSOURCE}`);
		console.log('Connect successfully!!!');
	} catch (error) {
		console.log('Connect failed!!!');
	}
	console.log('Running seed article');

	try {
		const articleService = new cArticle();
		for (let i in data) {
			// console.log(data[i]);
			await articleService.Create(data[i]);
		}
		console.log(`Saved`);
	} catch (error) {
		console.log(error);
	}
	await exit();
	console.log('End seed article');
};

async function exit() {
	await mongoose.disconnect();
}

