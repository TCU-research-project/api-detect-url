import express from 'express';
import { body, query, validationResult } from 'express-validator';
import cURL from '../services/url';
import api from '../utils/api';
import whoiser from 'whoiser';

const router = express.Router();

router.get('/list', async (req, res) => {
	const { page, page_size } = req.query;
	try {
		const urlService = new cURL();
		let query = {};
		let pageSize = 20;
		if (!page_size) {
			pageSize = 20;
		} else {
			pageSize = +page_size;
		}
		if (Number(page_size) > 50) {
			pageSize = 50;
		}
		let offset = 1;
		if (!page) {
			offset = 1;
		} else {
			offset = +page;
		}
		let sortQuery = {
			created_at: -1,
		};

		const skip = (offset - 1) * pageSize;

		const response = await urlService.Find(query, skip, pageSize, sortQuery);

		if (response) {
			const countResponse = await urlService.Count();
			if (countResponse) {
				return res.json({
					success: true,
					message: 'Success',
					data: {
						data: response,
						count: countResponse,
					},
				});
			}
			return res.status(400).json({
				success: false,
				message: 'Count fail',
			});
		}
		return res.status(400).json({
			success: false,
			message: 'Internal error',
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Server error',
		});
	}
});

router.get('/detect-url', query('url').notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
			data: null,
		});
	}
	const { url } = req.query;
	try {
		const urlService = new cURL();
		let urlWhois;
		if (url.substring(0, 3) === 'www') {
			urlWhois = url.substring(4);
		} else {
			urlWhois = url;
		}
		const whoisResponse = await whoiser(urlWhois);

		const whoisData = Object.values(whoisResponse)[0];

		if (!whoisData['Domain Status'].length) {
			await urlService.Upsert(
				{ name: urlWhois },
				{
					name: urlWhois,
					notFound: true,
				},
			);
		} else {
			await urlService.Upsert(
				{ name: urlWhois },
				{
					name: urlWhois,
					notFound: false,
				},
			);
		}

		const urlExist = await urlService.FindOne({ name: urlWhois });
		if (!urlExist?.resultDetection) {
			const responseFw = await api.get(`/url_check?url=${urlWhois}`);
			if (!responseFw) {
				return res.status(400).json({
					success: false,
					message: 'Server forwarding has been down',
				});
			}
			const { data } = responseFw;
			if (data) {
				const response = await urlService.Update(
					{ name: urlWhois },
					{
						name: urlWhois,
						resultDetection: data.msg,
					},
				);
				if (response) {
					return res.json({
						success: true,
						message: 'Success',
						data: { response, whois: whoisData },
					});
				}
				return res.status(400).json({
					success: false,
					message: 'Save record error',
				});
			}
			return res.status(400).json({
				success: false,
				message: 'Internal error',
			});

		}
		return res.json({
			success: true,
			message: 'Success',
			data: { response: urlExist, whois: whoisData },
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Server error',
		});
	}
});

export default router;
