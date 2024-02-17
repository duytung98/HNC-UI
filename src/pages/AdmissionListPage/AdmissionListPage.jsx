import classnames from 'classnames/bind';
import { useState, useEffect, useRef, useCallback } from 'react';

import { useDebounce } from '~/hooks';
import styles from './AdmissionListPage.module.scss';
import { readDataFromFileExcel, exportDataToFileExcel } from '~/utils';
import { PlusCircleIcon, SearchIcon, DownloadIcon, ChevronDownIcon, ExcelIcon } from '~/components/Icon';
import { Button, Pagination, Table, Loading, FormDetailAdmissionProfile, FormEditAdmissionProfile } from '~/components';

const cx = classnames.bind(styles);

const functionsExportList = [];

const example_admissionList = [
    {
        id: 1,
        profileCode: 'HS001',
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        birthDay: '17/06/2011',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvana@gmail.com',
        dateSubmit: '20/12/2023',
        status: null,
    },
    {
        id: 2,
        profileCode: 'HS002',
        firstName: 'Nguyễn Văn',
        lastName: 'Nghiêm',
        birthDay: '17/06/2021',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvanb@gmail.com',
        dateSubmit: '20/12/2023',
        status: null,
    },
    {
        id: 3,
        profileCode: 'HS003',
        firstName: 'Nguyễn Văn',
        lastName: 'Nam',
        birthDay: '17/06/2012',
        CCCD: '123dmkafanfkadsf',
        phone: '1234456778',
        email: 'nguyenvanc@gmail.com',
        dateSubmit: '20/12/2023',
        status: null,
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
        property: 'dateSubmit',
        alias: 'Ngày nộp',
    },
    {
        property: 'status',
        alias: 'Trạng thái',
    },
];

function AdmissionListPage() {
    const importDataInputRef = useRef(null);
    const formDetailProfileRef = useRef(null);
    const formEditInforProfileRef = useRef(null);

    const [admissionList, setAdmissionList] = useState(example_admissionList);
    const [loading, setLoading] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const searchDebounce = useDebounce(valueSearch, 500); //0.5s;
    const [currentAdmissionList, setCurrentAdmissionList] = useState([]);
    const [admissionListShow, setAdmissionListShow] = useState([]);
    const [maHS, setMaHS] = useState('');

    const [pagination, setPagination] = useState({
        totalPerPages: 0, // default 50
        currentPage: 0, //Default page to 1
        totalPages: 0, //Default 0
        totalPerInDB: 0, //Default 0
    });

    // Call api lấy danh sách hồ sơ xét tuyển!
    useEffect(() => {
        setLoading(true);
        //call api
        console.log('call api');
        setCurrentAdmissionList(admissionList);
        setPagination({
            totalPages: Math.ceil(admissionList.length / 5),
            currentPage: 1,
            totalPerInDB: admissionList.length,
            totalPerPages: 5,
        });
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Xử lý lọc ra các bản ghi có giá trị trùng với giá trị search
    useEffect(() => {
        setLoading(true);
        if (!searchDebounce) {
            setPagination((prev) => {
                return {
                    ...prev,
                    totalPages: Math.ceil(admissionList.length / prev?.totalPerPages),
                    currentPage: 1
                }
            })
            setCurrentAdmissionList(admissionList);
            return;
        }
        const admissionListFillted = admissionList.filter((admission) => {
            let fullName = admission?.firstName + ' ' + admission?.lastName;
            return (
                admission?.profileCode?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                admission?.phone?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                fullName?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                admission?.email?.toLowerCase().includes(searchDebounce.trim().toLowerCase())
            );
        });
        setPagination((prev) => {
            return {
                ...prev,
                totalPages: Math.ceil(admissionListFillted.length / prev?.totalPerPages),
                currentPage: 1
            }
        })
        setCurrentAdmissionList(admissionListFillted);
        setLoading(false);
    }, [searchDebounce, admissionList, setCurrentAdmissionList]);

    //Xử lý phân trang data
    useEffect(() => {
        setLoading(true);
        //Danh sách hồ sơ giới hạn trên một page
        let indexLastOfPost = pagination.currentPage * pagination.totalPerPages;
        let indexFirstOfPost = indexLastOfPost - pagination.totalPerPages;
        let admissionListLimit = currentAdmissionList.slice(indexFirstOfPost, indexLastOfPost);
        setAdmissionListShow(admissionListLimit);
        setLoading(false);
    }, [pagination?.currentPage, pagination?.totalPerPages, currentAdmissionList]);

    //Xử lý change page khi use click vào một trang khác
    const onChangePage = (number) => {
        setLoading(true);
        setPagination({
            ...pagination,
            currentPage: number,
        });
        setLoading(false);
    };

    // xử lý import data từ file excel
    const handleImportData = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        e.target.value = null;
        await handleReadDataFile(file);
        setLoading(false);
    };

    // xử lý đọc dữ liệu có trong file excel
    const handleReadDataFile = async (file) => {
        try {
            const data = await readDataFromFileExcel(file);
            //Sau khi đọc thành công data gửi lên và chuyển đổi thành kiểu dữ liệu JS tiến hành upate state
            // và đồng thời gửi data lên server để lưu trữ;
            const newAdmissionList = [...admissionList, ...data];
            setAdmissionList(newAdmissionList);
            setCurrentAdmissionList(newAdmissionList);
            setPagination({
                totalPages: Math.ceil(newAdmissionList.length / 5),
                currentPage: 1,
                totalPerInDB: newAdmissionList.length,
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
            await exportDataToFileExcel(admissionList);
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
        <div className={cx('admissionList-page')}>
            <div className={cx('admissionList-title', 'py-3')}>
                <h2 className={cx('admissionList-title-text', 'font-bold text-center text-2xl')}>
                    Tổng số hồ sơ đã xét tuyển:
                    <span className={cx('admissionList-amount', 'text-red-600')}> {admissionList.length} </span> hồ sơ
                </h2>
                <p className={cx('admissionList-title-description', 'text-center text-[18px] mt-1')}>
                    Danh sách hồ sơ đã đăng ký xét tuyển bằng học bạ THPT - Tuyển sinh năm học{' '}
                    {new Date().getFullYear()}
                </p>
            </div>
            <div className={cx('admissionList-function', 'flex justify-center p-5 mb-5')}>
                <div className={cx('admissionList-function-group', 'flex')}>
                    <Button to="/nophosoxettuyen" primary className={cx('function-btn')} iconLeft={<PlusCircleIcon />}>
                        Thêm hồ sơ
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
                <div className={cx('admissionList-function-search', 'flex items-center')}>
                    <button className={cx('btn-search', 'px-3 hover:bg-[#ccc] h-full')}>
                        <SearchIcon />
                    </button>
                    <input
                        name="search"
                        placeholder="Tìm kiếm ..."
                        id="search"
                        value={valueSearch}
                        onChange={(e) => {
                            setValueSearch(e.target.value);
                        }}
                        className={cx('input-search', 'h-full border-')}
                    />
                </div>
            </div>
            <div className={cx('addmissionList-content')}>
                <Table
                    className={cx('admissionList-table')}
                    fields={fieldsOfTable}
                    data={admissionListShow}
                    onShowInforDetail={handleShowInforDetail}
                    onShowFormEditInfor={handleShowFormEditInforProfile}
                />
            </div>
            {
                pagination?.totalPages > 1 &&
                <div className={cx('admissionList-pagination', 'flex justify-center mt-10')}>
                    <Pagination onChangePage={onChangePage} pagination={pagination} />
                </div>
            }
            <Loading loading={loading} />
            <div className={cx('form-detail')} ref={formDetailProfileRef}>
                <FormDetailAdmissionProfile
                    maHS={maHS}
                    onClose={handleCloseFormInforDetail}
                    onShowEdit={handleShowFormEditInforProfile}
                />
            </div>
            <div className={cx('form-editInfor')} ref={formEditInforProfileRef}>
                <FormEditAdmissionProfile onCloseForm={handleCloseFormEditInforProfile} maHS={maHS} />
            </div>
        </div>
    );
}

export default AdmissionListPage;
