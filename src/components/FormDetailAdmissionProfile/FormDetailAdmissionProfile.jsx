import classnames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';

import { Button, Image } from '~/components';
import { covertStringToArray } from '~/utils';
import { XSquareCloseIcon, ToolIcon, PrinterIcon } from '~/components/Icon';
import styles from './FormDetailAdmissionProfile.module.scss';
const cx = classnames.bind(styles);

const FormDetailAdmissionProfile = ({ maHS, onClose, onShowEdit }) => {
    //Với page hồ sơ xét tuyển trang chi tiết mới có nút xét status hồ sơ;
    let paths = covertStringToArray(window.location.pathname, '/');
    let path = '/' + paths[paths.length - 1];
    const [inforProfile, setInforProfile] = useState(null);
    //Call api để lấy thông tin chi tiết của hồ sơ
    useEffect(() => {
        if (!maHS) return;
        console.log('đã call api với maHS: ' + maHS);
    }, [maHS]);

    const handleCloseForm = () => {
        onClose();
    };

    const handleShowFormEditInfor = (e) => {
        e.preventDefault();
        onShowEdit(maHS);
        handleCloseForm();
    };
    return (
        <div className={cx('detail-admission')}>
            <div className={cx('title')}>
                <h4 className={cx('title-text', 'uppercase text-center py-5')}>Thông tin thí sinh</h4>
                <span className={cx('close')} onClick={handleCloseForm}>
                    <XSquareCloseIcon />
                </span>
            </div>
            <main className={cx('content')}>
                <div className={cx('content-item')}>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item')}>
                            <div className={cx('content-name')}>
                                <div className={cx('content-infor', 'content-firstName')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Họ đệm
                                    </label>
                                    <p className={cx('content-item-input')}>Nguyễn Văn</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-lastName')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Tên
                                    </label>
                                    <p className={cx('content-item-input')}>Khiêm</p>

                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-birthday')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Ngày sinh
                                </label>
                                <p className={cx('content-item-input')}>26/07/2015</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-gioiTinhAndDanToc')}>
                                <div className={cx('content-infor', 'content-grender')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Giới tính
                                    </label>
                                    <p className={cx('content-item-input')}>Nam</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-dantoc')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Dân tộc
                                    </label>
                                    <p className={cx('content-item-input')}>Kinh</p>
                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-CCCD')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Nhập vào CMND/CCCD
                                </label>
                                <p className={cx('content-item-input')}>82834823482348</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-email')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Email
                                </label>
                                <p className={cx('content-item-input')}>khiem124@gmail.com</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-phone')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Số điện thoại
                                </label>
                                <p className={cx('content-item-input')}>0987652732</p>
                                <p className={cx('message')}> </p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hometown')}>
                                <label htmlFor="Tinh" className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Hộ khẩu thường trú
                                </label>
                                <div className={cx('content-full-item')}>
                                    <div className={cx('content-howtel-tinh')}>
                                        <p className={cx('content-item-input')}>Hà Nội</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                    <div className={cx('content-howtel-huyen')}>
                                        <p className={cx('content-item-input')}>Phúc Thọ</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                    <div className={cx('content-howtel-xa')}>
                                        <p className={cx('content-item-input')}>Thị trấn Phúc Thọ</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                </div>
                                <div className={cx('content-infor', 'content-howtel-address', 'mt-6')}>
                                    <p className={cx('content-item-input')}>Thị trấn Phúc Thọ - Phúc Thọ - Hà Nội</p>
                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'ml-2 uppercase')}>Quá trình học tập</h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item')}>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Thành phố / Tỉnh
                                </label>
                                <p className={cx('content-item-input')}>Hà Nội</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Quận / Huyện
                                </label>
                                <p className={cx('content-item-input')}>Sơn Tây</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Trường THPT
                                </label>
                                <p className={cx('content-item-input')}>THPT Sơn Tây</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}> </span>
                                    Đối tượng ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>Trống</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Khu vực ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>Trống</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Năm tốt nghiệp
                                </label>
                                <p className={cx('content-item-input')}>2021</p>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hinhthuc')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Phương án xét tuyển
                                </label>
                                <div className={cx('content-infor', 'content--address', 'mt-6')}>
                                    <p className={cx('content-item-input')}>Xét tuyển học bạ THPT</p>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'ml-2 uppercase')}>Kết quả học tập THPT</h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item', 'content-full')}>
                            <div className={cx('content-scores')}>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Môn thứ 1 (Toán):
                                        </label>
                                        <p className={cx('content-item-input')}>8.0</p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Môn thứ 2 (Văn):
                                        </label>
                                        <p className={cx('content-item-input')}>5.0</p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                            <div className={cx('content-scores')}>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Môn thứ 3:
                                        </label>
                                        <p className={cx('content-item-input')}>7.0</p>
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
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Ngành xét tuyển
                                    </label>
                                    <p className={cx('content-item-input')}>Công nghệ thông tin</p>
                                </div>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'mx-2 uppercase')}>Danh sách minh chứng kèm theo</h4>
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
                                            <Image src="/" className={cx('content-images-item', 'empty')} alt="img-1" />
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
                                            <Image src="/" className={cx('content-images-item', 'empty')} alt="img-2" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cx('content-images-col-1')}>3</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3', 'empty')}>
                                        Ảnh chụp bằng tốt nghiệp
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>
                                            <Image src="/" className={cx('content-images-item', 'empty')} alt="img-3" />
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
                                            <Image src="/" className={cx('content-images-item', 'empty')} alt="img-4" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className={cx('content-container', 'content-group-button', {
                        'justify-around': path === '/hosoxettuyen',
                    })}
                >
                    <div
                        className={cx({
                            'flex-1': path === '/hosotrungtuyen',
                        })}
                    >
                        <Button className={cx('btn-item', 'btn-undo')} onClick={handleCloseForm} outline>
                            Quay lại
                        </Button>
                    </div>
                    <Button
                        className={cx('btn-item', 'btn-update')}
                        iconLeft={<ToolIcon width="16" height="16" />}
                        onClick={handleShowFormEditInfor}
                    >
                        Sửa
                    </Button>
                    <Button className={cx('btn-item', 'btn-print')} iconLeft={<PrinterIcon width="16" height="16" />}>
                        In
                    </Button>
                    {path === '/hosoxettuyen' && (
                        <>
                            <Button className={cx('btn-item', 'btn-failed')}>Không đạt</Button>
                            <Button className={cx('btn-item', 'btn-success')} primary>
                                Đạt
                            </Button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default memo(FormDetailAdmissionProfile);
