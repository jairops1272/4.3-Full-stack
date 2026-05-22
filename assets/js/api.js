/**
 * assets/js/api.js
 * ─────────────────────────────────────────────────────────────
 * Servicio HTTP que consume la API REST del back-end.
 */

console.log('🟢 API SERVICE CARGADO - VERSION 2026.05.22 FINAL');

export class ApiService {

static BASE_URL = 'https://contactos-app.jairopineda.io';

  static #headers = {
    'Content-Type': 'application/json',
    'Accept'      : 'application/json',
  };

  /**
   * Método privado genérico de petición HTTP.
   * @param {string} path    - ruta relativa, ej: '/contactos'
   * @param {RequestInit} op - opciones de fetch
   */
  static async #req(path, op = {}) {
    const url = `${this.BASE_URL}${path}`;
    console.log(`📡 [API] Llamando a: ${url}`);
    
    try {
      const res  = await fetch(url, { ...op, headers: { ...this.#headers, ...(op.headers ?? {}) } });
      console.log(`📡 [API] Respuesta status: ${res.status}`);
      
      if (res.status === 204) return null;
      const body = await res.json();
      console.log(`📡 [API] Respuesta body:`, body);
      
      if (!res.ok) throw new ApiError(body?.message ?? body?.error ?? `HTTP ${res.status}`, res.status);
      
      // ✅ IMPORTANTE: Si la respuesta tiene {success: true, data: [...]}, extraemos data
      if (body.success === true && body.data !== undefined) {
        console.log(`📡 [API] Extrayendo data, contactos encontrados: ${body.data.length}`);
        return body.data;
      }
      
      return body;
    } catch (e) {
      console.error(`📡 [API] Error:`, e);
      if (e instanceof ApiError) throw e;
      throw new ApiError('Sin conexión con el servidor. Verifica la URL de la API.', 0);
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────

  /** GET /contactos */
  static getAll() { 
    console.log('📡 [API] getAll() llamado');
    return this.#req('/contactos'); 
  }

  /** GET /contactos/:id */
  static getOne(id) { return this.#req(`/contactos/${id}`); }

  /** POST /contactos */
  static create(data) { return this.#req('/contactos', { method: 'POST', body: JSON.stringify(data) }); }

  /** PUT /contactos/:id */
  static update(id, data) { return this.#req(`/contactos/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }

  /** DELETE /contactos/:id */
  static remove(id) { return this.#req(`/contactos/${id}`, { method: 'DELETE' }); }
}

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
  }
}
