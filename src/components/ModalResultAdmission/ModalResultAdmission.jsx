import React, { useState } from 'react';
import styles from '../ModaLookupProfile/ModaLookupProfile.module.scss';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Recruitment from '../Recruitment/Recruitment';

function ModalResultAdmission({ result, onClose }) {
    // modal kết quả của tra cứu kết quả xét tuyển
    const [showRecruitment, setShowRecruitment] = useState(false);

    // trạng thái của toast message
    const [loader, setShowLoader] = useState(false);

    // trạng thái của hiện modal tra cứu kết quả
    const [searchModalVisible, setSearchModalVisible] = useState(true);

    // kiểm tra prop result có rỗng không
    if (!result) return null;

    // hàm xử lý tắt modal
    const handleClick = (e) => {
        if (e.target.id === 'result') return onClose();
    };

    return (
        <>
            <div className={styles.modal} id="result" onClick={handleClick}>
                <div className={styles.modal__container}>
                    <div className={styles.modal__container_nav}>
                        <h3 className={styles.modal__nav_title}>Tra cứu kết quả xét tuyển</h3>
                        <button className={styles.modal__nav_close} onClick={() => onClose()}>
                            &times;
                        </button>
                    </div>

                    <div className={styles.modal__nav_line}></div>
                    {/* search */}
                    <Formik
                        initialValues={{
                            number: '',
                            info: '',
                        }}
                        validationSchema={Yup.object({
                            number: Yup.string().required('Chọn lại thông tin'),
                            info: Yup.string().required('Nhập lại thông tin'),
                        })}
                        // hàm submit
                        onSubmit={(values, { resetForm, setErrors, errors }) => {
                            resetForm();
                            console.log('🐬: ModalResultAdmission -> values', values);

                            // Kiểm tra xem có lỗi validate hay không
                            setShowLoader(true);

                            // Giữ loader trong khoảng thời gian (ví dụ 2000ms)
                            setTimeout(() => {
                                // Tắt loader
                                setShowLoader(false);

                                // Kiểm tra xem có lỗi validate hay không
                                if (setErrors && Object.keys(setErrors).length === 0) {
                                    console.log('không có lỗi');
                                    // Nếu không có lỗi validate, hiển thị modal Recruitment
                                    setShowRecruitment(true);
                                } else {
                                    console.log('🐬: ModalResultAdmission -> Validation errors', setErrors);
                                    console.log('có lỗi');
                                }
                            }, 2000); // Đặt thời gian tùy chọn
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
                                    {errors.info && touched.info && (
                                        <div className={styles.error__info}>{errors.info}</div>
                                    )}

                                    <button
                                        type="submit"
                                        className={styles.modal__container_button}
                                        style={{
                                            borderRadius: '4px',
                                            background: '#128080',
                                            padding: '0.4rem 0.6rem',
                                            color: '#fff',
                                        }}
                                        // onClick={() => setShowRecruitment(true)}
                                    >
                                        Tra cứu
                                    </button>
                                </div>
                                {/* Hiển thị loader */}
                                {loader && (
                                    <div>
                                        <div className={styles.loader}></div>
                                        <h1 className="text-center text-[#128080] font-medium text-[20px] ">Hệ thống đang xử lý</h1>
                                    </div>
                                )}
                                {/* Hiển thị modal Recruitment nếu không có lỗi validate */}
                                {showRecruitment && (
                                    <Recruitment
                                        reasultModal={showRecruitment}
                                        onClose={() => setShowRecruitment(false)}
                                    />
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}

export default ModalResultAdmission;
