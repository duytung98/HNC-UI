import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import Viewer from "react-viewer";
import { useFormik } from "formik";
import classnames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button, ModalAlert } from "~/components";
import { formatDate } from "~/utils";
import logoImage from "~/assets/images/logo.png";
import { ArrowUp, UploadIcon } from "~/components/Icon";
import styles from "./ApplyForAdmissionPage.module.scss";

import {
  getNationListService,
  getCityListService,
  getMajorListService,
  getDistrictListService,
  getCommunelistService,
  getCityListOfSchoolService,
  getDistrictListOfSchoolService,
  getSchoollistService,
  registerProfile,
} from "~/services";
import { createRoot } from "react-dom/client";
import ToastMessgerSignUp from "~/components/ToastMessgerSignUp/ToastMessgerSignUp";
import ModalQr from "~/components/ModalQr/ModalQr";
import { ConfigProvider, Select } from "antd";

const cx = classnames.bind(styles);

function ApplyForAdmissionPage() {
  const navigate = useNavigate();
  // toast messages
  const [showToastSignUp, setShowToastSignUp] = useState(false);
  const [showModalQr, setShowModalQr] = useState(false);
  const [nationList, setNationList] = useState([]);

  const [cityList, setCityList] = useState([]);
  const [majors, setMajors] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const [citysOfSchool, setCitysOfSchool] = useState([]);
  const [districtsOfSchool, setDistrictsOfSchool] = useState([]);
  const [communelist, setCommunelist] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [maTinhTHPT, setMaTinhTHPT] = useState("");
  const [MaHuyenTHPT, setMaHuyenTHPT] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [TruongTHPT, setTruongTHPT] = useState(null);
  const [year, setYear] = useState(null);

  const [maHoSo, setMaHoSo] = useState(null);

  // các trường lưu trữ trong state cho back end lấy file ảnh
  const [BangKQ12, setBangKQ12] = useState([]);
  const [HocBaBia, setHocBaBia] = useState(null);
  const [ChungNhanTN, setChungNhanTN] = useState(null);
  const [ChungNhanUT, setChungNhanUT] = useState(null);

  const [exit, setExit] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [drag] = useState(false);
  const [noNavbar, setNoNavbar] = useState(false);
  const [viewerImages] = useState([]);
  const [viewerIndex] = useState(0);

  // lưu trũ value ho khẩu thường trú và error

  const [maHuyen, setMaHuyen] = useState(null);
  const [maXa, setMaXa] = useState(null);
  const [maTinh, setMaTinh] = useState(null);
  const [errors, setErrors] = useState({});

  // state modal img
  const [modalImgSrc, setModalImgSrc] = useState(null);
  // lấy thẻ modal-container
  const modalContainerRef = useRef(null);

  const openModal = (imgSrc) => {
    setModalImgSrc(imgSrc);
  };

  const closeModal = () => {
    setModalImgSrc(null);
  };

  // Call api lấy danh sách dân tộc
  useEffect(() => {
    const getNationList = async () => {
      const data = await getNationListService();
      setNationList(data);
    };
    getNationList();
  }, []);

  // Call api lấy danh sách thành phố Việt Nam
  useEffect(() => {
    const getCityList = async () => {
      const data = await getCityListService();
      setCityList(data);
    };
    getCityList();
  }, []);

  useEffect(() => {
    const getMajorLis = async () => {
      const data = await getMajorListService();
      setMajors(data);
    };
    getMajorLis();
  }, []);

  // hàm lấy dữ liệu tỉnh (hộ khẩu thường trú)
  const handleCityChange = async (value) => {
    setMaTinh((prevValue) => {
      formik.setFieldValue("MaTinh", value);
      if (!value) {
        setMaHuyen(null);
        setMaXa(null);
      }
      return value;
    });

    // gọi api lấy danh sách huyện khi tỉnh/thành thay đổi
    const districtData = await getDistrictListService(value);
    setDistrictList(districtData);
  };

  // hàm lấy dữ liệu huyện (hộ khẩu thường trú)
  const handleCommuneList = async (value) => {
    setMaHuyen((prevValue) => {
      formik.setFieldValue("MaQuanHuyen", value);
      if (!value) {
        setMaXa(null);
      }
      return value;
    });
    // gọi api lấy danh sách xã khi huyện thay đổi
    const commune = await getCommunelistService(value);
    setCommunelist(commune);
  };

  // hàm lấy dữ liệu xã
  const handleCommuneChange = async (value) => {
    setMaXa((prevValue) => {
      formik.setFieldValue("MaPhuongXa", value);
      return value;
    });
  };

  const handleSubmit = async (values) => {
    const giatri = {
      ...values,
      HinhThuc: "Xét tuyển bằng học bạ THPT",
      KhuVucUT: TruongTHPT?.khuVucUT,
    };
    const formData = new FormData();
    Object.keys(giatri).forEach((key) => {
      formData.append(key, giatri[key]);
    });

    for (const image of BangKQ12) {
      formData.append("BangKQ12[]", image);
    }
    if (ChungNhanTN) {
      formData.append("ChungNhanTN", ChungNhanTN);
    }
    if (ChungNhanUT) {
      formData.append("ChungNhanUT", ChungNhanUT);
    }
    if (HocBaBia) {
      formData.append("HocBaBia", HocBaBia);
    }
    const res = await registerProfile(formData);
    if (res?.errors) {
      setShowToastSignUp(true);
      setTimeout(() => {
        setShowToastSignUp(false);
      }, 1500);

      setErrors({
        ...errors,
        NgaySinh: res?.errors?.NgayThangNamSinh,
        HocBaBia: res?.errors?.HocBaBia,
        ChungNhanTN: res?.errors?.ChungNhanTN,
        ChungNhanUT: res?.errors?.ChungNhanUT,
        BangKQ12: res?.errors?.BangKQ12,
      });
      formik.errors.CCCD = res?.errors.CCCD;
      formik.errors.Email = res?.errors.Email;
      formik.errors.SDT = res?.errors.SDT;
      formik.errors.MaTinh = res?.errors.MaTinh;
      formik.errors.MaQuanHuyen = res?.errors.MaQuanHuyen;
      formik.errors.MaPhuongXa = res?.errors.MaPhuongXa;
      formik.errors.DiaChi = res?.errors.DiaChi;
      formik.errors.MaTinhTruong = res?.errors.MaTinhTruong;
      formik.errors.MaQuanHuyenTruong = res?.errors.MaQuanHuyenTruong;
      formik.errors.TenTruong = res?.errors.TenTruong;
      formik.errors.DiemMon1 = res?.errors.DiemMon1;
      formik.errors.DiemMon2 = res?.errors.DiemMon2;
      formik.errors.DiemMon3 = res?.errors.DiemMon3;
      return;
    }
    setMaHoSo(res?.code);
    formik.resetForm();

    setYear("");
    setTruongTHPT(null);
    setBirthday("");
    setMaTinh(null);
    setMaHuyen(null);
    setMaXa(null);
    setShowModalQr(true);
    setBangKQ12([]);
    setHocBaBia(null);
    setChungNhanTN(null);
    setChungNhanUT(null);
  };
  const formik = useFormik({
    initialValues: {
      HoDem: "",
      Ten: "",
      NgayThangNamSinh: "",
      CCCD: "",
      Email: "",
      DiaChi: "",
      GioiTinh: "Nam",
      DanToc: "Kinh",
      SDT: "",
      MaTinh: "",
      MaQuanHuyen: "",
      MaPhuongXa: "",
      NamTotNghiep: "",
      DoiTuongUT: "",
      HinhThuc: "",
      Nganh_ID: "",
      MaTinhTruong: "",
      MaQuanHuyenTruong: "",
      TenTruong: "",
      DiemMon1: "",
      DiemMon2: "",
      DiemMon3: "",
    },
    validationSchema: Yup.object({
      MaTinh: Yup.string().required("Vui lòng nhập thông tin!"),
      MaQuanHuyen: Yup.string().required("Vui lòng nhập thông tin!"),
      MaPhuongXa: Yup.string().required("Vui lòng nhập thông tin!"),
      MaTinhTruong: Yup.string().required("Vui lòng nhập thông tin!"),
      MaQuanHuyenTruong: Yup.string().required("Vui lòng nhập thông tin!"),
      TenTruong: Yup.string().required("Vui lòng nhập thông tin!"),
      NamTotNghiep: Yup.string().required("Vui lòng nhập thông tin!"),
      HoDem: Yup.string().required("Vui lòng nhập thông tin!"),
      Nganh_ID: Yup.string().required("Vui lòng nhập thông tin!"),
      Ten: Yup.string().required("Vui lòng nhập thông tin!"),
      // NgaySinh: Yup.string().required('Vui lòng nhập thông tin!'), // chưa fix được
      DiaChi: Yup.string().required("Vui lòng nhập thông tin!"),
      CCCD: Yup.string().required("Vui lòng nhập thông tin!"),
      Email: Yup.string()
        .required("Vui lòng nhập thông tin!")
        .email("Email không hợp lệ")
        .max(255, "Email quá dài!"),
      SDT: Yup.string().required("Vui lòng nhập thông tin!"),
      DiemMon1: Yup.string().required("Vui lòng nhập điểm"),
      DiemMon2: Yup.string().required("Vui lòng nhập điểm"),
      DiemMon3: Yup.string().required("Vui lòng nhập điểm"),
    }),
    onSubmit: handleSubmit,
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
      setSchoolList(data);
    };
    getSchoolList();
  }, [maTinhTHPT, MaHuyenTHPT]);

  // chức năng xử lý scroll to top
  useEffect(() => {
    window.addEventListener("scroll", toggleScrollTop);
  }, []);

  // điều kiện scroll hiện
  const toggleScrollTop = () => {
    if (window.scrollY > 600) {
      setIsScrollTop(true);
    } else {
      setIsScrollTop(false);
    }
  };

  // hàm updal img
  const handleUploadImages = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const element = e.target;
    const type = element?.name;
    const files = Array.from(element.files);
    const eParent = element.parentNode;
    const eImgContainer = eParent.querySelector("#img-container");

    // kiểm tra quá số file upload
    if (files.length > 2) {
      alert("Tải quá số file quy định");
      return;
    }

    switch (type) {
      case "BangKQ12":
        setBangKQ12(files);
        break;
      case "HocBaBia":
        setHocBaBia(files[0]);
        break;
      case "ChungNhanTN":
        setChungNhanTN(files[0]);
        break;
      case "ChungNhanUT":
        setChungNhanUT(files[0]);
        break;
      default:
        console.log("Error");
    }

    const images = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const img_src = await readFile(file);

      const imgElement = (
        <img
          key={index}
          src={img_src}
          className={cx("content-images-item")}
          onClick={() => openModal(img_src)}
          alt={`img_${index}`}
        />
      );

      images.push(imgElement);
    }

    const root = createRoot(eImgContainer);
    root.render(<>{images}</>);
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    //Clean up
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  //
  const [arrYear, setArrYear] = useState([]);
  useEffect(() => {
    const tenYearLast = () => {
      const currentYear = new Date().getFullYear();
      const newArrYear = [];
      for (let i = currentYear; i >= currentYear - 9; i--) {
        newArrYear.push(i);
      }
      newArrYear.sort();
      setArrYear(newArrYear);
    };

    tenYearLast();
  }, []);

  return (
    <React.Fragment>
      <div className={cx("detail-admission")}>
        <header className={cx("header", "flex")}>
          <div className={cx("header-logo")}>
            <div className={cx("header-logo-img", "flex justify-center")}>
              <Link to="/" className={cx("header-logo-link")}>
                <img src={logoImage} alt="logo" />
              </Link>
            </div>
            <div className={cx("header-brand")}>
              <h3 className={cx("header-brand-subtitle", "text-center")}>
                BỘ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </h3>
              <h3 className={cx("header-brand-title", "text-center")}>
                TRƯỜNG CAO ĐẲNG HÀ NỘI
              </h3>
            </div>
          </div>
          <div
            className={cx("header-title", "flex items-center justify-center")}
          >
            <h2 className={cx("header-title-text", "text-center uppercase")}>
              Nộp hồ sơ trực tuyến
            </h2>
          </div>
        </header>
        <main className={cx("content")}>
          <form method="POST" onSubmit={formik.handleSubmit}>
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Thông tin thí sinh
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item")}>
                  <div className={cx("content-name")}>
                    <div className={cx("content-infor", "content-firstName")}>
                      <label
                        htmlFor="HoDem"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Họ đệm
                      </label>
                      <input
                        type="text"
                        name="HoDem"
                        id="HoDem"
                        placeholder="Nhập vào họ đệm"
                        className={cx("content-item-input")}
                        value={formik.values.HoDem}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.HoDem && formik.touched.HoDem ? (
                        <p className={cx("message")}>{formik.errors.HoDem}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                    <div className={cx("content-infor", "content-lastName")}>
                      <label htmlFor="Ten" className={cx("content-item-label")}>
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Tên
                      </label>
                      <input
                        type="text"
                        name="Ten"
                        id="Ten"
                        placeholder="Nhập vào tên"
                        className={cx("content-item-input")}
                        value={formik.values.Ten}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.Ten && formik.touched.Ten ? (
                        <p className={cx("message")}>{formik.errors.Ten}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>

                  {/* ngày sinh */}
                  <div className={cx("content-infor", "content-birthday")}>
                    <label
                      htmlFor="NgaySinh"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Ngày sinh
                    </label>
                    <DatePicker
                      selected={birthday}
                      name="NgayThangNamSinh"
                      showMonthDropdown
                      showYearDropdown
                      dateFormat="dd/MM/yyyy"
                      dropdownMode="select"
                      className={cx("content-item-input")}
                      placeholderText="dd/MM/YYYY"
                      onChange={(date) => {
                        setBirthday(date);
                        const formattedDate = formatDate(birthday);
                        let paths = formattedDate.split("/");
                        let NgayThangNamSinh =
                          paths[2] + "-" + paths[1] + "-" + paths[0];
                        formik.setFieldValue(
                          "NgayThangNamSinh",
                          NgayThangNamSinh
                        );
                      }}
                    />

                    {errors?.NgaySinh ? (
                      <p className={cx("message")}>Vui lòng nhập thông tin</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-gioiTinhAndDanToc")}>
                    <div className={cx("content-infor", "content-grender")}>
                      <label
                        htmlFor="GioiTinh"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Giới tính
                      </label>
                      <select
                        name="GioiTinh"
                        id="GioiTinh"
                        className={cx("content-item-input")}
                        onChange={formik.handleChange}
                      >
                        <option
                          value="Nam"
                          selected={formik.values.GioiTinh === "Nam"}
                        >
                          Nam
                        </option>
                        <option
                          value="Nữ"
                          selected={formik.values.GioiTinh === "Nữ"}
                        >
                          Nữ
                        </option>
                      </select>
                      <p className={cx("message")}> </p>
                    </div>

                    {/* dân tộc */}
                    <div className={cx("content-infor", "content-dantoc")}>
                      <label
                        htmlFor="DanToc"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Dân tộc
                      </label>
                      <select
                        name="DanToc"
                        id="DanToc"
                        className={cx("content-item-input")}
                        onChange={formik.handleChange}
                      >
                        {nationList.map((nation) => {
                          return (
                            <option
                              key={nation.ma}
                              value={nation.tenDanToc}
                              selected={
                                nation.tenDanToc === formik.values.DanToc
                              }
                            >
                              {nation.tenDanToc}
                            </option>
                          );
                        })}
                      </select>
                      {formik.errors.DanToc && formik.touched.DanToc ? (
                        <p className={cx("message")}>{formik.errors.DanToc}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>

                  {/* chứng minh căn cước công dân */}
                  <div className={cx("content-infor", "content-CCCD")}>
                    <label htmlFor="CCCD" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Nhập vào CMND/CCCD
                    </label>
                    <input
                      type="text"
                      name="CCCD"
                      id="CCCD"
                      placeholder="Nhập vào CMND/CCCD"
                      className={cx("content-item-input")}
                      value={formik.values.CCCD}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.CCCD && formik.touched.CCCD ? (
                      <p className={cx("message")}>{formik.errors.CCCD}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>

                  {/* email */}
                  <div className={cx("content-infor", "content-email")}>
                    <label htmlFor="Email" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Email
                    </label>
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      placeholder="Nhập vào địa chỉ email"
                      className={cx("content-item-input")}
                      value={formik.values.Email}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.Email && formik.touched.Email ? (
                      <p className={cx("message")}>{formik.errors.Email}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>

                  {/* số điện thoại */}
                  <div className={cx("content-infor", "content-phone")}>
                    <label htmlFor="SDT" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="SDT"
                      id="Email"
                      placeholder="Nhập vào số điện thoại"
                      className={cx("content-item-input")}
                      value={formik.values.SDT}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.SDT && formik.touched.SDT ? (
                      <p className={cx("message")}>{formik.errors.SDT}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                </div>

                {/* Hộ khẩu thường trú */}
                <div
                  className={cx(
                    "content-container-item",
                    "content-full",
                    "mt-6"
                  )}
                >
                  <div className={cx("content-infor", "content-hometown")}>
                    <label htmlFor="Tinh" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Hộ khẩu thường trú
                    </label>

                    {/* Tỉnh/Thành phố */}
                    <div className={cx("content-full-item")}>
                      <div className={cx("content-howtel-tinh")}>
                        <ConfigProvider
                          theme={{
                            components: {
                              Select: {
                                optionFontSize: "16px",
                                colorBorder: "#ccc",
                                optionSelectedFontWeight: "400",
                                colorTextPlaceholder: "#ff6600",
                                optionPadding: "0px 0px 0px 10px",
                                colorText: "#ff6600",
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "16px",
                                labelColor: "#ccc",
                                iconSize: "20px",
                                colorIcon: "#ff6600",
                              },
                            },
                          }}
                        >
                          <Select
                            className="custom-placeholder"
                            name="MaTinh"
                            showSearch
                            allowClear
                            style={{ width: "100%", height: "40px" }}
                            placeholder="Chọn Tỉnh / Thành phố"
                            optionFilterProp="children"
                            filterOption={(input, cityList) =>
                              (cityList.label || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            value={maTinh}
                            options={[
                              { value: null, label: "Chọn Tỉnh / Thành Phố" },
                              ...cityList.map((city) => ({
                                value: city.ma,
                                label: city.tenDonVi,
                              })),
                            ]}
                            onChange={handleCityChange}
                          />
                        </ConfigProvider>

                        {formik.errors.MaTinh && formik.touched.MaTinh ? (
                          <p className={cx("message")}>
                            {formik.errors.MaTinh}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div>

                      {/* quận / huyện */}
                      <div className={cx("content-howtel-huyen")}>
                        <ConfigProvider
                          theme={{
                            components: {
                              Select: {
                                optionFontSize: "16px",
                                colorBorder: "#ccc",
                                optionSelectedFontWeight: "400",
                                colorTextPlaceholder: "#ff6600",
                                optionPadding: "0px 0px 0px 10px",
                                colorText: "#ff6600",
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "16px",
                                labelColor: "#ccc",
                                iconSize: "20px",
                                colorIcon: "#ff6600",
                              },
                            },
                          }}
                        >
                          <Select
                            showSearch
                            allowClear
                            name="MaQuanHuyen"
                            style={{ width: "100%", height: "40px" }}
                            placeholder="Chọn Quận/Huyện"
                            optionFilterProp="children"
                            filterOption={(input, districtList) =>
                              (districtList.label || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            value={maHuyen}
                            options={[
                              { value: null, label: "Chọn Quận / Huyện" },
                              ...districtList.map((district) => ({
                                value: district.ma,
                                label: district.tenDonVi,
                              })),
                            ]}
                            onChange={handleCommuneList}
                          />
                        </ConfigProvider>
                        {formik.errors.MaQuanHuyen &&
                        formik.touched.MaQuanHuyen ? (
                          <p className={cx("message")}>
                            {formik.errors.MaQuanHuyen}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div>

                      {/* Xã */}
                      <div className={cx("content-howtel-xa")}>
                        <ConfigProvider
                          theme={{
                            components: {
                              Select: {
                                optionFontSize: "16px",
                                colorBorder: "#ccc",
                                optionSelectedFontWeight: "400",
                                colorTextPlaceholder: "#ff6600",
                                optionPadding: "0px 0px 0px 10px",
                                colorText: "#ff6600",
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "16px",
                                labelColor: "#ccc",
                                iconSize: "20px",
                                colorIcon: "#ff6600",
                              },
                            },
                          }}
                        >
                          <Select
                            showSearch
                            allowClear
                            name="MaPhuongXa"
                            style={{
                              width: "100%",
                              height: "40px",
                            }}
                            placeholder="Chọn Xã"
                            optionFilterProp="children"
                            filterOption={(input, communelist) =>
                              (communelist.label || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            value={maXa}
                            options={[
                              { value: null, label: "Chọn Xã" },
                              ...communelist.map((commune) => ({
                                value: commune.ma,
                                label: commune.tenDonVi,
                              })),
                            ]}
                            onChange={handleCommuneChange}
                          />
                        </ConfigProvider>
                        {formik.errors.MaPhuongXa &&
                        formik.touched.MaPhuongXa ? (
                          <p className={cx("message")}>
                            {formik.errors.MaPhuongXa}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div>
                    </div>

                    {/* địa chỉ liên hệ */}
                    <div
                      className={cx(
                        "content-infor",
                        "content-howtel-address",
                        "mt-6"
                      )}
                    >
                      <input
                        type="text"
                        name="DiaChi"
                        id="address"
                        placeholder="Nhập vào địa chỉ liên hệ"
                        className={cx("content-item-input")}
                        value={formik.values.DiaChi}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.DiaChi && formik.touched.DiaChi ? (
                        <p className={cx("message")}>{formik.errors.DiaChi}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Qúa trình học tập */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Quá trình học tập
                </h4>
                <span className={cx("flex-1")}></span>
              </div>

              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item")}>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="thpt/thanhphp"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Thành phố / Tỉnh
                    </label>
                    <select
                      id="thpt/thanhpho"
                      name="MaTinhTruong"
                      className={cx("content-item-input")}
                      onChange={(e) => {
                        setMaTinhTHPT(e.target.value);
                        formik.handleChange(e);
                        formik.setFieldValue("MaQuanHuyenTruong", "");
                        formik.setFieldValue("TenTruong", "");
                        setTruongTHPT(null);
                      }}
                    >
                      <option value="" selected={!formik.values.MaTinhTruong}>
                        Chọn Tỉnh / Thành Phố
                      </option>
                      {citysOfSchool.map((city) => {
                        return (
                          <option
                            key={city.maTinh}
                            value={city.maTinh}
                            selected={
                              city.maTinh === formik.values.MaTinhTruong
                            }
                          >
                            {city.tenTinhTP}
                          </option>
                        );
                      })}
                    </select>

                    {formik.errors.MaTinhTruong &&
                    formik.touched.MaTinhTruong ? (
                      <p className={cx("message")}>
                        {formik.errors.MaTinhTruong}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="thpt/huyen"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Quận / Huyện
                    </label>
                    <select
                      id="thpt/huyen"
                      name="MaQuanHuyenTruong"
                      className={cx("content-item-input")}
                      onChange={(e) => {
                        setMaHuyenTHPT(e.target.value);
                        setTruongTHPT(null);
                        formik.setFieldValue("TenTruong", "");
                        formik.handleChange(e);
                      }}
                    >
                      <option
                        value=""
                        selected={!formik.values.MaQuanHuyenTruong}
                      >
                        Chọn Quận / Huyện
                      </option>
                      {districtsOfSchool.map((district) => {
                        return (
                          <option
                            key={district.maQH}
                            value={district.maQH}
                            selected={
                              district.maQH === formik.values.MaQuanHuyenTruong
                            }
                          >
                            {district.tenQH}
                          </option>
                        );
                      })}
                    </select>

                    {formik.errors.MaQuanHuyenTruong &&
                    formik.touched.MaQuanHuyenTruong ? (
                      <p className={cx("message")}>
                        {formik.errors.MaQuanHuyenTruong}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="Truong"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Trường THPT
                    </label>
                    <select
                      name="TenTruong"
                      id="Truong"
                      className={cx("content-item-input")}
                      //value={TruongTHPT?.name}
                      onChange={(e) => {
                        let value = e.target.value
                          ? JSON.parse(e.target.value)
                          : null;
                        e.target.value
                          ? formik.setFieldValue("TenTruong", value.name)
                          : formik.setFieldValue("TenTruong", "");
                        setTruongTHPT(value);
                      }}
                    >
                      <option value="" selected={!formik.values.TenTruong}>
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
                    {formik.errors.TenTruong && formik.touched.TenTruong ? (
                      <p className={cx("message")}>{formik.errors.TenTruong}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="DoiTuongUT"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}> </span>
                      Đối tượng ưu tiên
                    </label>
                    <select
                      name="DoiTuongUT"
                      id="DoiTuongUT"
                      placeholder="Đối tượng ưu tiên"
                      className={cx("content-item-input")}
                      onChange={formik.handleChange}
                    >
                      <option value="" selected={!formik.values.DoiTuongUT}>
                        Không thuộc diện ưu tiên
                      </option>
                      <option
                        value="01"
                        selected={formik.values.DoiTuongUT === "01"}
                      >
                        01
                      </option>
                      <option
                        value="02"
                        selected={formik.values.DoiTuongUT === "02"}
                      >
                        02
                      </option>
                      <option
                        value="03"
                        selected={formik.values.DoiTuongUT === "03"}
                      >
                        03
                      </option>
                      <option
                        value="04"
                        selected={formik.values.DoiTuongUT === "04"}
                      >
                        04
                      </option>
                      <option
                        value="05"
                        selected={formik.values.DoiTuongUT === "05"}
                      >
                        05
                      </option>
                      <option
                        value="06"
                        selected={formik.values.DoiTuongUT === "06"}
                      >
                        06
                      </option>
                      <option
                        value="07"
                        selected={formik.values.DoiTuongUT === "07"}
                      >
                        07
                      </option>
                    </select>
                    {formik.errors.DoiTuongUT && formik.touched.DoiTuongUT ? (
                      <p className={cx("message")}>
                        {formik.errors.DoiTuongUT}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="KhuVucUT"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Khu vực ưu tiên
                    </label>

                    {/* <input onChange={(e)=>formik.setFieldValue('KhuVucUT',e.target.value)} name='KhuVutUT' type="text" id='KhuVucUT' className={cx('content-item-input','disable')}
                                         value={TruongTHPT?TruongTHPT.khuVucUT:'Không thuộc khu vực ưu tiên'} readOnly/> */}
                    <p
                      id="KhuVucUT"
                      className={cx("content-item-input", "disable")}
                    >
                      {TruongTHPT
                        ? TruongTHPT.khuVucUT
                        : "Vui lòng chọn trường"}
                    </p>
                    <p className={cx("message")}></p>
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="NamTotNghiep"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Năm tốt nghiệp
                    </label>
                    <select
                      name="NamTotNghiep"
                      id="NamTotNghiep"
                      className={cx("content-item-input")}
                      onChange={(e) => {
                        setYear(e.target.value);
                        formik.handleChange(e);
                      }}
                    >
                      <option value="" selected={!year}>
                        Chọn năm tốt nghiệp
                      </option>
                      {arrYear.map((getyear, index) => {
                        return (
                          <option
                            key={index}
                            value={getyear}
                            selected={getyear === year}
                          >
                            {getyear}
                          </option>
                        );
                      })}
                    </select>
                    {formik.errors.NamTotNghiep &&
                    formik.touched.NamTotNghiep ? (
                      <p className={cx("message")}>
                        {formik.errors.NamTotNghiep}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                </div>
                <div
                  className={cx(
                    "content-container-item",
                    "content-full",
                    "mt-6"
                  )}
                >
                  <div className={cx("content-infor", "content-hinhthuc")}>
                    <label
                      htmlFor="HinhThuc"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Phương án xét tuyển
                    </label>
                    <div
                      className={cx(
                        "content-infor",
                        "content--address",
                        "mt-6"
                      )}
                    >
                      <select
                        name="HinhThuc"
                        id="HinhThuc"
                        className={cx("content-item-input")}
                        value={formik.values.HinhThuc}
                        onChange={formik.handleChange}
                      >
                        <option value="">Xét tuyển bằng học bạ THPT</option>
                      </select>
                      <p className={cx("message")}></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* kết quả học tập */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Kết quả học tập THPT
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item", "content-full")}>
                  <div className={cx("content-scores")}>
                    <div className={cx("content-infor", "content-scores-item")}>
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemMon1"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Điểm môn 1 (Toán):
                        </label>
                        <input
                          id="DiemMon1"
                          name="DiemMon1"
                          className={cx("content-item-input")}
                          placeholder="0.0"
                          value={formik.values.DiemMon1}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.DiemMon1 && formik.touched.DiemMon1 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemMon1}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                    <div className={cx("content-infor", "content-scores-item")}>
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemMon2"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Điểm môn 2 (Văn):
                        </label>
                        <input
                          id="DiemMon2"
                          name="DiemMon2"
                          className={cx("content-item-input")}
                          placeholder="0.0"
                          value={formik.values.DiemMon2}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.DiemMon2 && formik.touched.DiemMon2 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemMon2}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cx("content-container-item", "content-full")}>
                  <div className={cx("content-score-option")}>
                    <div
                      className={cx(
                        "content-infor",
                        "content-score-option-item"
                      )}
                    >
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemMon3"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Môn thứ 3 (Tùy chọn)
                        </label>
                        <div className={cx("md:mt-0 sm:mt-2 sm:flex-1")}>
                          <select className={cx("content-item-input")}>
                            <option value="">Tiếng Anh</option>
                            <option value="">Sinh học</option>
                            <option value="">Hóa học</option>
                            <option value="">Vật lý</option>
                          </select>
                          <input
                            id="DiemMon3"
                            name="DiemMon3"
                            className={cx("content-item-input")}
                            placeholder="0.0"
                            value={formik.values.DiemMon3}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      {formik.errors.DiemMon3 && formik.touched.DiemMon3 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemMon3}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ngành xét tuyển */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "mx-2 uppercase")}>
                  Ngành xét tuyển
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item", "content-full")}>
                  <div className={cx("content-Fieldofstudy")}>
                    <div
                      className={cx(
                        "content-infor",
                        "content-Fieldofstudy-item"
                      )}
                    >
                      <label
                        htmlFor="nganh"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Ngành xét tuyển
                      </label>
                      <select
                        id="nganh"
                        name="Nganh_ID"
                        className={cx("content-item-input")}
                        placeholder="Tùy chọn ngành xét tuyển"
                        onChange={formik.handleChange}
                      >
                        <option value="" selected={!formik.values.Nganh_ID}>
                          Tùy chọn ngành xét tuyển
                        </option>
                        {majors.map((major) => {
                          return (
                            <option
                              key={major.MaNganh}
                              value={major.MaNganh}
                              selected={
                                formik.values.Nganh_ID === major.maNganh
                              }
                            >
                              {major.MaNganh} - {major.TenNganh}
                            </option>
                          );
                        })}
                        {formik.errors.Nganh_ID && formik.touched.Nganh_ID ? (
                          <p className={cx("message")}>
                            {formik.errors.Nganh_ID}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </select>
                    </div>
                    <p className={cx("message")}></p>
                  </div>
                </div>
              </div>
            </div>

            {/* danh sách minh chứng kèm theo */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "mx-2 uppercase")}>
                  Danh sách minh chứng kèm theo
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <p className={cx("content-note")}>
                  Chú ý: các hình ảnh minh chứng có thể bổ sung sau khi trúng
                  tuyển !
                </p>
                <table className={cx("content-infor", "content-images")}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên giấy tờ</th>
                      <th>File đính kèm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={cx("content-images-col-1")}>1</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp học bạ trang có điểm tổng kết môn học năm lớp
                        12
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="BangKQ12"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="BangKQ12"
                            id="BangKQ12"
                            accept=".jpg"
                            onChange={(e) => {
                              handleUploadImages(e);
                              setErrors({
                                ...errors,
                                BangKQ12: "",
                              });
                            }}
                            multiple
                          />
                          {errors?.BangKQ12 ? (
                            <p className={cx("message")}>{errors?.BangKQ12}</p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={cx("content-images-col-1")}>2</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp bìa học bạ
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="HocBaBia"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="HocBaBia"
                            id="HocBaBia"
                            accept=".jpg"
                            onChange={(e) => {
                              handleUploadImages(e);
                              setErrors({
                                ...errors,
                                HocBaBia: "",
                              });
                            }}
                          />

                          {errors?.HocBaBia ? (
                            <p className={cx("message")}>{errors?.HocBaBia}</p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Tương tự cho các ô nhập file khác */}
                    <tr>
                      <td className={cx("content-images-col-1")}>3</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp bằng tốt nghiệp
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="ChungNhanTN"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="ChungNhanTN"
                            id="ChungNhanTN"
                            accept=".jpg"
                            onChange={(e) => {
                              handleUploadImages(e);
                              setErrors({
                                ...errors,
                                ChungNhanTN: "",
                              });
                            }}
                          />
                          {errors?.ChungNhanTN ? (
                            <p className={cx("message")}>
                              {errors?.ChungNhanTN}
                            </p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={cx("content-images-col-1")}>4</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp giấy chứng nhận ưu tiên (nếu có)
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="ChungNhanUT"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="ChungNhanUT"
                            id="ChungNhanUT"
                            accept=".jpg"
                            onChange={(e) => {
                              handleUploadImages(e);
                              setErrors({
                                ...errors,
                                ChungNhanUT: "",
                              });
                            }}
                          />
                          {errors?.ChungNhanUT ? (
                            <p className={cx("message")}>
                              {errors?.ChungNhanUT}
                            </p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* React Viewer */}
                <Viewer
                  visible={viewerVisible}
                  onClose={() => {
                    setViewerVisible(false);
                    setNoNavbar(true);
                  }}
                  drag={drag}
                  noNavbar={noNavbar}
                  images={viewerImages}
                  activeIndex={viewerIndex}
                />

                <p className={cx("content-note")}>
                  Chú ý: Học sinh có thể sửa đổi thông tin khi nhập học (bao gồm
                  ngành xét tuyển và thông tin cá nhân).
                </p>
              </div>
            </div>

            {/* button quay lại */}
            <div className={cx("content-container", "content-group-button")}>
              <Button
                className={cx("btn-back")}
                outline
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExit(true);
                }}
              >
                Quay lại
              </Button>
              <input
                type="submit"
                className={cx("btn-submit")}
                value="Đăng ký"
              />
            </div>
          </form>
        </main>

        {/* modal exit */}
        <ModalAlert
          message="Bạn có chắc chắn muốn thoát không ?"
          enabled={exit}
          onClose={() => {
            setExit(false);
          }}
          onAccepted={() => {
            setExit(false);
            window.history.length > 0 ? navigate(-1) : navigate("/");
          }}
        />

        {/* button scroll to top */}
        {isScrollTop && (
          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="fixed right-4 bottom-[100px] bg-white shadow-lg shadow-slate-400 p-2 rounded"
          >
            <ArrowUp />
          </button>
        )}

        {/* modal zoom img */}
        {modalImgSrc && (
          <div className={cx("modal")}>
            <div ref={modalContainerRef} className={cx("modal-container")}>
              <div className={cx("modal-container-img")}>
                <img
                  className={cx("modal-img")}
                  src={modalImgSrc}
                  alt="img ảnh"
                />
              </div>
              <div className={cx("btn")}>
                <button className={cx("btn-close")} onClick={closeModal}>
                  &times;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* toast messenger */}
      {showToastSignUp && (
        <ToastMessgerSignUp
          showToast={showToastSignUp}
          onClose={() => setShowToastSignUp(false)}
        />
      )}

      {/* show modal QR */}
      {showModalQr && (
        <ModalQr
          maHoSo={maHoSo}
          showModalQr={showModalQr}
          onClose={() => {
            setShowModalQr(false);
            navigate("/");
          }}
        />
      )}
    </React.Fragment>
  );
}

export default ApplyForAdmissionPage;
