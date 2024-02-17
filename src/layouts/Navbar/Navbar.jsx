import classnames from 'classnames/bind';
import {
    HomeIcon, ListIcon, CheckSquareIcon, FileMinusIcon,
    ChevronDownIcon, BarChart2Icon, PieChartIcon, LogOutIcon, BarChartIcon, FormIcon
}
    from '~/components/Icon';
import { Menu } from '~/components';
import styles from './Navbar.module.scss';
const cx = classnames.bind(styles);

const navbarMenu = {
    data: [
        {
            to: '/',
            title: 'Trang chủ',
            iconLeft: <HomeIcon />,
            className: cx('navbar-link'),
        },
        {
            to: '/hosoxettuyen',
            title: 'Hồ sơ xét tuyển',
            iconLeft: <FileMinusIcon />,
            className: cx('navbar-link'),
        },
        {
            to: '/hosotrungtuyen',
            title: 'Danh sách trúng tuyển',
            iconLeft: <CheckSquareIcon />,
            className: cx('navbar-link'),
        },
        {
            title: 'Danh mục',
            iconLeft: <ListIcon />,
            className: cx('navbar-link', 'no-state'),
            children: {
                data: [
                    {
                        to: '/statistics-by-month',
                        title: 'Thống kê, báo cáo theo tháng',
                        iconLeft: <BarChart2Icon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/statistics-by-year',
                        title: 'Thống kê, báo cáo theo năm',
                        iconLeft: <PieChartIcon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/statistics-by-majors',
                        title: 'Thống kê theo ngành học',
                        iconLeft: <BarChartIcon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/statistics-by-form',
                        title: 'Biểu mẫu',
                        iconLeft: <FormIcon />,
                        className: cx('navbar-link'),
                    }
                ]
            }
        }
    ]
}
const navbarAccount = {
    data: [
        {
            to: '/profile',
            title: 'Nguyễn Văn A',
            iconRight: <ChevronDownIcon />,
            className: cx('navbar-link'),
            children: {
                className: 'menu-account',
                data: [
                    {
                        title: 'Đăng xuất',
                        className: cx('navbar-link'),
                        iconLeft: <LogOutIcon />,
                    },
                ]
            }
        },
    ]
}


function Navbar() {
    return (
        <nav className={cx('navbar', 'flex justify-between')}>
            <Menu className={cx('navbar-list', 'flex gap-1')} data={navbarMenu.data} link />
            <Menu className={cx('navbar-account')} data={navbarAccount.data} />
        </nav>
    );
}

export default Navbar;