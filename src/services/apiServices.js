import { getYHN } from '~/utils';
import { request } from '~/configs';

export const getNationListService = async () => {
    try {
        const url = request.apiUrlBaseYHN + request.apiNationYNH;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

export const getCityListService = async () => {
    try {
        const url = request.apiUrlBaseYHN + request.apiCityYHN;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}
export const getCityListOfSchoolService = async () => {
    try {
        const url = request.apiUrlBaseYHN + request.apiCitySchoolYHN;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}


export const getDistrictListService = async (maTinh) => {
    try {
        const url = request.apiUrlBaseYHN + request.apiDistrictYHN + maTinh;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}


export const getDistrictListOfSchoolService = async (maTinh) => {
    try {
        const url = request.apiUrlBaseYHN + request.apiDistrictSchoolYHN + maTinh;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

export const getCommunelistService = async (MaHuyen) => {
    try {
        const url = request.apiUrlBaseYHN + request.apiCommuneYHN + MaHuyen;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

export const getSchoollistService = async (MaTinh, MaHuyen) => {
    try {
        const url = request.apiUrlBaseYHN + '/truong-thpt/maTinhTP/' + MaTinh + '/maQuanHuyen/' + MaHuyen;
        const res = await getYHN(url);
        const data = res.data;
        return data;
    }
    catch (e) {
        console.log(e);
    }
}