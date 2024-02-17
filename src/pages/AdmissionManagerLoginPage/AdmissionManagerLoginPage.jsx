import { useRef } from 'react';
import classnames from 'classnames/bind';
import { useFormik } from 'formik';
import * as yup from 'yup';

import styles from './AdmissionManagerLoginPage.module.scss';
import logoImage from '~/assets/images/logo.png';
import { Button } from '~/components';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from '~/components/Icon';

const cx = classnames.bind(styles);

function AdmissionManagerLoginPage() {
    const inputPassRef = useRef(null);
    const formilk = useFormik({
        initialValues: {
            maCBTS: '',
            password: ''
        },
        validationSchema: yup.object({
            maCBTS: yup.string().required('Tài khoản không được để trống!'),
            password: yup.string().required('Mật khẩu không được để trống!'),
        }),
        onSubmit: (values) => {
            console.log(values);
        }
    })

    const handleTogglePassword = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const element = e.target.parentElement;
        let eParrent = element.parentElement;
        while (eParrent.id !== 'toggle-password')
            eParrent = eParrent.parentElement;
        const btnShow = eParrent.querySelector('#btn-show');
        const btnHidden = eParrent.querySelector('#btn-hidden');
        let type = inputPassRef.current.type;
        if (type === 'password') {
            element.classList.add('hidden');
            btnHidden.classList.remove('hidden');
            inputPassRef.current.type = 'text';
        } else {
            element.classList.add('hidden');
            btnShow.classList.remove('hidden');
            inputPassRef.current.type = 'password';
        }
    }

    return (
        <div className={cx('login-page')}>
            <div className={cx('login-left', 'fixed left-0 top-0 bottom-0 w-[20vw] bg-[#ccc] py-10')}
            >
                <div className={cx('login-logo', 'flex', 'justify-center')}>
                    <a href="https://caodanghanoi.edu.vn/">
                        <img src={logoImage} alt=""
                            className={cx('logo-image', 'w-[100px] h-[100px]')}
                        />
                    </a>
                </div>
                <h3 className={cx('login-left-text', 'text-center font-bold text-3xl mt-4 uppercase leading-[40px]')}
                >
                    Hệ thống <br /> tuyển sinh
                </h3>
            </div>
            <div className={cx('login-right', 'flex ml-[20vw] py-10 flex-col h-screen')} >
                <div className={cx('login-brand-name', 'text-4xl font-bold uppercase leading-[40px] shadow text-center border-b pb-10')}>
                    <h2>Trường cao đẳng Hà Nội</h2>
                    <h2>HANOI COLLEGE</h2>
                </div>
                <div className={cx('login-content', 'flex flex-col justify-between items-center mt-10 flex-1')}>
                    <form className={cx('login-form', 'bg-white border-2 py-5 px-10')}
                        onSubmit={formilk.handleSubmit}
                    >
                        <h4 className={cx('login-title', 'font-bold text-3xl text-center uppercase mb-10')}>
                            Đăng nhập hệ thống
                        </h4>
                        <>
                            <div className={cx('form-group', 'flex border border-[#ccc]',
                                {
                                    'is-invalid': formilk.errors.maCBTS &&
                                        formilk.touched.maCBTS
                                }
                            )}>
                                <label htmlFor='maCBTS'
                                    className={cx('form-label', 'bg-[#ccc] flex items-center justify-center')}>
                                    <UserIcon color='#ccc' />
                                </label>
                                <input type="text" placeholder='Tài khoản'
                                    name='maCBTS' id='maCBTS' autoComplete='false'
                                    className={cx('form-control', 'flex-1 h-10 pl-2')}
                                    value={formilk.values.maCBTS}
                                    onChange={formilk.handleChange}
                                />
                            </div>
                            {
                                formilk.errors.maCBTS && formilk.touched.maCBTS &&
                                <p className={cx('message', 'text-red-600 mt-2')}>
                                    {formilk.errors.maCBTS}
                                </p>
                            }
                        </>
                        <>
                            <div className={cx('form-group', 'flex mt-5 border border-[#ccc]',
                                {
                                    'is-invalid': formilk.errors.password &&
                                        formilk.touched.password
                                }
                            )}>
                                <label htmlFor='password'
                                    className={cx('form-label', 'bg-[#ccc] flex items-center justify-center')}>
                                    <LockIcon color='#ccc' className='form-icon' />
                                </label>
                                <input type="password" placeholder='Mật khẩu'
                                    name='password' id='password' autoComplete='false'
                                    className={cx('form-control', 'flex-1 h-10 pl-2')}
                                    value={formilk.values.password}
                                    ref={inputPassRef}
                                    onChange={formilk.handleChange}
                                />
                                <div className={cx('toggle-password')} id='toggle-password'>
                                    <span className={cx('toggle-show', 'toggle-btn')} onClick={handleTogglePassword} id='btn-show'>
                                        <EyeOffIcon width='18' height='18' />
                                    </span>
                                    <span className={cx('toggle-hidden', 'toggle-btn', 'hidden')} onClick={handleTogglePassword} id='btn-hidden'>
                                        <EyeIcon width='18' height='18' />
                                    </span>
                                </div>
                            </div>
                            {
                                formilk.errors.password && formilk.touched.password &&
                                <p className={cx('message', 'text-red-600 mt-2')}>
                                    {formilk.errors.password}
                                </p>
                            }
                        </>
                        <div className={cx('flex justify-center mt-10')}>
                            <Button className={cx('form-login-btn', 'p-3 rounded-xl')} primary large type="submit">
                                Đăng nhập
                            </Button>
                        </div>
                    </form>
                    <div className={cx('copyright', 'mt-5')}>
                        <h4 className={cx('copyright-brand')}>Trường Cao đẳng Hà Nội</h4>
                        <p className={cx('copyright-by', 'mt-1')}>
                            ©{new Date().getFullYear()} Developed by HPC - v1.0
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AdmissionManagerLoginPage;