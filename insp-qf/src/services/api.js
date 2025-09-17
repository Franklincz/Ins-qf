// src/services/api.js
class ApiService {
  constructor() {
    this.baseUrl = ''; // 'http://localhost:3000' si lo necesitas
    this.endpoints = {
      reports: '/api/reports',         // GET (lista, filtros, paginación), POST (crear)
      report:  '/api/reports',         // /:id para GET/PUT/DELETE si lo agregas
      clear:   '/api/reports/clear',   // POST (borrado masivo)
      estados: '/api/estados',         // opcional si lo usas
      analyticsOverview: '/api/analytics/overview',
    };
  }

  // ------------------------ helper HTTP ------------------------
  async request(url, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    };

    const res = await fetch(`${this.baseUrl}${url}`, config);

    if (!res.ok) {
      if (res.status === 204) return null;
      const text = await res.text().catch(() => '');
      const message = text || `HTTP error ${res.status}`;
      throw new Error(message);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const raw = await res.text();
    try { return JSON.parse(raw); } catch { return raw; }
  }

  // ============================================================
  // ===================== REPORTES (LISTA) =====================
  // ============================================================

  /**
   * Backend list (sin fallback local). No manda status=all.
   */
  async getReportes({ status = 'all', limit = 20, cursor = null } = {}) {
    const params = new URLSearchParams({ limit: String(limit) });

    // Si tu backend espera ES ('aprobado', 'pendiente', 'rechazado'), mapeamos:
    const statusMap = { approved: 'aprobado', pending: 'pendiente', rejected: 'rechazado' };
    const normalized = status && status !== 'all' ? (statusMap[status] || status) : undefined;

    if (normalized) params.set('status', normalized);
    if (cursor) params.set('cursor', cursor);

    try {
      const data = await this.request(`${this.endpoints.reports}?${params.toString()}`);
      return {
        items: Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []),
        nextCursor: data?.nextCursor ?? null,
      };
    } catch (error) {
      console.error('Error fetching reportes:', error);
      // ❌ sin fallback local: dejamos que el UI lo muestre
      throw error;
    }
  }

  /**
   * Normaliza el status de un doc (soporta ES/EN). Devuelve EN: approved|pending|rejected
   */
  normalizeDocStatus(doc) {
    const val = (doc?.status ?? doc?.estado ?? '').toString().toLowerCase();
    if (val === 'aprobado')  return 'approved';
    if (val === 'pendiente') return 'pending';
    if (val === 'rechazado') return 'rejected';
    if (val === 'approved' || val === 'pending' || val === 'rejected') return val;
    return '';
  }

  /**
   * Parche: trae páginas "all" del backend y filtra en cliente
   * hasta completar 'limit'. Evita exigir índice compuesto.
   */
  async getReportesClientFiltered({ status, limit = 20, cursor = null }) {
    const wanted = status; // 'approved' | 'pending' | 'rejected' (EN)
    let items = [];
    let next = cursor ?? null;
    let safety = 0;

    // Cargamos páginas sin filtro (all) y filtramos localmente
    while (items.length < limit && safety < 6) { // evita loops muy largos
      const page = await this.getReportes({ status: 'all', limit: 50, cursor: next });
      const pageItems = Array.isArray(page.items) ? page.items : [];
      const filtered = pageItems.filter(d => this.normalizeDocStatus(d) === wanted);

      items.push(...filtered);

      if (!page.nextCursor) {
        next = null;
        break;
      }
      next = page.nextCursor;
      safety++;
    }

    if (items.length > limit) items = items.slice(0, limit);
    return { items, nextCursor: next };
  }

  /**
   * API para el modal de historial.
   * - 'all' => pide al backend normalmente.
   * - 'approved'|'pending'|'rejected' => filtra en cliente para evitar índice.
   */
  async getReportesForHistory({ status = 'all', limit = 20, cursor = null } = {}) {
    let items, nextCursor;

    if (status === 'all') {
      const resp = await this.getReportes({ status, limit, cursor });
      items = resp.items;
      nextCursor = resp.nextCursor;
    } else {
      const resp = await this.getReportesClientFiltered({ status, limit, cursor });
      items = resp.items;
      nextCursor = resp.nextCursor;
    }

    return {
      items: this.formatReportesForHistory(items),
      nextCursor,
    };
  }

  // ============================================================
  // =================== CRUD (ID / CREATE) =====================
  // ============================================================

  async createReporte(reporteData) {
    return this.request(this.endpoints.reports, {
      method: 'POST',
      body: JSON.stringify(reporteData),
    });
  }

  async getReporte(id) {
    try {
      return await this.request(`${this.endpoints.report}/${id}`);
    } catch (error) {
      console.warn('GET /report/:id no disponible; fallback a lista.', error);
      const { items } = await this.getReportes();
      return items.find(r => r.id === id) || null;
    }
  }

  async updateReporte(id, reporteData) {
    return this.request(`${this.endpoints.report}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reporteData),
    });
  }

  async deleteReporte(id) {
    return this.request(`${this.endpoints.report}/${id}`, { method: 'DELETE' });
  }

  async clearAllReportes() {
    return this.request(this.endpoints.clear, { method: 'POST' });
  }

  // ============================================================
  // =================== AYUDAS PARA EL MODAL ===================
  // ============================================================

  formatReportesForHistory(items) {
    const toDate = (v) => {
      if (v && typeof v.toDate === 'function') return v.toDate();
      try { return v ? new Date(v) : null; } catch { return null; }
    };

    return items.map((r) => ({
      id: r.id,
      date: toDate(r.fecha) || toDate(r?.datos_inspeccion?.fecha) || null,
      product: r.product || r?.datos_inspeccion?.producto || 'Producto no especificado',
      lot: r.lote || r?.datos_inspeccion?.lote || '',
      status: r.status || r.estado || 'pending',
      area: r.area || r?.datos_inspeccion?.area || '',
      elaborado_por: r.elaborado_por || r?.elaboracion?.elaborado_por || '',
      total_defectos:
        typeof r.total_defectos === 'number'
          ? r.total_defectos
          : (typeof r?.defectos?.total_general === 'number' ? r.defectos.total_general : 0),
      completado: Boolean(r.completado ?? r?.metadata?.completado),
    }));
  }

  // ============================================================
  // ===================== DASHBOARD ANALYTICS ==================
  // ============================================================

  async getAnalyticsOverview({ rangeDays = 180 } = {}) {
    const qs = new URLSearchParams({ rangeDays: String(rangeDays) });
    return this.request(`${this.endpoints.analyticsOverview}?${qs.toString()}`);
  }




  // EN → ES para el listado de PDFs
  statusEnToEs(v) {
    const x = (v || '').toString().toLowerCase();
    if (x === 'approved')  return 'aprobado';
    if (x === 'pending')   return 'pendiente';
    if (x === 'rejected')  return 'rechazado';
    return x || ''; // si ya viene en ES, se queda tal cual
  }

  
  // Formatea los ítems que usa <PdfReports />
  formatReportesPdfItems(items) {
    const toDate = (v) => {
      if (v && typeof v.toDate === 'function') return v.toDate();
      try { return v ? new Date(v) : null; } catch { return null; }
    };

    return (items || []).map((r) => {
      // compatibilidad de nombres
      const statusRaw = r.status ?? r.estado ?? '';
      return {
        id: r.id || r.docId || r.code || '',
        code: r.code || r.id || '',
        createdAt: toDate(r.createdAt ?? r.fecha ?? r.created_at ?? r.elaboracion?.fecha_elaboracion) || null,
        estado: this.statusEnToEs(statusRaw),  // << clave para tu filtro y badge
        area: r.area || r.datos_inspeccion?.area || '',
        lot: r.lot || r.lote || r.datos_inspeccion?.lote || '',
      };
    });
  }


// Lista solo reportes que tienen PDF
  async getReportesPdf({ limit = 20, cursor = null } = {}) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);
    return this.request(`/api/reports/pdfs?${params.toString()}`);
  }

  // Devuelve una URL firmada para ver/descargar el PDF
  async getPdfUrl(reporteId) {
    const data = await this.request(`/api/reports/${reporteId}/pdf-url`);
    return data?.url || null;
  }






}

// Singleton
const apiService = new ApiService();
export default apiService;

