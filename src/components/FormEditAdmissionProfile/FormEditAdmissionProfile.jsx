import classnames from 'classnames/bind';
import { useFormik } from 'formik';
import { useEffect, memo, useState } from 'react';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './FormEditAdmissionProfile.module.scss';
import { Button, Image, ModalAlert } from '~/components';
import { UploadIcon, XSquareCloseIcon } from '~/components/Icon';
import {
    getNationListService,
    getCityListService,
    getDistrictListService,
    getCommunelistService,
    getCityListOfSchoolService,
    getDistrictListOfSchoolService,
    getSchoollistService,
} from '~/services';
const cx = classnames.bind(styles);

function FormEditAdmissionProfile({ maHS, onCloseForm }) {
    const [exit, setExit] = useState(false);

    const [inforProfile, setInforProfile] = useState(null);
    const [nationList, setNationList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [citysOfSchool, setCitysOfSchool] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [districtsOfSchool, setDistrictsOfSchool] = useState([]);
    const [communelist, setCommunelist] = useState([]);
    const [schoolList, setSchoolList] = useState([]);
    const [maTinhTHPT, setMaTinhTHPT] = useState('');
    const [MaHuyenTHPT, setMaHuyenTHPT] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [TruongTHPT, setTruongTHPT] = useState(null);

    //Call api để lấy thông tin chi tiết của hồ sơ
    useEffect(() => {
        if (!maHS) return;
        console.log('đã call api với maHS: ' + maHS);
    }, [maHS]);

    // Call api lấy danh sách dân tộc
    useEffect(() => {
        const getNationList = async () => {
            const data = await getNationListService();
            setNationList(data);
        };
        getNationList();
    }, []);

    // Call api lấy danh sách thành phố Việt Nam;
    useEffect(() => {
        const getCityList = async () => {
            const data = await getCityListService();
            setCityList(data);
        };
        getCityList();
    }, []);

    const formik = useFormik({
        initialValues: {
            HoDem: '',
            Ten: '',
            NgaySinh: '',
            CCCD: '',
            Email: '',
            DiaChi: '',
            GioiTinh: 'Nam',
            DanToc: 'Kinh',
            SDT: '',
            MaTinh: '',
            MaHuyen: '',
            MaXa: '',
            Truong: '',
            NamTotNghiep: '2024',
            DoiTuongUT: '',
            HinhThuc: '',
            MaNganh: '',
            DiemMon1: '0.0',
            DiemMon2: '0.0',
            DiemMon3: '0.0',
        },
        validationSchema: Yup.object({
            HoDem: Yup.string().required('Vui lòng nhập trường này!'),
            Ten: Yup.string().required('Vui lòng nhập trường này!'),
            NgaySinh: Yup.string().required('Vui lòng nhập trường này!'),
            DiaChi: Yup.string().required('Vui lòng nhập trường này!'),
            CCCD: Yup.string().required('Vui lòng nhập trường này!'),
            Email: Yup.string()
                .required('Vui lòng nhập trường này!')
                .email('Email không hợp lệ!')
                .max('255', 'Email quá dài!'),
            SDT: Yup.string().required('Vui lòng nhập thông tin!'),
            DiemMon1: Yup.string().required(),
            DiemMon2: Yup.string().required(),
            DiemMon3: Yup.string().required(),
        }),
        onSubmit: values => {
            console.log(values);
        },
    });

    //Call api lấy danh sách huyện của tỉnh
    let MaTinh = formik.values.MaTinh;
    useEffect(() => {
        const getDistrictList = async () => {
            const data = (await getDistrictListService(MaTinh)) || [];
            setDistrictList(data);
        };
        getDistrictList();
    }, [MaTinh]);

    //Call api lấy danh sách xã của huyện
    let MaHuyen = formik.values.MaHuyen;
    useEffect(() => {
        const getCommunelist = async () => {
            const data = (await getCommunelistService(MaHuyen)) || [];
            setCommunelist(data);
        };
        getCommunelist();
    }, [MaHuyen]);

    // Call api lấy danh sách thành phố của Schools
    useEffect(() => {
        const getCityList = async () => {
            const data = await getCityListOfSchoolService();
            setCitysOfSchool(data);
        };
        getCityList();
    }, []);

    //Call api lấy danh sách huyện của school
    useEffect(() => {
        const getDistrictList = async () => {
            const data = (await getDistrictListOfSchoolService(maTinhTHPT)) || [];
            setDistrictsOfSchool(data);
        };
        getDistrictList();
    }, [maTinhTHPT]);

    //Call api lấy danh sách  school
    useEffect(() => {
        const getSchoolList = async () => {
            const data = (await getSchoollistService(maTinhTHPT, MaHuyenTHPT)) || [];
            console.log(data);
            setSchoolList(data);
        };
        getSchoolList();
    }, [maTinhTHPT, MaHuyenTHPT]);

    const handleUploadImages = e => {
        e.preventDefault();
        e.stopPropagation();
        const element = e.target;
        const files = Array.from(element.files);
        const eParrent = element.parentNode;
        const eImgContainer = eParrent.querySelector('#img-container');
        const promises = files.map((file, index) => {
            if (index >= 2) return Promise.reject('Tải quá số file quy định');
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => {
                    const img_src = e.target.result;
                    resolve(`<img src="${img_src}" class="${cx('content-images-item')}"/>`);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then(imgs => {
                console.log(imgs);
                eImgContainer.innerHTML = imgs.join(' ');
            })
            .catch(e => alert('Bạn chỉ có thể tải tối đa 2 file ảnh !'));
    };

    const handleCloseForm = e => {
        e.preventDefault();
        e.stopPropagation();
        setExit(true);
        if (exit) {
            formik.resetForm();
            onCloseForm();
        }
    };

    const handleShowNamTotNghiep = () => {
        const date = new Date();
        const currentYear = date.getFullYear();
        const years = [currentYear];
        for (let i = 1; i <= 9; i++) {
            years.push(currentYear - i);
        }
        const yearsHttml = years.map(year => {
            return (
                <option value={year} selected={formik?.values?.NamTotNghiep === year}
                >
                    {year}
                </option>
            )
        })
        return yearsHttml;
    }

    return (
        <div className={cx('edit-admission')}>
            <div className={cx('title')}>
                <h4 className={cx('title-text', 'uppercase text-center py-5')}>Thông tin thí sinh</h4>
                <span className={cx('close')} onClick={handleCloseForm}>
                    <XSquareCloseIcon />
                </span>
            </div>
            <main className={cx('content')}>
                <form method='POST' onSubmit={formik.handleSubmit}>
                    <div className={cx('content-item')}>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item')}>
                                <div className={cx('content-name')}>
                                    {/* họ đệm */}
                                    <div className={cx('content-infor', 'content-firstName')}>
                                        <label htmlFor='HoDem' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Họ đệm
                                        </label>
                                        <input
                                            type='text'
                                            name='HoDem'
                                            id='HoDem'
                                            placeholder='Nhập vào họ đệm'
                                            className={cx('content-item-input')}
                                            // value={formik.values.HoDem}
                                            value='Nguyễn Văn'
                                            onChange={formik.handleChange}
                                        />
                                        {formik.errors.HoDem && formik.touched.HoDem ? (
                                            <p className={cx('message')}>{formik.errors.HoDem}</p>
                                        ) : (
                                            <p className={cx('message')}> </p>
                                        )}
                                    </div>

                                    {/* tên */}
                                    <div className={cx('content-infor', 'content-lastName')}>
                                        <label htmlFor='Ten' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Tên
                                        </label>
                                        <input
                                            type='text'
                                            name='Ten'
                                            id='Ten'
                                            placeholder='Nhập vào tên'
                                            className={cx('content-item-input')}
                                            // value={formik.values.Ten}
                                            value='Khiêm'
                                            onChange={formik.handleChange}
                                        />
                                        {formik.errors.Ten && formik.touched.Ten ? (
                                            <p className={cx('message')}>{formik.errors.Ten}</p>
                                        ) : (
                                            <p className={cx('message')}> </p>
                                        )}
                                    </div>
                                </div>

                                {/* ngày sinh */}
                                <div className={cx('content-infor', 'content-birthday')}>
                                    <label htmlFor='NgaySinh' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Ngày sinh
                                    </label>
                                    <DatePicker
                                        selected={birthday}
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        dropdownMode="select"
                                        className={cx('content-item-input')}
                                        placeholderText="DD/MM/YYYY"
                                        onChange={(date) => setBirthday(date)}
                                    />
                                    {formik.errors.NgaySinh && formik.touched.NgaySinh ? (
                                        <p className={cx('message')}>{formik.errors.NgaySinh}</p>
                                    ) : (
                                        <p className={cx('message')}> </p>
                                    )}
                                </div>

                                {/* giới tính */}
                                <div className={cx('content-gioiTinhAndDanToc')}>
                                    <div className={cx('content-infor', 'content-grender')}>
                                        <label htmlFor='GioiTinh' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Giới tính
                                        </label>
                                        <select
                                            name='GioiTinh'
                                            id='GioiTinh'
                                            className={cx('content-item-input')}
                                            onChange={formik.handleChange}>
                                            <option value='Nam' selected={formik.values.GioiTinh === 'Nam'}>
                                                Nam
                                            </option>
                                            <option value='Nữ' selected={formik.values.GioiTinh === 'Nữ'}>
                                                Nữ
                                            </option>
                                        </select>
                                        <p className={cx('message')}> </p>
                                    </div>

                                    {/* dân tộc */}
                                    <div className={cx('content-infor', 'content-dantoc')}>
                                        <label htmlFor='DanToc' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Dân tộc
                                        </label>
                                        <select
                                            name='DanToc'
                                            id='DanToc'
                                            className={cx('content-item-input')}
                                            onChange={formik.handleChange}>
                                            {nationList.map(nation => {
                                                return (
                                                    <option
                                                        value={nation?.tenDanToc}
                                                        key={nation?.ma}
                                                        selected={formik.values.DanToc === nation?.tenDanToc}>
                                                        {nation?.tenDanToc}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <p className={cx('message')}> </p>
                                    </div>
                                </div>

                                {/* chứng minh nhân dân/ căn cước công dân */}
                                <div className={cx('content-infor', 'content-CCCD')}>
                                    <label htmlFor='CCCD' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Nhập vào CMND/CCCD
                                    </label>
                                    <input
                                        type='text'
                                        name='CCCD'
                                        id='CCCD'
                                        placeholder='Nhập vào CMND/CCCD'
                                        className={cx('content-item-input')}
                                        value='82834823482348'
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.CCCD && formik.touched.CCCD ? (
                                        <p className={cx('message')}>{formik.errors.CCCD}</p>
                                    ) : (
                                        <p className={cx('message')}> </p>
                                    )}
                                </div>

                                {/* email */}
                                <div className={cx('content-infor', 'content-email')}>
                                    <label htmlFor='Email' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Email
                                    </label>
                                    <input
                                        type='text'
                                        name='Email'
                                        id='Email'
                                        placeholder='Nhập vào địa chỉ email'
                                        className={cx('content-item-input')}
                                        // value={formik.values.Email}
                                        value='khiem124@gmail.com'
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.Email && formik.touched.Email ? (
                                        <p className={cx('message')}>{formik.errors.Email}</p>
                                    ) : (
                                        <p className={cx('message')}> </p>
                                    )}
                                </div>

                                {/* số điện thoại */}
                                <div className={cx('content-infor', 'content-phone')}>
                                    <label htmlFor='SDT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Số điện thoại
                                    </label>
                                    <input
                                        type='text'
                                        name='SDT'
                                        id='SDT'
                                        placeholder='Nhập vào số điện thoại'
                                        className={cx('content-item-input')}
                                        // values={formik.values.SDT}
                                        value='0987652732'
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.SDT && formik.touched.SDT ? (
                                        <p className={cx('message')}>{formik.errors.SDT}</p>
                                    ) : (
                                        <p className={cx('message')}> </p>
                                    )}
                                </div>
                            </div>

                            {/* hộ khẩu thường trú */}
                            <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                                <div className={cx('content-infor', 'content-hometown')}>
                                    <label htmlFor='Tinh' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Hộ khẩu thường trú
                                    </label>
                                    <div className={cx('content-full-item')}>
                                        <div className={cx('content-howtel-tinh')}>
                                            <select
                                                name='MaTinh'
                                                id='Tinh'
                                                className={cx('content-item-input')}
                                                onChange={(e) => {
                                                    formik.values.MaHuyen = ''
                                                    formik.handleChange(e)
                                                }}
                                            >
                                                <option value=''
                                                    selected={formik.values.MaTinh === ''}
                                                >
                                                    Chọn Tỉnh / Thành Phố
                                                </option>
                                                {cityList.map(city => {
                                                    return (
                                                        <option value={city?.ma} key={city?.ma}>
                                                            {city?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <p className={cx('message')}> </p>
                                        </div>
                                        <div className={cx('content-howtel-huyen')}>
                                            <select
                                                name='MaHuyen'
                                                id='Huyen'
                                                className={cx('content-item-input')}
                                                onChange={(e) => {
                                                    formik.values.MaXa = '';
                                                    formik.handleChange(e)
                                                }}
                                            >
                                                <option value=''
                                                    selected={formik?.values?.MaHuyen === ''}
                                                >
                                                    Chọn Quận / Huyện
                                                </option>
                                                {districtList.map(district => {
                                                    return (
                                                        <option
                                                            value={district?.ma}
                                                            key={district?.ma}
                                                        >
                                                            {district?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <p className={cx('message')}> </p>
                                        </div>
                                        <div className={cx('content-howtel-xa')}>
                                            <select
                                                name='MaXa'
                                                id='Xa'
                                                className={cx('content-item-input')}
                                                onChange={formik.handleChange}>
                                                <option
                                                    value=''
                                                    selected={formik?.values?.MaXa === ''}
                                                >
                                                    Chọn xã
                                                </option>
                                                {communelist.map(commune => {
                                                    return (
                                                        <option
                                                            value={commune?.ma}
                                                            key={commune?.ma}
                                                        >
                                                            {commune?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <p className={cx('message')}> </p>
                                        </div>
                                    </div>
                                    <div className={cx('content-infor', 'content-howtel-address', 'mt-6')}>
                                        <input
                                            type='text'
                                            name='DiaChi'
                                            id='address'
                                            placeholder='Nhập vào địa chỉ liên hệ'
                                            className={cx('content-item-input')}
                                            // value={formik.values.DiaChi}
                                            value='Thị trấn pháo hoa - vườn xuân - Bầu trời'
                                            onChange={formik.handleChange}
                                        />
                                        {formik.errors.DiaChi && formik.touched.DiaChi ? (
                                            <p className={cx('message')}>{formik.errors.DiaChi}</p>
                                        ) : (
                                            <p className={cx('message')}> </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* quá trình học tập */}
                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'ml-2 uppercase')}>
                                Quá trình học tập
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>

                        {/* thành phố */}
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item')}>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='thpt/thanhphp' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Thành phố / Tỉnh
                                    </label>
                                    <select
                                        id='thpt/thanhpho'
                                        className={cx('content-item-input')}
                                        onChange={(e) => {
                                            setMaTinhTHPT(e.target.value);
                                            setTruongTHPT(null);
                                            setMaHuyenTHPT('');
                                        }}
                                    >
                                        <option
                                            value=''
                                            selected={maTinhTHPT === ''}
                                        >
                                            Chọn Tỉnh / Thành Phố
                                        </option>
                                        {
                                            citysOfSchool.map(city => {
                                                return (
                                                    <option value={city?.maTinh}>
                                                        {city?.tenTinhTP}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='thpt/huyen' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Quận / Huyện
                                    </label>
                                    <select
                                        id='thpt/huyen'
                                        className={cx('content-item-input')}
                                        onChange={(e) => {
                                            setTruongTHPT(null)
                                            setMaHuyenTHPT(e.target.value)
                                        }}
                                    >
                                        <option value='' selected={MaHuyenTHPT === ''}>
                                            Chọn Quận / Huyện
                                        </option>
                                        {districtsOfSchool.map((district) => {
                                            return (
                                                <option value={district?.maQH}>
                                                    {district?.tenQH}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='Truong' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Trường THPT
                                    </label>
                                    <select
                                        name='Truong'
                                        id='Truong'
                                        className={cx('content-item-input')}
                                        onChange={(e) => {
                                            let value = JSON.parse(e.target.value);
                                            setTruongTHPT(value);
                                        }}
                                    >
                                        <option value={JSON.stringify(null)} selected={!TruongTHPT}>
                                            Chọn trường THPT
                                        </option>
                                        {schoolList.map((school) => {
                                            return (
                                                <option
                                                    key={school.maTruong}
                                                    value={JSON.stringify({
                                                        ma: school.maTruong,
                                                        name: school.tenTruong,
                                                        khuVucUT: school.khuVuc,
                                                    })}
                                                    selected={TruongTHPT?.name === school.tenTruong}
                                                >
                                                    {school.tenTruong}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='DoiTuongUT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}> </span>
                                        Đối tượng ưu tiên
                                    </label>
                                    <select
                                        name='DoiTuongUT'
                                        id='DoiTuongUT'
                                        className={cx('content-item-input')}
                                        onChange={formik.handleChange}
                                    >
                                        <option value="" selected={formik.values.DoiTuongUT === ''}>
                                            Không thuộc diện ưu tiên
                                        </option>
                                        <option value="01" selected={formik.values.DoiTuongUT === '01'}>
                                            01
                                        </option>
                                        <option value="02" selected={formik.values.DoiTuongUT === '02'}>
                                            02
                                        </option>
                                        <option value="03" selected={formik.values.DoiTuongUT === '03'}>
                                            03
                                        </option>
                                        <option value="04" selected={formik.values.DoiTuongUT === '04'}>
                                            04
                                        </option>
                                        <option value="05" selected={formik.values.DoiTuongUT === '05'}>
                                            05
                                        </option>
                                        <option value="06" selected={formik.values.DoiTuongUT === '06'}>
                                            06
                                        </option>
                                        <option value="07" selected={formik.values.DoiTuongUT === '07'}>
                                            07
                                        </option>
                                    </select>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='KhuVucUT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Khu vực ưu tiên
                                    </label>
                                    <p id="KhuVucUT" className={cx('content-item-input', 'disable')}>
                                        {TruongTHPT ? TruongTHPT.khuVucUT : 'Vui lòng chọn trường'}
                                    </p>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='NamTotNghiep' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Năm tốt nghiệp
                                    </label>
                                    <select name='NamTotNghiep' id='NamTotNghiep' className={cx('content-item-input')}>
                                        {
                                            handleShowNamTotNghiep()
                                        }
                                    </select>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                            <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                                <div className={cx('content-infor', 'content-hinhthuc')}>
                                    <label htmlFor='HinhThuc' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Phương án xét tuyển
                                    </label>
                                    <div className={cx('content-infor', 'content--address', 'mt-6')}>
                                        <select
                                            name='HinhThuc'
                                            id='HinhThuc'
                                            className={cx('content-item-input')}
                                            value={formik.values.HinhThuc}
                                            onChange={formik.handleChange}>
                                            <option value=''>Xét tuyển bằng học bạ THPT</option>
                                        </select>
                                        <p className={cx('message')}></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* kết quả học tập */}
                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'ml-2 uppercase')}>
                                Kết quả học tập THPT
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item', 'content-full')}>
                                <div className={cx('content-scores')}>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label htmlFor='DiemMon1' className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Môn thứ 1 (Toán):
                                            </label>
                                            <input
                                                id='DiemMon1'
                                                name='DiemMon1'
                                                className={cx('content-item-input')}
                                                placeholder='0.0'
                                                value={formik.values.DiemMon1}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.DiemMon1 && formik.touched.DiemMon1 ? (
                                            <p className={cx('message')}>{formik.errors.DiemMon1}</p>
                                        ) : (
                                            <p className={cx('message')}></p>
                                        )}
                                    </div>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label htmlFor='DiemMon2' className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Môn thứ 2 (Văn):
                                            </label>
                                            <input
                                                id='DiemMon2'
                                                name='DiemMon2'
                                                className={cx('content-item-input')}
                                                placeholder='0.0'
                                                value={formik.values.DiemMon2}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.DiemMon2 && formik.touched.DiemMon2 ? (
                                            <p className={cx('message')}>{formik.errors.DiemMon2}</p>
                                        ) : (
                                            <p className={cx('message')}></p>
                                        )}
                                    </div>
                                </div>
                                <div className={cx('content-scores')}>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Môn thứ 3:
                                            </label>
                                            <input
                                                className={cx('content-item-input')}
                                                placeholder='0.0'
                                                value='7.0'
                                                name='DiemMon3'
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <p className={cx('message')}></p>
                                    </div>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Điểm trung bình:
                                            </label>
                                            <p className={cx('content-item-input')}>6.67</p>
                                        </div>
                                        <p className={cx('message')}></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ngành xét tuyển */}
                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'mx-2 uppercase')}>Ngành xét tuyển</h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item', 'content-full')}>
                                <div className={cx('content-Fieldofstudy')}>
                                    <div className={cx('content-infor', 'content-Fieldofstudy-item')}>
                                        <label htmlFor='nganh' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Ngành xét tuyển
                                        </label>
                                        <select
                                            id='nganh'
                                            name='MaNganh'
                                            className={cx('content-item-input')}
                                            placeholder='Tùy chọn ngành xét tuyển'
                                            onChange={formik.handleChange}>
                                            <option value=''>Tùy chọn ngành xét tuyển</option>
                                            <option value='' selected>
                                                Công nghệ thông tin
                                            </option>
                                        </select>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* danh sách minh chứng kèm theo */}
                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'mx-2 uppercase')}>
                                Danh sách minh chứng kèm theo
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <table className={cx('content-infor', 'content-images')}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên giấy tờ</th>
                                        <th>File đính kèm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={cx('content-images-col-1')}>1</td>
                                        <td className={cx('content-images-col-2', 'text-left px-3')}>
                                            Ảnh chụp học bạ trang có điểm tổng kết môn học năm lớp 12
                                        </td>
                                        <td>
                                            <div className={cx('content-images-group')}>
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    <Image
                                                        src='/'
                                                        className={cx('content-images-item', 'empty')}
                                                        alt='ảnh học bạ'
                                                    />
                                                </div>
                                                <label htmlFor='BangKQ12' className={cx('content-btn', 'btn-upload')}>
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='BangKQ12'
                                                    id='BangKQ12'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                    multiple
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('content-images-col-1')}>2</td>
                                        <td className={cx('content-images-col-2', 'text-left px-3')}>
                                            Ảnh chụp bìa học bạ
                                        </td>
                                        <td>
                                            <div className={cx('content-images-group')}>
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    <Image
                                                        src='/'
                                                        className={cx('content-images-item', 'empty')}
                                                        alt='ảnh bìa học bạ'
                                                    />
                                                </div>
                                                <label htmlFor='HocBaBia' className={cx('content-btn', 'btn-upload')}>
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='HocBaBia'
                                                    id='HocBaBia'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('content-images-col-1')}>3</td>
                                        <td className={cx('content-images-col-2', 'text-left px-3')}>
                                            Ảnh chụp bằng tốt nghiệp
                                        </td>
                                        <td>
                                            <div className={cx('content-images-group')}>
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    <Image
                                                        src='/'
                                                        className={cx('content-images-item', 'empty')}
                                                        alt='ảnh bằng tốt nghiệp'
                                                    />
                                                </div>
                                                <label
                                                    htmlFor='ChungNhanTN'
                                                    className={cx('content-btn', 'btn-upload')}>
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='ChungNhanTN'
                                                    id='ChungNhanTN'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('content-images-col-1')}>4</td>
                                        <td className={cx('content-images-col-2', 'text-left px-3')}>
                                            Ảnh chụp giấy chứng nhận ưu tiên (nếu có)
                                        </td>
                                        <td>
                                            <div className={cx('content-images-group')}>
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    <Image
                                                        src='/'
                                                        className={cx('content-images-item', 'empty')}
                                                        alt='Ảnh chứng nhận ưu tiên'
                                                    />
                                                </div>
                                                <label
                                                    htmlFor='ChungNhanUT'
                                                    className={cx('content-btn', 'btn-upload')}>
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='ChungNhanUT'
                                                    id='ChungNhanUT'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* button quay lại và lưu */}
                    <div className={cx('content-container', 'content-group-button')}>
                        <Button className={cx('btn-back')} outline onClick={handleCloseForm}>
                            Quay lại
                        </Button>
                        <input type='submit' className={cx('btn-submit')} value='Lưu' />
                    </div>
                </form>
            </main>

            {/* modal exit */}
            <ModalAlert
                message='Bạn có chắc chắn muốn thoát không ?'
                enabled={exit}
                onClose={() => {
                    setExit(false);
                }}
                onAccepted={() => {
                    setExit(false);
                    onCloseForm();
                }}
            />
        </div>
    );
}

export default memo(FormEditAdmissionProfile);
