
const BASE_URL = "https://provinces.open-api.vn/api/v2";

export interface Province {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
}

export interface Ward {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
}

async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu địa chỉ (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export const addressApi = {
  getProvinces: (signal?: AbortSignal) =>
    fetchData<Province[]>(`${BASE_URL}/p/`, signal),

  getWards: (provinceCode: number, signal?: AbortSignal) =>
    fetchData<Ward[]>(`${BASE_URL}/w/?province=${provinceCode}`, signal),
};
