// controller/curso.js
// Frontend controller for Curso CRUD

// Capture id if present (?id=)
const paramsCurso = new URLSearchParams(window.location.search);
const idCurso = paramsCurso.get('id');
if (idCurso) carregarCurso(idCurso);

// Safe helpers
function getValue(id) { 
    const el = document.getElementById(id); return el ? el.value : ''; 
}
function setValueIfExists(id, value) {
     const el = document.getElementById(id); if (el) el.value = value || ''; 
}

document.addEventListener('DOMContentLoaded', () => {
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if (idCurso) 
            botaoSalvar.addEventListener('click', () => atualizaCurso(idCurso));
        else botaoSalvar.addEventListener('click', inserirRegistro);
    }
      
    const botaoBuscar = document.getElementById('procurar') || document.getElementById('procurar');
    if (botaoBuscar) 
        botaoBuscar.addEventListener('click', (e) => { e.preventDefault(); buscarNome(); });

    const container = document.getElementById('resultado');
    if (container) {
        container.addEventListener('click', (e) => {
            const target = e.target.closest('[data-delete-id]');
            if (target) confirmarExclusao(target.dataset.deleteId);
        });
        buscarNome();
    }
});

async function inserirRegistro() {
    const nome = getValue('nome');
    const descricao = getValue('descricao');
    const duracao = getValue('duracao');
    const status = getValue('status');
    const data_criacao = getValue('data_criacao');
    if (!nome) {
         alert('Informe o nome do curso'); 
         return; 
    }
    try {
        const resp = await fetch('http://localhost:3000/curso/', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nome: nome, 
                descricao: descricao, 
                duracao: duracao, 
                status: status, 
                data_criacao: data_criacao 
            })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) { 
            alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
            return; 
        }
        alert('✅ Curso criado com sucesso');
        setValueIfExists('nome', ''); 
        setValueIfExists('descricao', ''); 
        setValueIfExists('duracao', ''); 
        setValueIfExists('status', ''); 
        setValueIfExists('data_criacao', '');
        const container = document.getElementById('resultado'); 
        if (container) 
            buscarNome();
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}

async function carregarCurso(id) {
    try {
        const resp = await fetch(`http://localhost:3000/curso/id/${id}`);
        if (!resp.ok) { 
            alert('Curso não encontrado'); 
            return; 
        }
        const c = await resp.json();
        const curso = Array.isArray(c) ? c[0] : c; // handle either array or object
        setValueIfExists('curso_id', curso.curso_id);
        setValueIfExists('nome', curso.nome_curso || curso.nome || '');
        setValueIfExists('descricao', curso.descricao || '');
        setValueIfExists('duracao', curso.duracao || '');
        setValueIfExists('status', curso.status || '');
        setValueIfExists('data_criacao', curso.data_criacao ? curso.data_criacao.split('T')[0] : '');
    } catch (err) { 
        alert('Erro ao carregar curso: ' + err); 
    }
}

async function atualizaCurso(id) {
    const nome = getValue('nome');
    const descricao = getValue('descricao');
    const duracao = getValue('duracao');
    const status = getValue('status');
    const data_criacao = getValue('data_criacao');
    if (!nome) { 
        alert('Informe o nome do curso'); 
        return; 
    }
    try {
        const resp = await fetch(`http://localhost:3000/curso/id/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nome: nome, 
                descricao: descricao, 
                duracao: duracao, 
                status: status, 
                data_criacao:data_criacao 
            })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) { 
            alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
            return; 
        }
        alert('✅ Curso atualizado com sucesso');
        const container = document.getElementById('resultado'); 
        if (container)
             buscarNome();
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}

async function confirmarExclusao(id) {
    if (!confirm('Deseja realmente excluir este curso?')) return;
    try {
        const resp = await fetch(`http://localhost:3000/curso/id/${id}`, 
            { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) { 
            alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
            return; 
        }
        alert('✅ Curso removido com sucesso');
        const container = document.getElementById('resultado'); 
        if (container) 
            buscarNome();
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}

async function buscarNome() {
    const nome = getValue('filtroCurso') || getValue('nome');
    const container = document.getElementById('resultado');
    if (!container) 
        return;
    try {
        const resp = await fetch('http://localhost:3000/curso/');
        const registros = await resp.json();
        // route may return rows array or rows[0] — normalize
        const arr = Array.isArray(registros) ? registros : (registros ? [registros] : []);
        if (!Array.isArray(arr) || arr.length === 0) { 
            container.innerHTML = '<p>Nenhum registro encontrado</p>'; 
            return; 
        }
        const filtrados = nome ? arr.filter(r => (r.nome_curso || r.nome || '').toLowerCase().includes(nome.toLowerCase())) : arr;
        if (filtrados.length === 0) { 
            container.innerHTML = '<p>Nenhum registro encontrado</p>'; 
            return; 
        }
        const tabela = `
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>Código</th><th>Nome</th><th>Descrição</th><th>Duração</th><th>Status</th><th>Data de Criação</th><th>Ações</th></tr></thead>
                    <tbody>
                        ${filtrados.map(r => `
                            <tr>
                                <td><a href="cadastro_curso.html?id=${r.curso_id}" class="btn-link">${r.curso_id}</a></td>
                                <td>${r.nome_curso || r.nome || ''}</td>
                                <td>${r.descricao || ''}</td>
                                <td>${r.duracao || ''}</td>
                                <td>${r.status || ''}</td>
                                <td>${r.data_criacao ? (new Date(r.data_criacao)).toLocaleDateString() : ''}</td>
                                <td class="action-cell"><a href="cadastro_curso.html?id=${r.curso_id}">✏</a> <button data-delete-id="${r.curso_id}" class="btn-icon">🗑</button></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        container.innerHTML = tabela;
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}
