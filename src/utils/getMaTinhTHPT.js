import { getCityListOfSchoolService } from '~/services';

export const getMaTinhTHPT = async (nameTinhTHPT) => {
    const listCity = await getCityListOfSchoolService();
    let maTinhTHPT = '';
    listCity.forEach((city) => {
        if (city.tenTinhTP.toLowerCase().includes(nameTinhTHPT.toLowerCase())) {
            maTinhTHPT = city.maTinh;
            return;
        }
    })
    return maTinhTHPT;
}