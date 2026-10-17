// controller/turma.js
// Frontend controller for Turma CRUD

// Capture id if present (?id=)
const paramsTurma = new URLSearchParams(window.location.search);
const idTurma = paramsTurma.get('id');
if (idTurma) 
    carregarTurma(idTurma);

// Safe helpers
function getValue(id) {
     const el = document.getElementById(id); 
     return el ? el.value : ''; 
    }
function setValueIfExists(id, value) {
     const el = document.getElementById(id);
      if (el) 
        el.value = value || ''; 
    }

// (No disciplina/professor mappings — using a 'curso' field instead)

document.addEventListener('DOMContentLoaded', () => {
    // support both id conventions: 'btn-salvar' and 'btn-salv'
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if (idTurma) 
            botaoSalvar.addEventListener('click', () => atualizaTurma(idTurma));

        else botaoSalvar.addEventListener('click', inserirRegistro);
    }

    const botaoBuscar = document.getElementById('procurar');
    if (botaoBuscar) botaoBuscar.addEventListener('click', (e) => {
         e.preventDefault(); buscarTurma(); 
        }
    );

    const container = document.getElementById('resultado');
    if (container) {
        container.addEventListener('click', (e) => {
            const target = e.target.closest('[data-delete-id]');
            if (target) confirmarExclusao(target.dataset.deleteId);
        });
    }

    // no selects to populate (we use a 'curso' text field)
    // initial load
    if (container) buscarTurma();
});

// no populate functions — the form uses an input 'curso' supplied by the user

async function inserirRegistro() {
    const curso = getValue('curso');
    // filter by name or by filter input
    const nome = getValue('filtroTurma') || getValue('nome');
    const modulo = getValue('modulo');
    const ano_semetre = getValue('ano_semetre') || getValue('ano_semestre');
    const turno = getValue('turno');
    const sala = getValue('sala');
    const status_turma = getValue('status_turma');
    if (!modulo || !nome) {
         alert('Preencha o nome e o módulo da turma'); 
         return; 
        }
    try {
        const resp = await fetch('http://localhost:3000/turma/', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                 curso_id:curso,
                 nome:nome, 
                 modulo:modulo, 
                 ano_semetre:ano_semetre, 
                 turno:turno, 
                 sala:sala, 
                 status_turma:status_turma 
                })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
             alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
             return; 
            }
        alert('✅ Turma criada com sucesso');
        // Clear form
        setValueIfExists('curso', '');
        setValueIfExists('nome', ''); 
        setValueIfExists('modulo', ''); 
        setValueIfExists('ano_semetre', ''); 
        setValueIfExists('turno', ''); 
        setValueIfExists('sala', ''); 
        setValueIfExists('status_turma', '');
        const container = document.getElementById('resultado'); 
        if (container)
             buscarTurma();
    } catch (err) { alert('Falha ao conectar a API: ' + err); }
}

async function carregarTurma(id) {
    try {
        const resp = await fetch(`http://localhost:3000/turma/id/${id}`);
        if (!resp.ok) {
             alert('Turma não encontrada'); 
             return; 
               b}
        const t = await resp.json();
        const turma = Array.isArray(t) ? t[0] : t;
        setValueIfExists('turma_id', turma.turma_id);
        setValueIfExists('curso', turma.curso || '');
        setValueIfExists('nome', turma.nome);
        setValueIfExists('modulo', turma.modulo);
        setValueIfExists('ano_semetre', turma.ano_semetre);
        setValueIfExists('turno', turma.turno);
        setValueIfExists('sala', turma.sala);
        setValueIfExists('status_turma', turma.status_turma);
    } catch (err) { 
        alert('Erro ao carregar turma: ' + err); 
    }
}

async function atualizaTurma(id) {
    const curso = getValue('curso');
    const nome = getValue('nome');
    const modulo = getValue('modulo');
    const ano_semetre = getValue('ano_semetre') || getValue('ano_semestre');
    const turno = getValue('turno');
    const sala = getValue('sala');
    const status_turma = getValue('status_turma');
    if (!nome || !modulo) {
         alert('Preencha nome e módulo'); 
         return; 
        }
    try {
        const resp = await fetch(`http://localhost:3000/turma/id/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                curso_id:curso, 
                nome:nome, 
                modulo:modulo, 
                ano_semetre:ano_semetre, 
                turno:turno, 
                sala:sala, 
                status_turma:status_turma 
            })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) { 
            alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
            return; 
        }
        alert('✅ Turma atualizada com sucesso');
        const container = document.getElementById('resultado'); 
        if (container) 
            buscarTurma();
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}

async function confirmarExclusao(id) {
    if (!confirm('Deseja realmente excluir esta turma?')) 
        return;
    try {
        const resp = await fetch(`http://localhost:3000/turma/id/${id}`, { 
            method: 'DELETE', headers: { 
                'Content-Type': 'application/json' 
            } });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) { 
            alert(data.erro || data.mensagem || `Erro: ${resp.status}`); 
            return; 
        }
        alert('✅ Turma removida com sucesso');
        const container = document.getElementById('resultado');
         if (container) 
            buscarTurma();
    } catch (err) { 
        alert('Falha ao conectar a API: ' + err); 
    }
}

async function buscarTurma() {
    const nome = getValue('filtroTurma') || getValue('nome');
    const cursoFilter = getValue('filtroCurso') || getValue('curso');
    const container = document.getElementById('resultado');
    if (!container) 
        return;
    try {
        const resp = await fetch('http://localhost:3000/turma/');
        const registros = await resp.json();
        if (!Array.isArray(registros) || registros.length === 0) { 
            container.innerHTML = '<p>Nenhuma turma encontrada</p>'; 
            return; 
        }
        const filtrados = registros.filter(r => {
            let match = true;
            if (nome) 
                match = match && r.nome && r.nome.toLowerCase().includes(nome.toLowerCase());
            if (cursoFilter) 
                match = match && r.curso && r.curso.toString().toLowerCase().includes(cursoFilter.toLowerCase());
            return match;
        });
        if (filtrados.length === 0) { 
            container.innerHTML = '<p>Nenhuma turma encontrada</p>'; 
            return; 
        }
        const tabela = `
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>ID</th>
                    <th>Curso</th>
                    <th>Nome</th>
                    <th>Módulo</th>
                    <th>Ano</th>
                    <th>Turno</th>
                    <th>Sala</th>
                    <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${filtrados.map(r => `
                            <tr>
                                <td><a href="cadastro_turma.html?id=${r.turma_id}" class="btn-link">${r.turma_id}</a></td>
                                <td>${r.curso_id || ''}</td>
                                <td>${r.nome || ''}</td>
                                <td>${r.modulo || ''}</td>
                                <td>${r.ano_semetre || ''}</td>
                                <td>${r.turno || ''}</td>
                                <td>${r.sala || ''}</td>
                                <td class="action-cell"><a href="cadastro_turma.html?id=${r.turma_id}">✏</a> 
                                <button data-delete-id="${r.turma_id}" class="btn-icon">🗑</button></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        container.innerHTML = tabela;
    } catch (err) { alert('Falha ao conectar a API: ' + err); }
}
