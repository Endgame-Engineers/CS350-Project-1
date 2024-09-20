import axios, { AxiosError } from 'axios';
export interface FoodItem {
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  calories_per_serv: number;
  image: string;
}

export interface ErrorMessage {
  message: string;
  type: string;
}

export interface SearchResult {
  products: FoodItem[];
  page: number;
  page_count: number;
}

export async function barcodeLookup(query: string): Promise<FoodItem | ErrorMessage> {
  try {
    const response = await axios.get<FoodItem>(`/api/food-items/${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      return { message: 'Barcode does not exist', type: 'not_found' };
    }
    return { message: 'Unknown error', type: 'unknown' };
  }
}

export async function searchForProducts(searchTerm: string, page = 1): Promise<SearchResult | null> {
  try {
    const resp = await axios.get<SearchResult>(
      `/api/food-items/search/${encodeURIComponent(searchTerm)}?page=${page}`
    );

    if (resp.status !== 200) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = resp.data;
    return data;
  } catch (error) {
    console.error('Error fetching the API:', error);
    return null;
  }
}

