import { getDistrictListOfSchoolService } from '~/services';

export const getMaHuyenTHPT = async (nameHuyenTHPT, maTinh) => {
    const listDistrict = await getDistrictListOfSchoolService(maTinh);
    let maHuyenTHPT = '';
    listDistrict.forEach((disctrict) => {
        if (disctrict.tenQH.toLowerCase().includes(nameHuyenTHPT.toLowerCase()))
            maHuyenTHPT = disctrict.maQH;
    })
    return maHuyenTHPT;
}