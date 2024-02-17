import React, { useState } from 'react';
import styles from './ModaLookupProfile.module.scss';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ToastMessger from '../ToastMessger/ToastMessger';

function ModaLookupProfile({ isvisible, onClose }) {
    const [showToast, setShowToast] = useState(false);

    if (!isvisible) return null;

    // click ra ngoài thì  modal đóng
    const handleClick = (e) => {
        if (e.target.id === 'wrapper') return onClose();
    };

    return (
        <>
            <div className={styles.modal} id="wrapper" onClick={handleClick}>
                <div className={styles.modal__container}>
                    {/* navbar */}
                    <div className={styles.modal__container_nav}>
                        <h3 className={styles.modal__nav_title}>Tra cứu thông tin hồ sơ đã nộp</h3>
                        <button className={styles.modal__nav_close} onClick={() => onClose()}>
                            {/* <CloseOutlinedIcon /> */} &times;
                        </button>
                    </div>

                    {/* line */}
                    <div className={styles.modal__nav_line}></div>
                    {/* search */}
                    <Formik
                        initialValues={{
                            number: '',
                            info: '',
                        }}
                        // hàm submit
                        onSubmit={(values, { resetForm, setErrors }) => {
                            resetForm();
                            console.log('🐬: ModaLookupProfile -> values', values);

                            // Định nghĩa schema Yup để kiểm tra lỗi
                            const validationSchema = Yup.object({
                                number: Yup.string().required('Chọn lại thông tin'),
                                info: Yup.string().required('Nhập lại thông tin'),
                            });

                            try {
                                // Sử dụng hàm validateSync của Yup để kiểm tra lỗi
                                validationSchema.validateSync(values, { abortEarly: false });

                                // Nếu không có lỗi validate, không hiển thị Toast
                                setShowToast(false);

                                // Nếu không có lỗi validate, có thể thực hiện các hành động khác ở đây
                            } catch (error) {
                                // Nếu có lỗi validate, hiển thị Toast và setErrors nếu cần
                                const errors = {};
                                for (const validationError of error.inner) {
                                    errors[validationError.path] = validationError.message;
                                }

                                // Set errors của Formik
                                setErrors(errors);

                                // Hiển thị Toast chỉ khi có lỗi validate
                                setShowToast(true);

                                // Giữ loader trong khoảng thời gian (ví dụ 2000ms)
                                setTimeout(() => {
                                    // Tắt loader
                                    setShowToast(false);

                                    // Kiểm tra xem có lỗi validate hay không
                                    if (Object.keys(errors).length === 0) {
                                        console.log('không có lỗi');
                                    } else {
                                        console.log('có lỗi');
                                    }
                                }, 1500); // Đặt thời gian tùy chọn
                            }
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit }) => (
                            <Form className={styles.modal__search} onSubmit={handleSubmit}>
                                <div className={styles.modal__search_container}>
                                    <select
                                        values={values.number}
                                        onChange={handleChange}
                                        name="number"
                                        id="searchType"
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '0.4rem',
                                            padding: '0.4rem 0.6rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="phonenumber">Số điện thoại</option>
                                        <option value="mahoso">Mã hồ sơ</option>
                                        <option value="email">Email</option>
                                        <option value="cccd">Số CCCD</option>
                                    </select>

                                    <Field
                                        type="text"
                                        name="info"
                                        placeholder="Nhập thông tin..."
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '0.4rem',
                                            padding: '0.3rem 0.3rem',
                                            width: '48%',
                                            position: 'relative',
                                        }}
                                        values={values.info}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.error__Lookup}>{errors.info}</div>
                                    <button
                                        type="submit"
                                        className={styles.modal__container_button}
                                        style={{
                                            borderRadius: '4px',
                                            background: '#128080',
                                            padding: '0.4rem 1.6rem',
                                            color: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Tra cứu
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            {showToast && <ToastMessger show={showToast} onClose={() => setShowToast(false)} />}
        </>
    );
}

export default ModaLookupProfile;
