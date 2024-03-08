import { getCommunelistService } from '~/services';

export const getMaXaByName = async (name, MaHuyen) => {
    const listCommune = await getCommunelistService(MaHuyen);
    let maPhuongXa = '';
    listCommune.forEach(commune => {
        if (commune.tenDonVi.toLowerCase().includes(name.toLowerCase())) {
            maPhuongXa = commune.ma;
            return;
        }
    });
    return maPhuongXa;
}