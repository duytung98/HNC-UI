import { getMajorListService } from '~/services';

export const getMaNganhById = async (name) => {
    const listMajor = await getMajorListService();
    let maNganh = '';
    listMajor.forEach(major => {
        if (major.TenNganh.toLowerCase().includes(name.toLowerCase())) {
            maNganh = major.MaNganh;
            return;
        }
    });
    return maNganh;
}