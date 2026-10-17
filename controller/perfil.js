// perfil.js
// Função simples que, ao clicar no botão #perfil, busca os dados do usuário logado
// via API (/usuario/id/:id) e mostra um modal com as informações.

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('perfil');
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); carregarPerfil(); });
});

async function carregarPerfil(id) {
    try {
        // obtém id do parâmetro ou do localStorage
        let usuarioId = id;
        if (!usuarioId) {
            const raw = localStorage.getItem('usuario');
            if (!raw) {
                alert('Nenhum usuário autenticado. Faça login primeiro.');
                window.location.href = 'login.html';
                return;
            }
            try { usuarioId = JSON.parse(raw).usuario_id; } catch (e) { console.warn('localStorage.usuario inválido', e); }
        }

        if (!usuarioId) {
            alert('ID do usuário não encontrado.');
            return;
        }

        const resp = await fetch(`http://localhost:3000/usuario/id/${usuarioId}`);
        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Erro ao buscar usuário: ${resp.status} ${txt}`);
        }

        const usuario = await resp.json();
        showPerfilModal(usuario);

    } catch (err) {
        alert(`Deu não man: ${err.message || err}`);
    }
}

function showPerfilModal(usuario) {
    // remove modal anterior se existir
    const existing = document.getElementById('perfil-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'perfil-modal';
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#111',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        zIndex: 10000,
        minWidth: '260px',
        maxWidth: '90vw'
    });

    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <strong>
            Perfil
            </strong>
            <button id="perfil-close"
             style="background:transparent;
             border:none;
             color:#ccc;
             font-size:18px
             ;cursor:pointer">
             ✕</button>
        </div>
        <div style="margin-bottom:6px"><strong>${escapeHtml(usuario.nome || '')}</strong></div>
        <div style="font-size:.95rem; opacity:.9">${escapeHtml(usuario.email || '')}</div>
        <div style="margin-top:8px; font-size:.9rem">Data de nascimento: ${escapeHtml(usuario.data_nascimento || '')}</div>
        <div style="font-size:.9rem">Sexo: ${escapeHtml(usuario.sexo || '')}</div>
        <div style="font-size:.9rem">Perfil: ${escapeHtml(usuario.perfil || '')}</div>
        <div style="font-size:.9rem">Status: ${escapeHtml(usuario.status || '')}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
            <button id="perfil-change-senha" style="background:#2980b9;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">Alterar Senha</button>
            <button id="perfil-logout" style="background:#c0392b;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">Sair</button>
            <button id="perfil-ok" style="background:#333;color:#ddd;border:1px solid #444;padding:8px 12px;border-radius:6px;cursor:pointer">Fechar</button>
        </div>`;

    document.body.appendChild(modal);

    document.getElementById('perfil-close').addEventListener('click', () => modal.remove());
    document.getElementById('perfil-ok').addEventListener('click', () => modal.remove());
    document.getElementById('perfil-logout').addEventListener('click', () => {
        localStorage.removeItem('usuario');
        modal.remove();
        window.location.href = 'login.html';
    });

    // abrir formulário de alteração de senha quando solicitado
    document.getElementById('perfil-change-senha').addEventListener('click', () => {
        showChangePasswordForm(modal, usuario.usuario_id);
    });

    // fecha com ESC
    const escHandler = (ev) => { if (ev.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);
}

function escapeHtml(str){
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Mostra um pequeno formulário dentro do modal para alterar a senha
function showChangePasswordForm(modal, usuarioId) {
    // remove formulário anterior se existir
    const existing = document.getElementById('perfil-change-area');
    if (existing) existing.remove();

    const formHtml = `
        <div id="perfil-change-area" style="margin-top:12px;">
            <label style="display:block;margin-bottom:6px">Nova senha:<br><input id="perfil-nova-senha" type="password" style="width:100%;padding:6px;margin-top:4px"></label>
            <label style="display:block;margin-bottom:6px">Confirme senha:<br><input id="perfil-conf-senha" type="password" style="width:100%;padding:6px;margin-top:4px"></label>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
                <button id="perfil-cancel-change" style="background:#666;color:#fff;border:none;padding:8px 10px;border-radius:6px;cursor:pointer">Cancelar</button>
                <button id="perfil-save-change" style="background:#27ae60;color:#fff;border:none;padding:8px 10px;border-radius:6px;cursor:pointer">Salvar</button>
            </div>
        </div>`;

    const container = document.createElement('div');
    container.innerHTML = formHtml;
    modal.appendChild(container);

    document.getElementById('perfil-cancel-change').addEventListener('click', () => {
        const el = document.getElementById('perfil-change-area');
        if (el) el.remove();
    });

    document.getElementById('perfil-save-change').addEventListener('click', async () => {
        const nova = document.getElementById('perfil-nova-senha').value;
        const conf = document.getElementById('perfil-conf-senha').value;
        if (!nova) { alert('Informe a nova senha'); return; }
        if (nova !== conf) { alert('As senhas não coincidem'); return; }

        try {
            const resp = await fetch(`http://localhost:3000/usuario/senha/${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha: nova })
            });
            const data = await resp.json().catch(() => ({}));
            if (resp.ok) {
                alert(data.mensagem || 'Senha alterada com sucesso');
                const el = document.getElementById('perfil-change-area');
                if (el) el.remove();
            } else {
                alert(data.mensagem || `Erro ao alterar senha (status ${resp.status})`);
            }
        } catch (err) {
            alert('Falha ao conectar a API: ' + err);
        }
    });
}