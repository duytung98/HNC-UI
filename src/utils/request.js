import axios from 'axios';
import { request } from '~/configs';

//Api trường Y Hà Nội
export const requestYHN = axios.create({
    baseURL: request.apiUrlBaseYHN
});

export const getYHN = async (url) => {
    const res = await requestYHN.get(url);
    return res.data;
}