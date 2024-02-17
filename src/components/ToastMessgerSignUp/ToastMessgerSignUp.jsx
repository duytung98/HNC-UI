import React from 'react';
import styles from '~/components/ToastMessger/ToastMessger.module.scss';
import { AlertCircle, Close } from '../Icon';

function ToastMessgerSignUp({ showToast, onClose }) {
    console.log('🐬: ToastMessgerSignUp -> showToast', showToast);
    if (!showToast) return null;

    const handleClick = (e) => {
        if (e.target.id === 'showtoastSignUpMessage') return onClose();
    };
    return (
        <div
            className={`${styles.toast} ${styles.toast__yellow} ${styles.addMargin}`}
            id="showtoastSignUpMessage"
            onClick={handleClick}
        >
            <div className={styles.toast__icon}>
                <AlertCircle className={styles.toast__svg} />
            </div>
            <div className={styles.toast__content}>
                <p className={styles.toast__type}>Đăng ký thất bại</p>
                <p className={styles.toast__message}>Vui lòng kiểm tra lại thông tin!</p>
            </div>
            <div className={styles.toast__close} onClick={() => onClose()}>
                <Close />
            </div>
        </div>
    );
}

export default ToastMessgerSignUp;
