import axios from 'axios';

export interface FoodItem {
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  calories_per_serv: number;
  image: string;
}

export interface SearchResult {
  products: FoodItem[];
  page: number;
  page_count: number;
}

export async function barcodeLookup(query: string): Promise<FoodItem> {
  const resp = await axios.get(`/api/food-items/${encodeURIComponent(query)}`);

  if (resp.status !== 200) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }

  const data = resp.data;

  if (!data || !data.foodname || !data.barcode) {
    throw new Error('Product not found');
  }

  const foodItem: FoodItem = {
    foodname: data.foodname,
    barcode: data.barcode,
    protein_per_serv: data.protein_per_serv || 0,
    carb_per_serv: data.carb_per_serv || 0,
    fat_per_serv: data.fat_per_serv || 0,
    calories_per_serv: data.calories_per_serv || 0,
    image: data.image || ''
  };

  return foodItem;
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

