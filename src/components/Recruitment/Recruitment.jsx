import React from 'react';
import styles from './Recruitment.module.scss';

function Recruitment({ reasultModal, onClose }) {
    console.log('🐬: Recruitment -> reasultModal', reasultModal);
    if (!reasultModal) return null;

    // click ra ngoài thì  modal đóng
    const handleClick = (e) => {
        if (e.target.id === 'Recruitment') return onClose();
    };

    return (
        <div className={styles.modal} id="Recruitment" onClose={handleClick}>
            <div className={styles.modal__container}>
                <div className={styles.container__close} onClick={() => onClose()}>
                    &times;
                </div>
                <div className={styles.container__title}>
                    <h1 className={styles.container__title_text}>Kết quả xét tuyển</h1>
                </div>

                <div className={styles.container__table}>
                    <table className="block min-w-full border-collapse md:table ">
                        <thead className="block md:table-header-group">
                            <tr className="border-grey-500 absolute -left-full -top-full block border md:relative md:left-auto md:top-auto md:table-row md:border-none">
                                <th className="md:border-grey-500 block bg-[#128080] p-2 text-center font-bold text-white md:table-cell md:border">
                                    Mã hồ sơ
                                </th>
                                <th className="md:border-grey-500 block bg-[#128080] p-2 text-center font-bold text-white md:table-cell md:border">
                                    Họ và tên
                                </th>
                                <th className="md:border-grey-500 block bg-[#128080] p-2 text-center font-bold text-white md:table-cell md:border">
                                    Ngày sinh
                                </th>
                                <th className="md:border-grey-500 block bg-[#128080] p-2 text-center font-bold text-white md:table-cell md:border">
                                    Số điện thoại
                                </th>
                                <th className="md:border-grey-500 block bg-[#128080] p-2 text-center font-bold text-white md:table-cell md:border">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            <tr className="border-grey-500 block border  md:table-row md:border-none">
                                <td className="md:border-grey-500 block p-2 text-center md:table-cell md:border  min-[400px]:flex justify-center items-center gap-1 h-[42px]   ">
                                    <span className="inline-block w-1/3 font-bold md:hidden">Mã sinh viên</span>aabbccc
                                </td>
                                <td className="md:border-grey-500 block p-2 text-center md:table-cell md:border  min-[400px]:flex justify-center items-center gap-1 h-[42px] ">
                                    <span className="inline-block w-1/3 font-bold md:hidden">Họ và tên</span>Nguyễn Văn
                                    A
                                </td>
                                <td className="md:border-grey-500 block p-2 text-center md:table-cell md:border  min-[400px]:flex justify-center items-center gap-1 h-[42px] ">
                                    <span className="inline-block w-1/3 font-bold md:hidden">Ngày sinh</span>
                                    12/03/2003
                                </td>
                                <td className="md:border-grey-500 block p-2 text-center md:table-cell md:border  min-[400px]:flex justify-center items-center gap-1 h-[42px] ">
                                    <span className="inline-block w-1/3 font-bold md:hidden">Số điện thoại</span>
                                    0123456789
                                </td>
                                <td className="md:border-grey-500 block p-2 text-center md:table-cell md:border  min-[400px]:flex justify-center items-center gap-1 h-[42px] ">
                                    <span className="inline-block w-1/3 font-bold md:hidden">Trạng thái </span>
                                    <span className=" px-2 py-1 font-bold ">Trúng Tuyển</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Recruitment;
