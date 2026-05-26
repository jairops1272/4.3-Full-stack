export class ApiService {
  static BASE_URL = 'https://contactos-app.jairopineda.io';

  static async getAll() {
    try {
      const response = await fetch(`${this.BASE_URL}/contactos`);
      const data = await response.json();
      console.log('API getAll response:', data);
      
      // La API devuelve {success: true, data: [...]}
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getOne(id) {
    const response = await fetch(`${this.BASE_URL}/contactos/${id}`);
    const data = await response.json();
    return data.success ? data.data : data;
  }

  static async create(data) {
    const response = await fetch(`${this.BASE_URL}/contactos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${this.BASE_URL}/contactos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  static async remove(id) {
    const response = await fetch(`${this.BASE_URL}/contactos/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
}
