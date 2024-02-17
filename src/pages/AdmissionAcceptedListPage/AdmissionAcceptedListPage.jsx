import classnames from 'classnames/bind';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useDebounce } from '~/hooks';
import styles from './AdmissionAcceptedListPage.module.scss';
import { readDataFromFileExcel, exportDataToFileExcel } from '~/utils';
import { MailIcon, SearchIcon, DownloadIcon, ChevronDownIcon, ExcelIcon } from '~/components/Icon';
import { Button, Pagination, Table, Loading, FormDetailAdmissionProfile, FormEditAdmissionProfile } from '~/components';

const cx = classnames.bind(styles);
const functionsExportList = [];

const example_admissionAcceptedList = [
    {
        id: 1,
        profileCode: 'HS001',
        firstName: 'Nguyễn Đức',
        lastName: 'A',
        birthDay: '17/06/2011',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvana@gmail.com',
        fieldOfStudy: 'Dược',
        status: true,
    },
    {
        id: 2,
        profileCode: 'HS002',
        firstName: 'Nguyễn Trí',
        lastName: 'B',
        birthDay: '17/06/2021',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvanb@gmail.com',
        fieldOfStudy: 'Công nghệ thông tin',
        status: true,
    },
    {
        id: 3,
        profileCode: 'HS003',
        firstName: 'Nguyễn Văn',
        lastName: 'C',
        birthDay: '17/06/2012',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvanc@gmail.com',
        fieldOfStudy: 'Công nghệ ô tô',
        status: true,
    },
];
const fieldsOfTable = [
    {
        property: 'id',
        alias: 'STT',
    },
    {
        property: 'profileCode',
        alias: 'Mã Hồ sơ',
    },
    {
        property: 'firstName',
        alias: 'Họ đệm',
    },
    {
        property: 'lastName',
        alias: 'Tên',
    },
    {
        property: 'birthDay',
        alias: 'Ngày sinh',
    },
    {
        property: 'CCCD',
        alias: 'Số CMND/CCCD',
    },
    {
        property: 'phone',
        alias: 'Điện thoại',
    },
    {
        property: 'email',
        alias: 'Email',
    },
    {
        property: 'fieldOfStudy',
        alias: 'Ngành học',
    },
    {
        property: 'status',
        alias: 'Trạng Thái',
    },
];

//Danh sách ngành học
const listOfMajors = [
    {
        id: 1,
        name: 'Dược',
    },
    {
        id: 2,
        name: 'Điều dưỡng',
    },
];

function AdmissionAcceptedListPage() {
    const importDataInputRef = useRef(null);
    const formDetailProfileRef = useRef(null);
    const formEditInforProfileRef = useRef(null);

    const [admissionAcceptedList, setAdmissionAcceptedList] = useState(example_admissionAcceptedList);
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [valueSearch, setValueSearch] = useState('');
    const searchDebounce = useDebounce(valueSearch, 500); //0.5s
    const [loading, setLoading] = useState(false);
    const [currentAdmissionAcceptedList, setCurrentAdmissionAcceptedList] = useState([]);
    const [admissionAcceptedListShow, setAdmissionAcceptedListShow] = useState([]);
    const [maHS, setMaHS] = useState('');

    const [pagination, setPagination] = useState({
        totalPerPages: 0, // default 50
        currentPage: 0, //Default page to 1
        totalPages: 0, //Default 0
        totalPerInDB: 0, //Default 0
    });

    // Call api lấy danh sách hồ sơ trúng tuyển
    useEffect(() => {
        setLoading(true);
        console.log('Call api');
        setCurrentAdmissionAcceptedList(admissionAcceptedList);
        setPagination({
            totalPages: Math.ceil(admissionAcceptedList.length / 5),
            currentPage: 1,
            totalPerInDB: admissionAcceptedList.length,
            totalPerPages: 5,
        });
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Xử lý lọc các bản ghi có giá trị khớp với valueSearh và fieldOfStudy
    useEffect(() => {
        setLoading(true);
        const acceptedListFillted = admissionAcceptedList.filter((admission) => {
            if (!fieldOfStudy && !searchDebounce) {
                return true;
            }

            let fullName = admission?.firstName + ' ' + admission?.lastName;
            if (!fieldOfStudy) {
                return (
                    admission?.profileCode?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.phone?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    fullName.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.email.toLowerCase().includes(searchDebounce.trim().toLowerCase())
                );
            }

            return (
                admission?.fieldOfStudy?.toLowerCase().includes(fieldOfStudy.trim().toLowerCase()) &&
                (admission?.profileCode?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.phone?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    fullName.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.email?.toLowerCase().includes(searchDebounce.trim().toLowerCase()))
            );
        });
        setCurrentAdmissionAcceptedList(acceptedListFillted);
        setPagination((prev) => {
            return {
                ...prev,
                currentPage: 1,
                totalPages: Math.ceil(acceptedListFillted.length / prev?.totalPerPages),
            }
        })
        setLoading(false);
    }, [searchDebounce, fieldOfStudy, admissionAcceptedList]);

    //Xử lý phân trang
    useEffect(() => {
        setLoading(true);
        //Danh sách hồ sơ giới hạn trên một page
        let indexLastOfPost = pagination.currentPage * pagination.totalPerPages;
        let indexFirstOfPost = indexLastOfPost - pagination.totalPerPages;
        let data = currentAdmissionAcceptedList.slice(indexFirstOfPost, indexLastOfPost);
        setAdmissionAcceptedListShow(data);
        setLoading(false);
    }, [pagination.currentPage, pagination.totalPerPages, currentAdmissionAcceptedList]);

    //Xử lý change page khi use click vào một trang khác
    const onChangePage = (number) => {
        setPagination({
            ...pagination,
            currentPage: number,
        });
    };

    //Cập nhật state value search khi user change state
    function handleOnChangeSearch(e) {
        let text = e.target.value;
        setValueSearch(text);
    }

    //Cập nhật state value fieldOfStudy khi user change state
    function handleOnChangeFieldOfStudy(e) {
        let element = e.target;
        let value = element.getAttribute('value');
        setFieldOfStudy(value);
    }

    // xử lý import data từ file excel
    const handleImportData = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        e.target.value = null;
        await handleReadDataFile(file);
        setLoading(false);
    };

    // xử lý đọc content từ file excel
    const handleReadDataFile = async (file) => {
        try {
            const data = await readDataFromFileExcel(file);
            //Sau khi đọc thành công data gửi lên và chuyển đổi thành kiểu dữ liệu JS tiến hành upate state
            // và đồng thời gửi data lên server để lưu trữ;
            const newAdmissionAcceptedList = [...admissionAcceptedList, ...data];
            setAdmissionAcceptedList(newAdmissionAcceptedList);
            setPagination({
                totalPages: Math.ceil(newAdmissionAcceptedList.length / 5),
                currentPage: 1,
                totalPerInDB: newAdmissionAcceptedList.length,
                totalPerPages: 5,
            });
            //call api để lưu trữ data
        } catch (err) {
            console.error(err);
        }
    };

    // xử lý export data ra file excel
    const handleExportData = async (e) => {
        try {
            setLoading(true);
            await exportDataToFileExcel(admissionAcceptedList);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    //Hiển thị thông tin chi tiết hồ sơ xét tuyển
    const handleShowInforDetail = useCallback((maHS) => {
        formDetailProfileRef.current.style.display = 'block';
        setMaHS(maHS);
    }, []);

    //Đóng form hiển thị thông tin chi tiết hồ sơ xét tuyển
    const handleCloseFormInforDetail = useCallback(() => {
        formDetailProfileRef.current.scrollTop = 0;
        formDetailProfileRef.current.style.display = 'none';
    }, []);

    //Hiển thị form chỉnh sửa thông tin hồ sơ
    const handleShowFormEditInforProfile = useCallback((maHS) => {
        formEditInforProfileRef.current.style.display = 'block';
        setMaHS(maHS);
    }, []);

    //Đóng form chỉnh sửa thông tin hồ sơ;
    const handleCloseFormEditInforProfile = useCallback(() => {
        formEditInforProfileRef.current.scrollTop = 0;
        formEditInforProfileRef.current.style.display = 'none';
    }, []);

    return (
        <div className={cx('admissionAcceptedList-page')}>
            <div className={cx('admissionAcceptedList-title', 'py-3')}>
                <h2 className={cx('admissionAcceptedList-title-text', 'font-bold text-center text-2xl')}>
                    Tổng số hồ sơ đã trúng tuyển:
                    <span className={cx('admissionAcceptedList-amount', 'text-red-600')}>
                        {admissionAcceptedList.length} </span>
                    hồ sơ
                </h2>
                <p className={cx('admissionAcceptedList-title-description', 'text-center text-[18px] mt-1')}>
                    Danh sách hồ sơ đã trúng tuyển bằng học bạ THPT - Tuyển sinh năm học {new Date().getFullYear()}
                </p>
            </div>
            <div className={cx('admissionAcceptedList-function', 'flex justify-center p-5 mb-5')}>
                <div className={cx('admissionAcceptedList-function-group', 'flex')}>
                    <Button primary className={cx('function-btn')} iconLeft={<MailIcon />}>
                        Gửi Email
                    </Button>
                    <div className={cx('function-import', 'ml-2')}>
                        <Button
                            outline
                            iconLeft={<DownloadIcon />}
                            onClick={() => {
                                importDataInputRef.current.click();
                            }}
                        >
                            Import
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx"
                            name="data"
                            hidden
                            ref={importDataInputRef}
                            onChange={handleImportData}
                        />
                    </div>
                    <div className={cx('function-export')}>
                        <h4 className={cx('function-export-item', 'current')} onClick={handleExportData}>
                            <ExcelIcon className={cx('function-export-icon')} />
                            Xuất excel
                        </h4>
                        <ul className={cx('function-export-list')}>
                            {functionsExportList.length > 0 &&
                                functionsExportList.map((item, index) => {
                                    return (
                                        <li className={cx('function-export-item')} key={index}>
                                            {item?.icon}
                                            {item.title}
                                        </li>
                                    );
                                })}
                        </ul>
                        <ChevronDownIcon />
                    </div>
                </div>
                <div className={cx('admissionAcceptedList-function-search', 'flex items-center')}>
                    <button className={cx('btn-search', 'px-3 hover:bg-[#ccc] h-full')}>
                        <SearchIcon />
                    </button>
                    <input
                        name="search"
                        placeholder="Tìm kiếm ..."
                        id="search"
                        onChange={handleOnChangeSearch}
                        className={cx('input-search', 'h-full border-')}
                    />
                </div>
                <div className={cx('function-filter', 'flex items-center ml-4')}>
                    <label>Lọc theo ngành: </label>
                    <div className={cx('function-filter-select', 'justify-between')}>
                        <h4 className={cx('function-filter-select-item', 'current')}>
                            {fieldOfStudy ? fieldOfStudy : 'Chọn ngành học'}
                        </h4>
                        <ul className={cx('function-filter-select-list')}>
                            {listOfMajors.length > 0 &&
                                listOfMajors.map((item, index) => {
                                    return (
                                        <li
                                            className={cx('function-filter-select-item')}
                                            key={index}
                                            value={item.name}
                                            onClick={handleOnChangeFieldOfStudy}
                                        >
                                            {item.name}
                                        </li>
                                    );
                                })}
                            <li
                                className={cx('function-filter-select-item')}
                                value=""
                                onClick={handleOnChangeFieldOfStudy}
                            >
                                Tất cả
                            </li>
                        </ul>
                        <ChevronDownIcon />
                    </div>
                </div>
            </div>
            <div className={cx('admissionAcceptedList-content')}>
                <Table
                    className={cx('admissionAcceptedList-table')}
                    fields={fieldsOfTable}
                    data={admissionAcceptedListShow}
                    onShowInforDetail={handleShowInforDetail}
                    onShowFormEditInfor={handleShowFormEditInforProfile}
                />
            </div>
            {
                pagination?.totalPages > 1 &&
                <div className={cx('admissionAcceptedList-pagination', 'flex justify-center mt-10')}>
                    <Pagination onChangePage={onChangePage} pagination={pagination} />
                </div>
            }
            <Loading loading={loading} />
            <div className={cx('form-detail')} ref={formDetailProfileRef} id="detail">
                <FormDetailAdmissionProfile
                    onClose={handleCloseFormInforDetail}
                    maHS={maHS}
                    onShowEdit={handleShowFormEditInforProfile}
                />
            </div>
            <div className={cx('form-editInfor')} ref={formEditInforProfileRef} id="edit">
                <FormEditAdmissionProfile onCloseForm={handleCloseFormEditInforProfile} maHS={maHS} />
            </div>
        </div>
    );
}

export default AdmissionAcceptedListPage;
