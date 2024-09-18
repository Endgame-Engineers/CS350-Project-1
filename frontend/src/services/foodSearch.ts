export async function foodSearch(query: string): Promise<null> {
    try {
      const resp = await fetch(`/api/food-items/${query}`);
      
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      return data;
    } catch (error) {
      console.error('Error fetching the API:', error);
      return null;
    }
}

