import { getCityListOfSchoolService } from '~/services';

export const getMaTinhByName = async (name) => {
    const listCity = await getCityListOfSchoolService();
    let maTinh = '';
    listCity.forEach(city => {
        if (city.tenTinhTP.toLowerCase().includes(name.toLowerCase())) {
            maTinh = city.maTinh;
            return;
        }
    });
    return maTinh;
}