interface UrlParams {
  knPoint?: number[];
  [key: string]: any;
}

// 定义默认值
const defaultParams: UrlParams = {
  knPoint: [],
};

// 定义数字类型的参数键
const numberKeys: (keyof UrlParams)[] = [
  "phaseId",
  "studyType",
  "subjectId",
  "textbook",
];

// 获取url参数：支持默认值和特定属性转换
export const getUrlParams = (): UrlParams => {
  const searchParams = new URLSearchParams(window.location.search);
  const result: UrlParams = { ...defaultParams };

  searchParams.forEach((value, key) => {
    if (key === "knPoint") {
      result.knPoint = value ? value.split(",").map(item=>Number(item)) : defaultParams.knPoint;
    } else if (key in defaultParams) {
      const typedKey = key as keyof UrlParams;
      if (numberKeys.includes(typedKey)) {
        const numValue = Number(value);
        result[key] = !isNaN(numValue) ? numValue : defaultParams[key];
      } else {
        result[key] = value || defaultParams[key];
      }
    }
  });

  return result;
};

// 允许设置为null，代表删除
type NullableUrlParams = {
  [P in keyof UrlParams]: UrlParams[P] | null;
};
export const updateUrlParams = (params: NullableUrlParams) => {
  // 作为参数同步到 url 上
  const searchParams = new URLSearchParams(window.location.search);
  const urlParams = new URLSearchParams(searchParams?.toString());

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "knPoint") {
        urlParams.set(key, (value as string[]).join(","));
      } else {
        urlParams.set(key, String(value));
      }
    } else {
      // 如果值为 undefined 或 null，删除该参数
      urlParams.delete(key);
    }
  });
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.replaceState({}, "", newUrl);
};
