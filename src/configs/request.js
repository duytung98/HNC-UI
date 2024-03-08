const request = {
  apiUrlBaseYHN: process.env.REACT_APP_BASE_URL_API_YHN,
  apiNationYNH: '/dan-toc-ton-giao/dan-toc',
  apiCityYHN: '/don-vi-hanh-chinh/tinh',
  apiDistrictYHN: '/don-vi-hanh-chinh/quan-huyen/maTinh/',
  apiCommuneYHN: '/don-vi-hanh-chinh/xa-phuong/ma-quan-huyen/',
  apiCitySchoolYHN: '/truong-thpt/tinh-tp',
  apiDistrictSchoolYHN: '/truong-thpt/quan-huyen/tinh-tp/',
  apiUrlBaseHNC: process.env.REACT_APP_BASE_URL_API_HNC,
  apiLoginCanBoTS: '/canbo/login/',
  apiLogoutCanBoTS: '/canbo/logout/',
  apiRefreshToken: '/canbo/refresh',
  apiAdmissionList: '/ho-so/xet-tuyen/',
  apiDeleteProfile: '/ho-so/xet-tuyen/',
  apiUpdateProfile: '/ho-so/xet-tuyen/',
  apiAdmissionAcceptedList: '/ho-so/trung-tuyen/',
  apiUpdateStateAdmission: '/ho-so/update-trang-thai/',
  apiMajors: '/nganh/',
  apiXettuyenhoso: '/xet-tuyen/ho-so/',
  apiSendMail: '/ho-so/gui-email/',
  apiTraCuuHoSo: '/tra-cuu/ho-so/?VALUES=',
  apiReportYears: '/ho-so/report-nam',
  apiReportMonth: '/ho-so/report-thang/',
  apiReportMajor: '/ho-so/report-nganh'
};

export default request;
