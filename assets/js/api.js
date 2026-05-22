/**
 * assets/js/api.js
 * ─────────────────────────────────────────────────────────────
 * Servicio HTTP que consume la API REST del back-end.
 */

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
    try {
      const res  = await fetch(url, { ...op, headers: { ...this.#headers, ...(op.headers ?? {}) } });
      if (res.status === 204) return null;
      const body = await res.json();
      if (!res.ok) throw new ApiError(body?.message ?? body?.error ?? `HTTP ${res.status}`, res.status);
      
      // ✅ IMPORTANTE: Si la respuesta tiene {success: true, data: [...]}, extraemos data
      if (body.success === true && body.data !== undefined) {
        return body.data;
      }
      
      return body;
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError('Sin conexión con el servidor. Verifica la URL de la API.', 0);
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────

  /** GET /contactos */
  static getAll() { return this.#req('/contactos'); }

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
