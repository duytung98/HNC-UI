import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Page500.module.scss';
const cx = classnames.bind(styles);

function Page500() {
    return (
        <div className={cx('container')}>
            <h1 className={cx('container-title')}>500</h1>
            <p className={cx('container-message')}>Oops! Server đang xảy ra sự cố.</p>
            <Link to='/' className={cx('container-link')}>Go back home</Link>
        </div>
    );
}

export default Page500;