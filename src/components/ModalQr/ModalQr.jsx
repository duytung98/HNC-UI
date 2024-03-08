import { useEffect, useRef } from "react";
import styles from "./ModalQr.module.scss";
import QRCode from "qrcode";
import { DownloadIcon } from "../Icon";

function ModalQr({ maHoSo, showModalQr, onClose }) {
  const canvasRef = useRef(null);
  const url = process.env.REACT_APP_DOMAIN + "/tracuuhoso/" + maHoSo;
  useEffect(() => {
    if (!showModalQr) {
      return null;
    }
    QRCode.toCanvas(canvasRef.current, url, { width: 300, hight: 300 });
  }, [showModalQr, url]);
  const handleClick = (e) => {
    if (e.target.id === "showModalQr") return onClose();
  };

  // hàm lưu mã QR
  const downloadQRCode = async () => {
    const link = document.createElement("a");
    //toCanvas() vẽ một QRcode lên đối tượng canvas;
    const qrDataURL = await QRCode.toDataURL(url);
    link.download = "myQRCode.png";
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.modal} id="showModalQr" onClose={handleClick}>
      <div className={styles.modal__container}>
        <div className={styles.container__close} onClick={onClose}>
          &times;
        </div>
        <div className={styles.container__title}>
          <h1 className={styles.container__title_text}>Đăng ký thành công</h1>
        </div>

        <div className={styles.container__img}>
          <canvas ref={canvasRef} className="mt-0" />
        </div>

        <div className={styles.container__text}>
          <i>Lưu ý : Lưu mã Qr về máy để kiểm tra thông tin</i>
        </div>

        <div className={styles.container__btn}>
          <DownloadIcon />
          <button
            className={styles.container__btn_file}
            onClick={downloadQRCode}
          >
            Lưu mã QR
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalQr;
