/**
 * assets/js/app.js
 * Controlador principal de ContactosApp — OOP + ES Modules
 */

import { ApiService }    from './api2.js';
import { Modal }         from './modal.js';
import { Toast }         from './toast.js';
import { Validator }     from './validator.js';
import { ContactsTable } from './table.js';

class ContactosApp {

  #table;
  #mForm;
  #mConfirm;
  #form;
  #editId      = null;
  #deleteTarget = null;

  constructor() {
    this.#table   = new ContactsTable();
    this.#mForm   = new Modal('modal-form');
    this.#mConfirm = new Modal('modal-confirm');
    this.#form    = document.getElementById('contact-form');

    this.#table.onEdit   = id => this.#openEdit(id);
    this.#table.onDelete = id => this.#openDelete(id);

    this.#bindUI();
    this.#load();
  }

  // ── Eventos ────────────────────────────────────────────────────

  #bindUI() {
    // Botón "Nuevo contacto" (navbar y posible botón secundario)
    document.querySelectorAll('[data-action="new"]')
      .forEach(b => b.addEventListener('click', () => this.#openNew()));

    // Búsqueda
    document.getElementById('search-input')
      ?.addEventListener('input', e => this.#table.filter(e.target.value));

    // Limpiar búsqueda
    document.getElementById('btn-clear')
      ?.addEventListener('click', () => {
        const inp = document.getElementById('search-input');
        if (inp) { inp.value = ''; this.#table.filter(''); inp.focus(); }
      });

    // Recargar
    document.getElementById('btn-reload')
      ?.addEventListener('click', () => this.#load());

    // Ordenación de columnas
    document.querySelectorAll('[data-sort]')
      .forEach(th => th.addEventListener('click', () => {
        this.#table.sort(th.dataset.sort);
        this.#refreshSortIcons(th.dataset.sort);
      }));

    // Submit del formulario
    this.#form?.addEventListener('submit', e => { e.preventDefault(); this.#submitForm(); });

    // Botón guardar apunta al submit del form
    document.getElementById('btn-save')
      ?.addEventListener('click', () => this.#form?.dispatchEvent(new Event('submit')));

    // Confirmar eliminación
    document.getElementById('btn-do-delete')
      ?.addEventListener('click', () => this.#doDelete());
  }

  // ── Carga ──────────────────────────────────────────────────────

  async #load() {
    this.#table.showLoading();
    try {
      console.log('🔵 App.load() iniciando...');
      const res = await ApiService.getAll();
      console.log('🔵 Respuesta de ApiService.getAll():', res);
      console.log('🔵 Tipo de respuesta:', typeof res);
      console.log('🔵 ¿Es array?', Array.isArray(res));
      
      // Extraer los contactos correctamente
      let contacts = [];
      if (Array.isArray(res)) {
        contacts = res;
        console.log('🔵 Es array directamente, contactos:', contacts.length);
      } else if (res && typeof res === 'object') {
        if (Array.isArray(res.data)) {
          contacts = res.data;
          console.log('🔵 Extrayendo data de res.data, contactos:', contacts.length);
        } else if (Array.isArray(res.contacts)) {
          contacts = res.contacts;
          console.log('🔵 Extrayendo contacts de res.contacts, contactos:', contacts.length);
        } else {
          console.log('🔵 res es objeto pero no tiene data ni contacts, keys:', Object.keys(res));
          contacts = [];
        }
      }
      
      console.log('🔵 Contactos finales a cargar en tabla:', contacts.length);
      this.#table.load(contacts);
    } catch (e) {
      console.error('🔴 Error en load:', e);
      this.#table.showError(e.message);
      Toast.error(e.message);
    }
  }

  // ── Modal Formulario ───────────────────────────────────────────

  #openNew() {
    this.#editId = null;
    this.#form.reset();
    Validator.clear(this.#form);
    this.#setFormMode('new');
    this.#mForm.open();
  }

  async #openEdit(id) {
    this.#setFormMode('edit');
    this.#mForm.open();
    try {
      const res = await ApiService.getOne(id);
      const c   = res?.data ?? res;
      this.#editId = c.id;
      this.#fillForm(c);
    } catch (e) {
      Toast.error('No se pudo cargar el contacto.');
      this.#mForm.close();
    }
  }

  #fillForm(c) {
    ['nombre','apellido','email','telefono'].forEach(k => {
      const el = this.#form.querySelector(`[name="${k}"]`);
      if (el) el.value = c[k] ?? '';
    });
  }

  #setFormMode(mode) {
    const isNew = mode === 'new';
    document.getElementById('modal-form-title').textContent    = isNew ? 'Nuevo Contacto'         : 'Editar Contacto';
    document.getElementById('modal-form-sub').textContent      = isNew ? 'Completa los datos'      : 'Modifica los datos';
    document.getElementById('modal-form-icon').className       = `modal-head-icon ${isNew ? 'mhi-cyan' : 'mhi-violet'}`;
    document.getElementById('modal-form-icon').innerHTML       = isNew ? '<i class="fa-solid fa-user-plus"></i>' : '<i class="fa-solid fa-pen-to-square"></i>';
    const btn = document.getElementById('btn-save');
    btn.innerHTML = isNew
      ? '<i class="fa-solid fa-plus btn-icon"></i> Agregar'
      : '<i class="fa-solid fa-floppy-disk btn-icon"></i> Guardar';
  }

  async #submitForm() {
    if (!Validator.run(this.#form)) return;
    const payload = {
      nombre:   this.#form.querySelector('[name="nombre"]').value.trim(),
      apellido: this.#form.querySelector('[name="apellido"]').value.trim(),
      email:    this.#form.querySelector('[name="email"]').value.trim().toLowerCase(),
      telefono: this.#form.querySelector('[name="telefono"]').value.trim(),
    };
    const btn = document.getElementById('btn-save');
    this.#setBtnLoading(btn, true);
    try {
      if (this.#editId !== null) {
        await ApiService.update(this.#editId, payload);
        Toast.success('Contacto actualizado correctamente.');
        this.#mForm.close();
        await this.#load();
        this.#table.highlight(this.#editId);
      } else {
        const res = await ApiService.create(payload);
        Toast.success('Contacto agregado correctamente.');
        this.#mForm.close();
        await this.#load();
        const newId = (res?.data ?? res)?.id;
        if (newId) this.#table.highlight(newId);
      }
    } catch (e) {
      Toast.error(e.message);
    } finally {
      this.#setBtnLoading(btn, false);
    }
  }

  // ── Modal Eliminar ─────────────────────────────────────────────

  async #openDelete(id) {
    try {
      const res = await ApiService.getOne(id);
      this.#deleteTarget = res?.data ?? res;
    } catch {
      this.#deleteTarget = { id, nombre: 'este contacto', apellido: '' };
    }
    const nameEl = document.getElementById('del-name');
    if (nameEl) nameEl.textContent =
      `${this.#deleteTarget.nombre ?? ''} ${this.#deleteTarget.apellido ?? ''}`.trim();
    this.#mConfirm.open();
  }

  async #doDelete() {
    if (!this.#deleteTarget) return;
    const btn = document.getElementById('btn-do-delete');
    this.#setBtnLoading(btn, true);
    try {
      await ApiService.remove(this.#deleteTarget.id);
      Toast.success('Contacto eliminado.');
      this.#mConfirm.close();
      await this.#load();
    } catch (e) {
      Toast.error(e.message);
    } finally {
      this.#setBtnLoading(btn, false);
      this.#deleteTarget = null;
    }
  }

  // ── Helpers ────────────────────────────────────────────────────

  #setBtnLoading(btn, state) {
    if (!btn) return;
    btn.classList.toggle('is-loading', state);
    const ico = btn.querySelector('.btn-icon, i');
    if (state && ico) {
      ico.dataset.orig = ico.className;
      ico.className = 'fa-solid fa-spinner btn-icon';
    } else if (!state && ico?.dataset.orig) {
      ico.className = ico.dataset.orig;
    }
  }

  #refreshSortIcons(active) {
    document.querySelectorAll('[data-sort] .sort-icon').forEach(ico => {
      const th = ico.closest('[data-sort]');
      ico.className = `sort-icon fa-solid ${th.dataset.sort === active ? 'fa-sort-down active' : 'fa-sort'}`;
    });
  }
}

// ── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => new ContactosApp());
