import React from 'react';
import styles from './ModalQr.module.scss';
import qr from '~/assets/images/chart-removebg-preview.png';
import { DownloadIcon } from '../Icon';

function ModalQr({ showModalQr, onClose }) {
    console.log('🐬: ModalQr -> showModalQr', showModalQr);

    if (!showModalQr) {
        return null;
    }
    const handleClick = (e) => {
        if (e.target.id === 'showModalQr') return onClose();
    };

    // hàm lưu mã QR
    const downloadQRCode = () => {
        const link = document.createElement('a');
        console.log('🐬: downloadQRCode -> link', link);
        link.download = { qr };
        link.href = qr;
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className={styles.modal} id="showModalQr" onClose={handleClick}>
            <div className={styles.modal__container}>
                <div className={styles.container__close} onClick={onClose}>
                    &times;
                </div>
                <div className={styles.container__title}>
                    <h1 className={styles.container__title_text}>Đăng ký thành công</h1>
                </div>

                <div className={styles.container__img}>
                    <img src={qr} alt="modal qr" />
                </div>

                <div className={styles.container__text}>
                    <i>Lưu ý : Lưu mã Qr về máy để kiểm tra thông tin</i>
                </div>

                <div className={styles.container__btn}>
                    <DownloadIcon />
                    <button className={styles.container__btn_file} onClick={downloadQRCode}>
                        Lưu mã QR
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalQr;
