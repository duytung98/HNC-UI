import classnames from 'classnames/bind';
import Proptypes from 'prop-types';
import styles from './Loading.module.scss';

const cx = classnames.bind(styles);

function Loading({ loading = false }) {
    return (
        <div className={cx('loading', {
            'active': loading
        })}
        >
            <div className={cx('loading-item')}></div>
        </div>
    );
}

Loading.propTypes = {
    loading: Proptypes.bool.isRequired
}



export default Loading;