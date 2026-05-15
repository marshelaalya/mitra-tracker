document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem('waMitraPartners');

    /* ── Message Template ── */
    function getMessageTemplate(name) {
        return `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPerkenalkan, saya Marshela, pegawai dari BPS Kabupaten Kepulauan Sula\n\nSaya ingin menginformasikan kepada Kakak *${name}* untuk melakukan konfirmasi *Terima Tawaran Sensus Ekonomi 2026* di *Web Sobat* pada akun masing-masing.\n\nApabila telah melakukan Terima Tawaran, mohon dapat menghubungi saya kembali dengan membalas pesan ini.\n\nTerima kasih`;
    }

    const waIcon    = `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`;
    const checkIcon = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>`;
    const chevron   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

    const OPTS = [
        { value: '',            label: 'Tidak Ada Kendala',             cls: 'opt-dot-none'  },
        { value: 'perlu_verif', label: 'Perlu Verifikasi',              cls: 'opt-dot-verif' },
        { value: 'error_web',   label: 'Belum Bisa Akses Web',          cls: 'opt-dot-web'   },
        { value: 'tolak',       label: 'Tawaran Belum Muncul di Sobat', cls: 'opt-dot-tolak' },
    ];

    /* ─────────────────────────────────────────
       FLOATING DROPDOWN
       One shared <div> appended to <body>.
       position:fixed so it escapes overflow:auto.
       Click on item uses 'click' with stopProp.
    ───────────────────────────────────────── */
    const fMenu = document.createElement('div');
    fMenu.className = 'custom-dd-menu';
    fMenu.style.cssText = 'position:fixed;display:none;z-index:9999;';
    document.body.appendChild(fMenu);

    // Clicks INSIDE the floating menu must not reach document
    fMenu.addEventListener('click', e => e.stopPropagation());

    let openWrapper = null;

    function closeDD() {
        fMenu.style.display = 'none';
        fMenu.innerHTML = '';
        if (openWrapper) { openWrapper.classList.remove('open'); openWrapper = null; }
    }

    // Close on any outside click
    document.addEventListener('click', closeDD);

    function buildDropdown(initVal, onChange) {
        let val = initVal;

        const wrap = document.createElement('div');
        wrap.className = 'custom-dd';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'custom-dd-trigger';

        const txt = document.createElement('span');
        txt.className = 'custom-dd-trigger-text';
        txt.textContent = (OPTS.find(o => o.value === val) || OPTS[0]).label;

        const arr = document.createElement('span');
        arr.className = 'custom-dd-arrow';
        arr.innerHTML = chevron;

        btn.appendChild(txt); btn.appendChild(arr);
        wrap.appendChild(btn);

        btn.addEventListener('click', e => {
            e.stopPropagation();

            if (openWrapper === wrap) { closeDD(); return; }
            closeDD();

            // Build items
            OPTS.forEach(opt => {
                const item = document.createElement('div');
                item.className = 'custom-dd-option' + (opt.value === val ? ' selected' : '');
                const dot = document.createElement('span');
                dot.className = 'opt-dot ' + opt.cls;
                const lbl = document.createElement('span');
                lbl.textContent = opt.label;
                item.appendChild(dot); item.appendChild(lbl);

                // Use 'click' (not mousedown) — fMenu already stops propagation above
                item.addEventListener('click', e => {
                    e.stopPropagation();
                    val = opt.value;
                    txt.textContent = opt.label;
                    closeDD();
                    onChange(opt.value);
                });
                fMenu.appendChild(item);
            });

            // Position fixed below trigger
            const r = btn.getBoundingClientRect();
            fMenu.style.top      = (r.bottom + 4) + 'px';
            fMenu.style.left     = r.left + 'px';
            fMenu.style.minWidth = Math.max(r.width, 210) + 'px';
            fMenu.style.display  = 'block';

            wrap.classList.add('open');
            openWrapper = wrap;
        });

        return wrap;
    }

    /* ── State helpers ── */
    function getState(phone) {
        try { return JSON.parse(localStorage.getItem('mt_' + phone)) || { status: 'belum', kendala: '' }; }
        catch { return { status: 'belum', kendala: '' }; }
    }
    function setState(phone, data) { localStorage.setItem('mt_' + phone, JSON.stringify(data)); }

    function rowClass(s) {
        if (s === 'sudah_konfirm') return 'row-done';
        if (s === 'menunggu')      return 'row-menunggu';
        if (['tolak','error_web','perlu_verif'].includes(s)) return 'row-kendala';
        return 'row-belum';
    }

    function formatPhone(p) {
        const raw = p.startsWith('62') ? p.slice(2) : p;
        return '+62 ' + (raw.match(/.{1,4}/g) || []).join(' ');
    }

    function badgeHTML(s) {
        const M = {
            belum:        ['badge-belum',       'Belum Dihubungi'],
            menunggu:     ['badge-menunggu',     'Menunggu Balasan'],
            sudah_konfirm:['badge-selesai',      'Terkonfirmasi'],
            perlu_verif:  ['badge-perlu_verif',  'Perlu Verifikasi'],
            error_web:    ['badge-error_web',    'Kendala Akses Web'],
            tolak:        ['badge-tolak',        'Cek Sistem Sobat'],
        };
        const [cls, text] = M[s] || M.belum;
        return `<span class="badge ${cls}">${text}</span>`;
    }

    /* ── Render row ── */
    function renderRow(tr) {
        const phone  = tr.dataset.phone;
        const name   = tr.querySelector('.td-name').textContent.trim();
        const state  = getState(phone);
        const isDone = state.status === 'sudah_konfirm';

        tr.className = rowClass(state.status);
        tr.querySelector('.td-phone').textContent  = formatPhone(phone);
        tr.querySelector('.td-status').innerHTML   = badgeHTML(state.status);

        // Dropdown
        const tdK = tr.querySelector('.td-kendala');
        tdK.innerHTML = '';
        if (!isDone) {
            tdK.appendChild(buildDropdown(state.kendala || '', newVal => {
                const cur  = getState(phone);
                const newS = newVal ? newVal : (cur.status === 'belum' ? 'belum' : 'menunggu');
                setState(phone, { status: newS, kendala: newVal });
                renderRow(tr); updateStats();
            }));
        }

        // WA button
        const tdA = tr.querySelector('.td-action');
        tdA.innerHTML = '';
        const link = document.createElement('a');
        link.href = `https://wa.me/${phone}?text=${encodeURIComponent(getMessageTemplate(name))}`;
        link.target = '_blank'; link.className = 'btn-wa';
        link.innerHTML = waIcon + ' Hubungi';
        link.addEventListener('click', () => {
            if (getState(phone).status === 'belum')
                setTimeout(() => { setState(phone, { ...getState(phone), status: 'menunggu' }); renderRow(tr); updateStats(); }, 400);
        });
        tdA.appendChild(link);

        // Checkbox
        const tdC = tr.querySelector('.td-check');
        tdC.innerHTML = '';
        const lbl = document.createElement('label');
        lbl.className = 'check-label'; lbl.title = 'Tandai Selesai / Terkonfirmasi';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.className = 'done-cb'; cb.checked = isDone;
        const mk = document.createElement('span'); mk.className = 'checkmark'; mk.innerHTML = checkIcon;
        lbl.appendChild(cb); lbl.appendChild(mk); tdC.appendChild(lbl);
        cb.addEventListener('change', () => {
            const cur = getState(phone);
            setState(phone, { status: cb.checked ? 'sudah_konfirm' : 'menunggu', kendala: cb.checked ? '' : cur.kendala });
            renderRow(tr); updateStats();
        });
    }

    /* ── Init ── */
    const tbody = document.getElementById('partner-tbody');
    const rows  = Array.from(tbody.querySelectorAll('tr[data-phone]'));
    rows.forEach(tr => renderRow(tr));

    /* ── View: search + filter + sort ── */
    let activeFilter = '';
    let searchQuery  = '';

    function applyView() {
        const q = searchQuery.toLowerCase().trim();

        // Sort: confirmed rows sink to bottom, rest stay on top
        const done  = rows.filter(r => getState(r.dataset.phone).status === 'sudah_konfirm');
        const other = rows.filter(r => getState(r.dataset.phone).status !== 'sudah_konfirm');
        [...other, ...done].forEach(r => tbody.appendChild(r));

        // Show / hide
        let visible = 0;
        [...other, ...done].forEach(r => {
            const nameMatch   = !q || r.querySelector('.td-name').textContent.toLowerCase().includes(q);
            const statusMatch = !activeFilter || getState(r.dataset.phone).status === activeFilter;
            r.style.display   = (nameMatch && statusMatch) ? '' : 'none';
            if (nameMatch && statusMatch) visible++;
        });

        // Empty state
        tbody.querySelector('.no-results-row')?.remove();
        if (visible === 0) {
            const empty = document.createElement('tr');
            empty.className = 'no-results-row';
            empty.innerHTML = `<td colspan="7">Tidak ada mitra yang cocok.</td>`;
            tbody.appendChild(empty);
        }
    }

    /* ── Stats (calls applyView at end) ── */
    function updateStats() {
        const st = ph => getState(ph).status;
        const count = s => rows.filter(r => st(r.dataset.phone) === s).length;

        document.getElementById('stat-total').textContent   = rows.length;
        document.getElementById('stat-selesai').textContent = count('sudah_konfirm');
        document.getElementById('stat-pending').textContent = count('menunggu');

        document.getElementById('sc-total').textContent    = rows.length;
        document.getElementById('sc-belum').textContent    = count('belum');
        document.getElementById('sc-selesai').textContent  = count('sudah_konfirm');
        document.getElementById('sc-proses').textContent   = count('menunggu');
        document.getElementById('sc-web').textContent      = count('error_web');
        document.getElementById('sc-verif').textContent    = count('perlu_verif');
        document.getElementById('sc-tolak').textContent    = count('tolak');

        applyView();
    }

    updateStats();

    /* ── Search input ── */
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        searchClear.classList.toggle('visible', searchQuery.length > 0);
        applyView();
    });
    searchClear.addEventListener('click', () => {
        searchInput.value = ''; searchQuery = '';
        searchClear.classList.remove('visible');
        searchInput.focus(); applyView();
    });

    /* ── Filter pills ── */
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            applyView();
        });
    });

    /* ── Tandai Semua Dihubungi ── */
    document.getElementById('btn-all-hubungi')?.addEventListener('click', () => {
        if (!confirm('Tandai semua "Belum Dihubungi" menjadi "Menunggu Balasan"?')) return;
        rows.forEach(r => {
            if (getState(r.dataset.phone).status === 'belum') {
                setState(r.dataset.phone, { status: 'menunggu', kendala: '' });
                renderRow(r);
            }
        });
        updateStats();
    });

    /* ── Reset Semua ── */
    document.getElementById('btn-reset-all')?.addEventListener('click', () => {
        if (!confirm('Reset semua status ke "Belum Dihubungi"?')) return;
        rows.forEach(r => { localStorage.removeItem('mt_' + r.dataset.phone); renderRow(r); });
        updateStats();
    });

    /* ── Export Excel ── */
    document.getElementById('btn-export-excel')?.addEventListener('click', () => {
        const statusLabel = {
            belum:         'Belum Dihubungi',
            menunggu:      'Menunggu Balasan',
            sudah_konfirm: 'Terkonfirmasi ✓',
            perlu_verif:   'Perlu Verifikasi',
            error_web:     'Kendala Akses Web',
            tolak:         'Tawaran Belum Muncul',
        };
        const kendalaLabel = {
            '':           'Tidak Ada',
            perlu_verif:  'Perlu Verifikasi',
            error_web:    'Belum Bisa Akses Web',
            tolak:        'Tawaran Belum Muncul di Sobat',
        };

        // Header row
        const wsData = [
            ['No', 'Nama Mitra', 'Nomor HP', 'Status', 'Kendala']
        ];

        // Data rows
        rows.forEach((tr, i) => {
            const phone  = tr.dataset.phone;
            const name   = tr.querySelector('.td-name').textContent.trim();
            const state  = getState(phone);
            const phone_display = formatPhone(phone);
            wsData.push([
                i + 1,
                name,
                phone_display,
                statusLabel[state.status] || state.status,
                kendalaLabel[state.kendala] || state.kendala || 'Tidak Ada',
            ]);
        });

        // Buat workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Lebar kolom otomatis
        ws['!cols'] = [
            { wch: 5 },   // No
            { wch: 28 },  // Nama
            { wch: 20 },  // Nomor HP
            { wch: 22 },  // Status
            { wch: 30 },  // Kendala
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Mitra SE 2026');

        // Nama file pakai tanggal hari ini
        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `Mitra_SE2026_${today}.xlsx`);
    });
});
