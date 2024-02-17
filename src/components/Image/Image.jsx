import { useState, forwardRef } from 'react';
import classNames from 'classnames/bind';
import propTypes from 'prop-types'
import images from '~/assets/images';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);
const Image = forwardRef((
    { src, alt, className, fallback: customFallback = images.noImage, ...props }, ref) => {
    const [fallback, setFallback] = useState('');

    const handleError = () => {
        setFallback(customFallback);
    };

    return (
        <img
            className={cx('wrapper', className)}
            ref={ref}
            src={fallback || src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
});

Image.propTypes = {
    src: propTypes.string.isRequired,
    alt: propTypes.string.isRequired,
    customFallback: propTypes.string
}

export default Image;