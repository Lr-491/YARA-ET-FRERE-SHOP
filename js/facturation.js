// ── État global ──────────────────────────────────────────
let invoiceCounter = parseInt(localStorage.getItem('yfs_invoice_counter') || '1');
let sales = JSON.parse(localStorage.getItem('yfs_sales_today') || '[]');
let currentInvoice = null;

// Vérifie si les ventes sauvegardées sont du jour
const todayKey = new Date().toISOString().slice(0,10);
const savedDay = localStorage.getItem('yfs_sales_date');
if (savedDay !== todayKey) {
    sales = [];
    localStorage.setItem('yfs_sales_date', todayKey);
    localStorage.setItem('yfs_sales_today', '[]');
}

// ── Helpers ──────────────────────────────────────────────
function fmt(n) {
    return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}
function now() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function showToast(msg, color = '#16a34a') {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.style.background = color;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Init date ────────────────────────────────────────────
function initDate() {
    const d = new Date();
    document.getElementById('invoiceDate').value = d.toISOString().slice(0,10);
    document.getElementById('todayLabel').textContent = d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

// ── Lignes produits ──────────────────────────────────────
function buildProductOptions() {
    return data.map(p =>
        `<option value="${p.id}" data-price="${p.price || 0}">${p.title}${p.model ? ' ' + p.model : ''}</option>`
    ).join('');
}

function addItemRow(productId = '', qty = 1, unitPrice = '') {
    const list = document.getElementById('itemsList');
    const idx = Date.now();
    const row = document.createElement('div');
    row.className = 'item-row';
    row.dataset.idx = idx;
    row.innerHTML = `
        <div>
            <label>Produit</label>
            <select class="item-product" data-idx="${idx}">
                <option value="">-- Sélectionner --</option>
                ${buildProductOptions()}
            </select>
        </div>
        <div>
            <label>Qté</label>
            <input type="number" class="item-qty" min="1" value="${qty}" data-idx="${idx}">
        </div>
        <div>
            <label>Prix unitaire (FCFA)</label>
            <input type="number" class="item-price" min="0" value="${unitPrice}" placeholder="0" data-idx="${idx}">
        </div>
        <button class="btn-remove" data-idx="${idx}" title="Supprimer">✕</button>
    `;
    list.appendChild(row);

    // Pré-sélectionner le produit si fourni
    if (productId) {
        row.querySelector('.item-product').value = productId;
    }

    // Événements
    row.querySelector('.item-product').addEventListener('change', function() {
        const opt = this.options[this.selectedIndex];
        const price = opt.dataset.price;
        if (price && price > 0) {
            row.querySelector('.item-price').value = price;
        }
        updateTotal();
    });
    row.querySelector('.item-qty').addEventListener('input', updateTotal);
    row.querySelector('.item-price').addEventListener('input', updateTotal);
    row.querySelector('.btn-remove').addEventListener('click', function() {
        row.remove();
        updateTotal();
    });

    updateTotal();
}

function getItems() {
    const rows = document.querySelectorAll('.item-row');
    return Array.from(rows).map(row => {
        const productSel = row.querySelector('.item-product');
        const productId = productSel.value;
        const product = data.find(p => p.id == productId);
        const qty = parseInt(row.querySelector('.item-qty').value) || 1;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        return {
            productId,
            label: product ? (product.title + (product.model ? ' ' + product.model : '')) : 'Produit non sélectionné',
            qty,
            price,
            subtotal: qty * price
        };
    }).filter(i => i.productId);
}

function updateTotal() {
    const items = getItems();
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    document.getElementById('totalDisplay').textContent = fmt(total);
}

// ── Génération facture ───────────────────────────────────
function generateInvoice() {
    const client = document.getElementById('clientName').value.trim();
    const phone  = document.getElementById('clientPhone').value.trim();
    const date   = document.getElementById('invoiceDate').value;
    const note   = document.getElementById('invoiceNote').value.trim();
    const items  = getItems();

    if (!client) { showToast('Veuillez saisir le nom du client', '#dc2626'); return null; }
    if (items.length === 0) { showToast('Ajoutez au moins un produit', '#dc2626'); return null; }

    const total = items.reduce((s, i) => s + i.subtotal, 0);
    const invNum = 'FAC-' + String(invoiceCounter).padStart(4, '0');
    const dateFormatted = new Date(date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

    const rowsHTML = items.map(i => `
        <tr>
            <td>${i.label}</td>
            <td style="text-align:center">${i.qty}</td>
            <td style="text-align:right">${fmt(i.price)}</td>
            <td style="text-align:right;font-weight:600">${fmt(i.subtotal)}</td>
        </tr>
    `).join('');

    document.getElementById('invoicePreview').innerHTML = `
        <div class="inv-header">
            <div class="inv-logo">
                 YARRA ET FRERE SHOP
                <small>La qualité branchée sur l'excellence</small>
                <small>Pointe-Noire — WhatsApp : ${WHATSAPP_NUMBER}</small>
            </div>
            <div class="inv-meta">
                <div class="inv-number">${invNum}</div>
                <small>Date : ${dateFormatted}</small>
            </div>
        </div>
        <div class="inv-client">
            <h4>Facturé à</h4>
            <p>${client}</p>
            ${phone ? `<p style="color:#475569;font-size:0.85rem">${phone}</p>` : ''}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th style="text-align:center">Qté</th>
                    <th style="text-align:right">Prix unit.</th>
                    <th style="text-align:right">Sous-total</th>
                </tr>
            </thead>
            <tbody>${rowsHTML}</tbody>
        </table>
        <div class="inv-total-row">
            <div class="inv-total-box">
                <span>TOTAL TTC</span>
                <strong>${fmt(total)}</strong>
            </div>
        </div>
        ${note ? `<p style="margin-top:1.25rem;font-size:0.85rem;color:#475569"><strong>Note :</strong> ${note}</p>` : ''}
        <div class="inv-footer">
            Merci pour votre confiance ! — YARRA ET FRERE SERVICES SHOP
        </div>
    `;

    currentInvoice = { invNum, client, phone, date, dateFormatted, items, total, note };
    return currentInvoice;
}

// ── Valider vente → suivi ────────────────────────────────
function saveSale() {
    if (!currentInvoice) {
        const inv = generateInvoice();
        if (!inv) return;
    }
    const inv = currentInvoice;
    const sale = {
        id: sales.length + 1,
        time: now(),
        invNum: inv.invNum,
        client: inv.client,
        phone: inv.phone,
        products: inv.items.map(i => `${i.label} ×${i.qty}`).join(', '),
        total: inv.total
    };
    sales.push(sale);
    invoiceCounter++;
    localStorage.setItem('yfs_invoice_counter', invoiceCounter);
    localStorage.setItem('yfs_sales_today', JSON.stringify(sales));
    renderSales();
    showToast('Vente enregistrée avec succès !');
    resetForm();
}

// ── Tableau suivi ────────────────────────────────────────
function renderSales() {
    const body = document.getElementById('salesBody');
    if (sales.length === 0) {
        body.innerHTML = `<tr><td colspan="8"><div class="empty-state"><span>📭</span><p>Aucune vente enregistrée pour aujourd'hui.</p></div></td></tr>`;
    } else {
        body.innerHTML = sales.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.time}</td>
                <td><strong>${s.invNum}</strong></td>
                <td>${s.client}</td>
                <td>${s.phone || '—'}</td>
                <td style="max-width:260px;white-space:normal">${s.products}</td>
                <td><strong>${fmt(s.total)}</strong></td>
                <td><span class="badge">Payé</span></td>
            </tr>
        `).join('');
    }
    // Stats
    const count = sales.length;
    const total = sales.reduce((s, v) => s + v.total, 0);
    const avg = count ? Math.round(total / count) : 0;
    document.getElementById('statCount').textContent = count;
    document.getElementById('statTotal').textContent = total.toLocaleString('fr-FR');
    document.getElementById('statAvg').textContent = avg.toLocaleString('fr-FR');
}

// ── Export Excel ─────────────────────────────────────────
function exportExcel() {
    if (sales.length === 0) { showToast('Aucune vente à exporter', '#dc2626'); return; }
    const d = new Date().toLocaleDateString('fr-FR');
    const wsData = [
        ['#', 'Heure', 'N° Facture', 'Client', 'Téléphone', 'Produits', 'Total (FCFA)', 'Statut'],
        ...sales.map(s => [s.id, s.time, s.invNum, s.client, s.phone || '', s.products, s.total, 'Payé'])
    ];
    // Ligne totaux
    wsData.push([]);
    wsData.push(['', '', '', '', '', 'TOTAL DU JOUR', sales.reduce((t,s) => t+s.total, 0), '']);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Largeurs colonnes
    ws['!cols'] = [
        {wch:4}, {wch:8}, {wch:12}, {wch:20}, {wch:16}, {wch:40}, {wch:16}, {wch:10}
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Ventes ' + d);
    XLSX.writeFile(wb, `Ventes_YARRA_${todayKey}.xlsx`);
    showToast('Fichier Excel téléchargé !');
}

// ── Reset formulaire ─────────────────────────────────────
function resetForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('invoiceNote').value = '';
    document.getElementById('itemsList').innerHTML = '';
    document.getElementById('totalDisplay').textContent = '0 FCFA';
    document.getElementById('invoicePreview').innerHTML = `
        <div class="inv-placeholder">
            <span>📄</span>
            <p>Remplissez le formulaire et cliquez sur <strong>Générer</strong> pour prévisualiser la facture.</p>
        </div>`;
    currentInvoice = null;
    initDate();
    addItemRow();
}

// ── Événements ───────────────────────────────────────────
document.getElementById('btnAddItem').addEventListener('click', () => addItemRow());
document.getElementById('btnGenerate').addEventListener('click', () => {
    const inv = generateInvoice();
    if (inv) showToast('Facture générée !', '#0ea5e9');
});
document.getElementById('btnPrint').addEventListener('click', () => {
    const inv = generateInvoice();
    if (inv) window.print();
});
document.getElementById('btnSave').addEventListener('click', saveSale);
document.getElementById('btnReset').addEventListener('click', () => {
    if (confirm('Effacer le formulaire en cours ?')) resetForm();
});
document.getElementById('btnExcel').addEventListener('click', exportExcel);
document.getElementById('btnClearSales').addEventListener('click', () => {
    if (confirm('Vider tout le suivi du jour ? Cette action est irréversible.')) {
        sales = [];
        localStorage.setItem('yfs_sales_today', '[]');
        renderSales();
        showToast('Suivi vidé', '#dc2626');
    }
});

// ── Initialisation ───────────────────────────────────────
initDate();
addItemRow();
renderSales();