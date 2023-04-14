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

router.post('/detect-url', body('url').notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
			data: null,
		});
	}
	const { url } = req.body;
	try {
		const urlService = new cURL();
		console.log(url);
		const whoisResponse = await whoiser(url);

		const whoisData = Object.values(whoisResponse)[0];
		let response;

		if (!whoisData['Domain Status'].length) {
			response = await urlService.Upsert({ name: url }, {
				name: url,
				resultDetection: 'notFound',
			});
			return res.json({
				success: true,
				message: 'Success',
				data: { response, whois: whoisData }
			});
		}

		response = await urlService.FindOne({ name: url });
		if (response) {
			return res.json({
				success: true,
				message: 'Success',
				data: { response, whois: whoisData },
			});
		}
		const responseFw = await api.post('/url_check', { url });
		if (!responseFw) {
			return res.status(400).json({
				success: false,
				message: "Server forwarding has been down"
			});
		}
		const { data } = responseFw;
		if (data) {
			response = await urlService.Create({
				name: url,
				resultDetection: data.msg
			});
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
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Server error',
		});
	}

});

export default router;
