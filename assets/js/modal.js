/**
 * assets/js/modal.js
 * Clase reutilizable para gestionar modales
 */
export class Modal {
  #el;

  constructor(id) {
    this.#el = document.getElementById(id);
    if (!this.#el) throw new Error(`Modal #${id} no existe`);

    // Cerrar al click fuera
    this.#el.addEventListener('click', e => { if (e.target === this.#el) this.close(); });

    // Cerrar con Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.isOpen()) this.close(); });

    // Botones con data-close
    this.#el.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => this.close()));
  }

  open() {
    this.#el.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => this.#el.querySelector('input, select, textarea')?.focus());
  }

  close() {
    this.#el.classList.remove('open');
    document.body.style.overflow = '';
  }

  isOpen() { return this.#el.classList.contains('open'); }

  get el() { return this.#el; }
}