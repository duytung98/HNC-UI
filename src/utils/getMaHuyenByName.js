import { getDistrictListService } from '~/services';

export const getMaHuyenByName = async (name, maTinh) => {
    const listDistrict = await getDistrictListService(maTinh);
    let maHuyen = '';
    listDistrict.forEach(district => {
        if (district.tenDonVi.toLowerCase().includes(name.toLowerCase())) {
            maHuyen = district.ma;
            return;
        }
    });
    return maHuyen;
}