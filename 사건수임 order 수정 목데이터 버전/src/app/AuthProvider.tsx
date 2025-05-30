"use client";

import React, {
  ChangeEvent,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input, Loading } from "@components";
import { useFlutterBridgeFunc } from "@hooks";
import { authAtom } from "@stores";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

type TAuth = {
  membNo: string;
  membNm: string;
  reptMembNo: string;
  reptMembNm: string;
  bizNo: string;
  officeNm: string;
  profileImgPath: string;
  accessToken: string;
  refreshToken: string;
  permCd: string;
  dvceUnqNum: string;
};

function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authInfo, saveAuthInfo] = useAtom(authAtom);
  const [membNo, setMembNo] = useState("");
  const [editMembNo, setEditMembNo] = useState("");
  const [pinNo, setPinNo] = useState("");
  const [isError, setIsError] = useState(false);
  const [updateComponent, setUpdateComponent] = useState(false);
  const { nextjsFunc, value } = useFlutterBridgeFunc();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["log-in"],
    queryFn: (): Promise<TAuth> =>
      fetch(
        // `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login?membNo=${membNo}&pwd=282011&fcmId=ZdadV1234GYH%26%25%24%23%24Ssdfgsdfgsd%21%24%24444423444&dvceUnqNum=System&method=PIN`,
        // `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login?membNo=${membNo}&pwd=123456&fcmId=ZdadV1234GYH%26%25%24%23%24Ssdfgsdfgsd%21%24%24444423444&dvceUnqNum=System&method=PIN`,
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login?membNo=${
          membNo === "" ? editMembNo : membNo
        }&pwd=${pinNo}&fcmId=ZdadV1234GYH%26%25%24%23%24Ssdfgsdfgsd%21%24%24444423444&dvceUnqNum=System&method=BIO`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => res.data),
    enabled: false,
  });

  useEffect(() => {
    if (!!value.data && value.mode === "LOGIN") {
      saveAuthInfo(value.data as any);
      sessionStorage.setItem("flutter", `${value.mode} ${value.data}`);
    }
    if (!!data) {
      saveAuthInfo({
        ...data,
        isRept: data.permCd === "00" || data.permCd === "01",
      });
    }
  }, [value, data]);

  useEffect(() => {
    window.nextjsFunc = nextjsFunc;
    setUpdateComponent(!updateComponent);

    /iPhone/i.test(navigator?.userAgent)
      ? sessionStorage.setItem("isIos", "true")
      : sessionStorage.setItem("isIos", "");
  }, []);

  useEffect(() => {
    pathSpy();
  }, [pathname]);

  const pathSpy = () => {
    const storage = globalThis?.sessionStorage;
    const prevPath = storage.getItem("currentPath");

    if (!storage) {
      return;
    }

    storage.setItem("prevPath", prevPath!);
    storage.setItem("currentPath", globalThis?.location.pathname);
  };

  const mode = value.mode ?? "nothing";
  const flutterData = JSON.stringify(value.data);

  const authData =
    typeof window !== "undefined" && sessionStorage.getItem("auth");

  if (authInfo.bizNo && authInfo.bizNo !== "") {
    return <>{children}</>;
  }

  // 웹뷰 페이지일 경우 로그인 페이지 X
  if (
    pathname.includes("/view/cover") ||
    pathname.includes("/view/agreement") ||
    pathname.includes("/view/searchestm") ||
    pathname.includes("/view/searchcntr") ||
    pathname.includes("/view/link") ||
    pathname.includes("/view/pdf-viewer") ||
    pathname.includes("/terms/privacy") ||
    pathname.includes("/account/delete")
  ) {
    return <>{children}</>;
  }

  let isApp;

  if (typeof window !== "undefined") {
    if (/Android|iPhone/i.test(navigator?.userAgent)) {
      isApp = true;
    }
  }

  if (!authData && authData === null && updateComponent) {
    return (
      <Suspense fallback={<Loading />}>
        <div
          className={`${
            isApp ? "hidden" : "flex"
          } w-full h-full flex-col justify-center items-center px-4`}
        >
          <span className="w-full text-kos-orange-500">
            ※ 하단 목록에서 회원을 선택해 주세요 ※
          </span>
          <select
            className="w-full mb-2 p-4 bg-pink-50 border boder-2 border-b-kos-gray-200 rounded-xl"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setMembNo(e.currentTarget.value);
              setIsError(false);
            }}
          >
            <optgroup>
              <option value="202504240019">법무사사무소율림</option>
              <option value="202504240013">법률사무소율헌</option>
              <option value="202504240012">문권점법무사사무소</option>
              <option value="202504240009">법률사무소백야</option>
              <option value="202504240010">법무사 전영근사무소</option>
              <option value="202504240011">법무사 김탁민 사무소</option>
              <option value="202505250004">법무법인유스트인천</option>
              <option value="202505260005">전수진법무사사무소</option>
              <option value="202504180002">법무사박동수사무소</option>
              <option value="202505250003">김용호법무사사무소</option>
              <option value="202505260001">김철영법무사</option>
              <option value="202505250005">법무법인 창</option>
              <option value="202505260012">법무사권병희사무소</option>
              {/* <option value="202505260012">법무사김동옥사무소</option> */}
            </optgroup>
            <optgroup>
              <option value="202309120001">
                202309120001✋🏼홍길동17 (대표, 승리)
              </option>
              <option value="202501100001">202501100001✋🏼송원</option>
              <option value="202503130001">202503130001✋🏼홍다인</option>
              <option value="202501220001">202501220001✋🏼송만물</option>
              <option value="202411220001">202411220001✋🏼홍금보</option>
              <option value="202303190008">202303190008✋🏼홍금빛</option>
              <option value="202303190007">2202303190007✋🏼홍금자</option>
              <option value="202501020002">202501020002✋🏼정가은</option>
              <option value="202410080001">202410080001✋🏼GUEST</option>
              <option value="202404290001">202404290001✋🏼 테스트(대표)</option>
              <option value="202404290002">202404290002✋🏼 테스트(소속)</option>
              <option value="202407180001">202407180001✋🏼 이상협</option>
            </optgroup>
            <optgroup>
              <option value="202410290001">김주현(백야)</option>
              <option value="202501100001">송원섭(율헌)</option>
              <option value="202412230007">송원섭5(룰루)</option>
            </optgroup>
          </select>
          {/* 2025.05.26 상단 select에 없는 회원 정보로 로그인해야 할 때 직접 입력해서 들어가도록 inputfield 추가*/}
          {/* 
              # pinNo | editMembNo | membNo 초기값 ""
              1. select에서 회원번호 선택 없이 로그인버튼 누르면 회원번호란 에러표시 및 로그인 X
              2. pinNo 입력안하면 자동으로 147852 set
              3. refetch 시 입력정보 초기화
          */}
          <div className={`w-full h-1 mt-4 mb-56`}>
            <span className="w-full mb-2 text-kos-blue-300">
              상단 목록 회원이 아닌 경우 아래에 정보를 입력해 주세요
            </span>
            <div className="w-full mt-2 mb-4">
              <Input.Label htmlFor="">회원번호</Input.Label>
              <Input.InputField
                value={editMembNo ?? ""}
                placeholder="회원번호 입력"
                thousandSeparator={false}
                leadingZero={true}
                maxLength={20}
                styleType={isError ? "error" : "default"}
                onChange={(e) => {
                  setIsError(false);
                  setEditMembNo(e.target.value.replace(/[^\d]/g, ""));
                }}
              />
              <span
                className={`${isError ? "block" : "hidden"} text-kos-red-500`}
              >
                회원번호를 입력해주세요.
              </span>
            </div>
            <div className="w-full">
              <Input.Label htmlFor="">PIN 번호</Input.Label>
              <Input.InputField
                value={pinNo ?? ""}
                placeholder="PIN 번호 입력"
                thousandSeparator={false}
                leadingZero={true}
                maxLength={20}
                // styleType={isError ? "error" : "default"}
                onChange={(e) => {
                  setPinNo(e.target.value.replace(/[^\d]/g, ""));
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (membNo === "" && editMembNo === "") {
                setIsError(true);
                return;
              }
              // pinNo 없으면 자동으로 147852 set
              if (pinNo === "") {
                setPinNo("147852");
              }
              refetch();
              // refetch 이후 입력값 전부 초기화
              setPinNo("");
              setMembNo("");
              setEditMembNo("");
              setIsError(false);
            }}
            style={{ lineBreak: "anywhere" }}
            className="bg-kos-orange-500 rounded-2xl text-kos-white px-6 py-3 w-full"
          >
            LOG IN 😶‍🌫️ {mode}
            {/* <br />✨{flutterData} */}
          </button>
        </div>
      </Suspense>
    );
  }
  //  if(process.env.NEXT_PUBLIC_APP_MODE){
  //   if (!authData && authData === null && updateComponent) {
  //     return (
  //       <Suspense fallback={<Loading />}>
  //         <div className="w-full h-full flex flex-col justify-center items-center px-4">
  //           <select
  //             className="w-full mb-2 p-4 bg-pink-50 border boder-2 border-b-kos-gray-200 rounded-xl"
  //             onChange={(e: ChangeEvent<HTMLSelectElement>) => {
  //               setMembNo(e.currentTarget.value);
  //             }}
  //           >
  //             <option value="202309120001">
  //               202309120001✋🏼홍길동17 (대표, 승리)
  //             </option>
  //             <option value="202309120002">
  //               202309120002✋🏼홍육동 (소속,승리)
  //             </option>
  //             <option value="202309120003">
  //               202309120003✋🏼홍삼동 (소속,승리)
  //             </option>
  //             <option value="202309260001">
  //               202309260001✋🏼홍이동 (소속,승리)
  //             </option>
  //             <option value="202312050001">
  //               202312050001✋🏼노진구 (대표, 타이거)
  //             </option>
  //             <option value="202311200002">
  //               202311200002✋🏼최이슬 (소속, 타이거)
  //             </option>
  //             <option value="202401310001">
  //               202401310001✋🏼원준패밀리 (X프론트 테스트용X)
  //             </option>
  //             <option value="202402190002">
  //               202402190002✋🏼원준패밀리 (X관리운영X)
  //             </option>
  //                  <option value="202402190001">
  //             202402190001✋🏼원준패밀리 (X일반X)
  //             </option>
  //             <option value="202404040001">202401310001✋🏼 기획팀</option>
  //             <option value="202404290001">202404290001✋🏼 테스트(대표)</option>
  //             <option value="202404290002">202404290002✋🏼 테스트(소속)</option>
  //           </select>
  //           <button
  //             onClick={() => {
  //               refetch();
  //             }}
  //             style={{ lineBreak: "anywhere" }}
  //             className="bg-kos-orange-500 rounded-2xl text-white px-6 py-3 w-full"
  //           >
  //             😶‍🌫️ {mode}
  //             <br />✨{flutterData}
  //           </button>
  //         </div>
  //       </Suspense>
  //     );
  //   }
  //  }

  if (isLoading) {
    // 로딩이 끝난 후에는 아무것도 렌더링하지 않음
    return <Loading />;
  }

  return null;
}

export default AuthProvider;
