import React from "react";
import { QRCodeCanvas } from "qrcode.react";
type CertificateProps = {
  settings: any;
  id: string;
  listenerData: {
    firstName: string;
    lastName: string;
    surName: string;
  };
  assignedAt: Date;
  courseName: string;
  basePath: string;
};

const Certificate: React.FC<CertificateProps> = ({
  settings,
  id,
  courseName,
  listenerData,
  basePath,
}) => {
  const {
    certificateBackground,
    defaultFont,
    primaryTextColor,
    secondaryTextColor,
  } = settings;
  console.log(
    certificateBackground,
    defaultFont,
    primaryTextColor,
    secondaryTextColor
  );
  const headerImages = [
    {
      path: "http://moocs.dulaty.kz/media/certificate_template_assets/3/440px.png",
      alt: "school-logo",
      style: { width: "200px", height: "50px" },
    },
    {
      path: "http://moocs.dulaty.kz/media/certificate_template_assets/4/dologo.png",
      alt: "school-logo",
      style: { width: "70px", height: "70px" },
    },
    {
      path: "https://qrcode.tec-it.com/API/QRCode?data=http%3a%2f%2fmoocs.dulaty.kz%2fcertificates%2f878ad225e97f4ee395014bb4deed2935&backcolor=%23ffffff",
      alt: "school-logo",
      style: { width: "65px", height: "65px" },
    },
    {
      path: "http://moocs.dulaty.kz/media/certificate_template_assets/6/1212121212.png",
      alt: "school-logo",
      style: { width: "70px", height: "70px" },
    },
    {
      path: "http://moocs.dulaty.kz/media/certificate_template_assets/5/logo-fitat.png",
      alt: "school-logo",
      style: { width: "70px", height: "70px" },
    },
  ];
  const bgStyles: React.CSSProperties = {
    listStylePosition: "inside",
    top: "0px",
    position: "absolute",
    display: "list-item",
    listStyleImage:
      certificateBackground !== "" && certificateBackground
        ? `url("${certificateBackground}")`
        : 'url("/assets/certificate-background.jpg")',
    width: "1200px",
    height: "804px",
    overflow: "hidden",
    zIndex: -1,
  };
  return (
    <div
      className={"certificate relative m-auto"}
      style={{ fontFamily: defaultFont, color: primaryTextColor }}
    >
      <div
        style={bgStyles}
        className={`print:h-[804px] print:w-[1200px] `}
      ></div>
      <div
        className={`certificate-wrapper border-certificate-heading h-[804px] w-[1200px] border print:h-[804px] print:w-[1200px]`}
      >
        <header
          className={"certificate-header flex justify-between px-20 pb-5 pt-20"}
        >
          <div className={"certificate-header-section1 flex"}>
            <img
              src={headerImages[0].path}
              alt={headerImages[0].alt}
              style={headerImages[0].style}
            />
            <img
              src={headerImages[1].path}
              alt={headerImages[1].alt}
              style={headerImages[1].style}
            />
          </div>
          <div className={"certificate-header-section2 flex flex-row-reverse"}>
            <QRCodeCanvas
              value={`${basePath}/dashboard/results/${id}/pdf`}
              size={65}
            />
            <img
              src={headerImages[3].path}
              alt={headerImages[3].alt}
              style={headerImages[3].style}
            />
            <img
              src={headerImages[4].path}
              alt={headerImages[4].alt}
              style={headerImages[4].style}
            />
          </div>
        </header>
        <main
          className={
            "certificate-main text-certificate-heading flex flex-col items-center font-bold"
          }
        >
          <h1
            style={{
              fontSize: "3.75rem",
              lineHeight: "1",
              marginBottom: "2.5rem",
              color: secondaryTextColor,
            }}
          >
            CERTIFICATE
          </h1>
          <h3
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              padding: "0.25rem",
              marginBottom: "1rem",
              color: secondaryTextColor,
            }}
          >
            Осы сертификат / Настоящим сертификатом подтверждается, что
          </h3>
          <h4
            style={{
              fontSize: "3rem",
              lineHeight: "1",
              marginBottom: "3rem",
              color: secondaryTextColor,
            }}
          >
            {listenerData.firstName} {listenerData.lastName}{" "}
            {listenerData.surName}
          </h4>
          <div className={"certificate-who max-w-xl text-center text-neutral"}>
            на платформе &nbsp;
            <span style={{ color: secondaryTextColor }}>
              <b>moocs.dulaty.kz</b>
            </span>
            &nbsp; платформасында прошел (ла) онлайн обучение на тему &nbsp;
            <div>
              <span style={{ color: secondaryTextColor }}>
                <b>{courseName}</b>
              </span>
            </div>
            &nbsp;
            (https://moocs.dulaty.kz/courses/course-v1:DU+cs2022+2022_c1/about)
            тақырыбында онлайн-курсты өткенін растайды
          </div>
        </main>
        <div
          className={
            "signatures  relative m-auto flex w-full justify-between py-5 text-center"
          }
        >
          <div
            className={
              "text-certificate-heading flex w-1/2 flex-col items-center text-xs"
            }
          >
            <img
              src="http://moocs.dulaty.kz/asset-v1:DU+cs2022+2022_c1+type@asset+block@st_.png"
              alt="signature"
              className={"h-14"}
            />
            <span></span>
            <span>Қашықтықтан білім беру бөлімінің бастығы</span>
          </div>
          <div
            className={
              "text-certificate-heading flex w-1/2 flex-col items-center text-xs"
            }
          >
            <img
              src="http://moocs.dulaty.kz/asset-v1:DU+cs2022+2022_c1+type@asset+block@st_.png"
              alt="signature"
              className={"h-14"}
            />
            <span>Боранкулова Гаухар Сарсенбаевна</span>
            <span>«Ақпараттық жүйелер» кафедрасының меңгерушісі</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
