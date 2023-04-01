import axios from 'axios';
import { URL_FORWARDING } from '../config';

const instance = axios.create({
  baseURL: URL_FORWARDING,
});

export default instance;
