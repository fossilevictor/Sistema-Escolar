// controller/disciplina.js
// Frontend controller for creating, updating, searching and deleting Disciplinas

// Captura id (se a página foi aberta com ?id=)
const paramsDisc = new URLSearchParams(window.location.search);
const idDisc = paramsDisc.get('id');
if (idDisc) carregarDisciplina(idDisc);

// Helper functions to safely get/set input values (prevents null access errors)
/*function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}
function setValueIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}
*/
document.addEventListener('DOMContentLoaded', () => {
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if (idDisc) {
            botaoSalvar.addEventListener('click', () => atualizaDisc(idDisc));
        } else {
            botaoSalvar.addEventListener('click', inserirRegistro);
        }
    }

    const botaoBuscar = document.getElementById('procurar');
    if (botaoBuscar) {
        botaoBuscar.addEventListener('click', buscarNome);
    }

    const containerResultado = document.getElementById('resultado');
    if (containerResultado) {
        containerResultado.addEventListener('click', (event) => {
            const target = event.target.closest('[data-delete-id]');
            if (target) {
                const disciplinaId = target.dataset.deleteId;
                confirmarExclusao(disciplinaId);
            }
        });
        // Carrega lista inicial caso exista
        buscarNome();
    }
});

async function inserirRegistro() {
    const nome = document.getElementById('nome').value;
    const carga_hora = document.getElementById('carga_hora').value;
    const ementa = document.getElementById('ementa').value;
    const modulo = document.getElementById('modulo').value;

    if (!nome || !carga_hora || !modulo) {
        alert('Preencha os campos obrigatórios: Nome, Carga Horária, Módulo');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/disciplina/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome_disciplina: nome,
                carga_horaria: carga_hora,
                ementa: ementa,
                modulo: modulo
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(`❌ Erro ao salvar os dados (status ${response.status}) - ${data.erro || data.mensagem || ''}`);
            return;
        }
        alert('✅ Disciplina criada com sucesso!');
        // se houver lista, recarrega
        const container = document.getElementById('resultado');
        if (container) buscarNome();
        // limpa form
        document.getElementById('nome').value = '';
        document.getElementById('carga_hora').value = '';
        document.getElementById('ementa').value = '';
        document.getElementById('modulo').value = '';
    } catch (error) {
        alert(`Falha ao conectar a API: ${error}`);
    }
}

async function carregarDisciplina(id) {
    try {
        const response = await fetch(`http://localhost:3000/disciplina/id/${id}`);
        if (!response.ok) {
            alert('Disciplina não encontrada');
            return;
        }
        const disciplina = await response.json();
        console.log(disciplina);
        document.getElementById('disciplina_id').value = disciplina.disciplina_id;
        document.getElementById('nome').value = disciplina.nome_disciplina ;
        document.getElementById('carga_hora').value = disciplina.carga_horaria;
        document.getElementById('ementa').value = disciplina.ementa;
        document.getElementById('modulo').value = disciplina.modulo;
    } catch (err) {
        alert(`Erro ao carregar disciplina: ${err}`);
    }
}

async function atualizaDisc(id) {
    const nome = document.getElementById('nome').value;
    const carga_hora = document.getElementById('carga_hora').value;
    const ementa = document.getElementById('ementa').value;
    const modulo = document.getElementById('modulo').value;
    if (!nome || !carga_hora || !modulo) {
        alert('Preencha os campos obrigatórios: Nome, Carga Horária, Módulo');
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/disciplina/id/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome_disciplina: nome,
                carga_horaria: carga_hora,
                ementa: ementa,
                modulo: modulo
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(`❌ Erro ao atualizar (status ${response.status}) - ${data.erro || data.mensagem || ''}`);
            return;
        }
        alert('✅ Disciplina atualizada com sucesso!');
    } catch (error) {
        alert(`Falha ao conectar a API: ${error}`);
    }
}

async function confirmarExclusao(id) {
    const confirmacao = confirm('Deseja realmente excluir disciplina ' + id + '?');
    if (!confirmacao) return;
    try {
        const response = await fetch(`http://localhost:3000/disciplina/id/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(`Erro ao excluir: ${data.erro || data.mensagem || ''}`);
            return;
        }
        alert(data.messagem || 'Disciplina excluída com sucesso');
        const container = document.getElementById('resultado');
        if (container) buscarNome();
    } catch (error) {
        alert(`Falha ao conectar a API: ${error}`);
    }
}

async function buscarNome() {
    const nome = document.getElementById('filtroNome')?.value || '';
    const container = document.getElementById('resultado');
    if (!container) return; // nada a fazer se não houver um container na página
    try {
        // se houver filtro por nome, usa rota /nome/:nome_disciplina, senão busca todas
        let url = 'http://localhost:3000/disciplina/';
        if (nome) url = `http://localhost:3000/disciplina/nome/${encodeURIComponent(nome)}`;
        const response = await fetch(url);
        const registros = await response.json();
        if (!Array.isArray(registros) || registros.length === 0) {
            container.innerHTML = '<p>Nenhum registro encontrado</p>';
            return;
        }
        let tabela = `
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Carga</th>
                            <th>Módulo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${registros.map(r => `
                            <tr>
                                <td><a href="cadastro_disciplina.html?id=${r.disciplina_id}" class="btn-link">${r.disciplina_id}</a></td>
                                <td>${r.nome_disciplina}</td>
                                <td>${r.carga_horaria}</td>
                                <td>${r.modulo}</td>
                                <td class="action-cell">
                                    <a href="cadastro_disciplina.html?id=${r.disciplina_id}" title="Editar" class="btn-link">✏</a>
                                    <button type="button" data-delete-id="${r.disciplina_id}" title="Excluir" class="btn-icon">🗑</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`;
        container.innerHTML = tabela;
    } catch (err) {
        alert(`Falha ao conectar a API: ${err}`);
    }
}

