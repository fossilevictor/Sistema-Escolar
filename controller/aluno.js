// controller/aluno.js
// Frontend controller for Aluno CRUD: create, read, update, delete, search

// Capture id if present (?id=)
const paramsAluno = new URLSearchParams(window.location.search);
const idAluno = paramsAluno.get('id');
if (idAluno) 
    carregarAluno(idAluno);

// Safe helpers
function getValue(id) {
     const el = document.getElementById(id);
     return el ? el.value : ''; 
    }
function setValueIfExists(id, value) { 
    const el = document.getElementById(id); 
    if (el) el.value = value || ''; 
}

document.addEventListener('DOMContentLoaded', () => {
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if (idAluno) {
            botaoSalvar.addEventListener('click', () => atualizaAluno(idAluno));
        } else {
            botaoSalvar.addEventListener('click', inserirRegistro);
        }
    }

    const botaoBuscar = document.getElementById('procurar');
    if (botaoBuscar) {
        botaoBuscar.addEventListener('click', (e) => { e.preventDefault(); buscarNome(); });
    }

    const containerResultado = document.getElementById('resultado');
    if (containerResultado) {
        containerResultado.addEventListener('click', (event) => {
            const target = event.target.closest('[data-delete-id]');
            if (target) {
                const id = target.dataset.deleteId;
                confirmarExclusao(id);
            }
        });
        // Carrega lista inicial
        buscarNome();
    }
});

    async function inserirRegistro(){ 
    const matricula = getValue('matricula');
    const nome = getValue('nome');
    const sobrenome = getValue('sobrenome');
    const data_nascimento = getValue('data_nascimento');
    const sexo = getValue('sexo');
    const cpf = getValue('cpf');
    const situacao = getValue('situacao');
    const email = getValue('email');
    const telefone = getValue('telefone');
    const rua = getValue('rua');
    const numero = getValue('numero');
    const complemento = getValue('complemento');
    const bairro = getValue('bairro');
    const cidade = getValue('cidade');
    const estado = getValue('estado');
    const data_ingresso = getValue('data_ingresso');

    if (!nome) { alert('Preencha o nome do aluno'); return; }

    // Build payload expected by the backend (nome, data_nascimento, email, telefone, endereco)
    try {
        const response = await fetch('http://localhost:3000/aluno/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                matricula: matricula, 
                nome: nome,
                sobrenome:sobrenome,
                data_nascimento: data_nascimento,
                sexo: sexo,
                cpf: cpf,
                situacao: situacao, 
                email: email,
                telefone: telefone,
                rua: rua,
                numero:numero,
                complemento:complemento,
                bairro:bairro,
                cidade:cidade,
                estado:estado,
                data_ingresso:data_ingresso})
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(`❌ Erro ao salvar os dados (status ${response.status}) - ${data.erro || data.mensagem || ''}`);
            return;
        }
        alert('✅ Aluno criado com sucesso!');
        // Clear form
        setValueIfExists('nome', ''); 
        setValueIfExists('sobrenome', ''); 
        setValueIfExists('data_nascimento', ''); 
        setValueIfExists('cpf', '');
        setValueIfExists('situacao', '');
        setValueIfExists('email', ''); 
        setValueIfExists('telefone', '');
        setValueIfExists('rua', ''); 
        setValueIfExists('numero', ''); 
        setValueIfExists('complemento', ''); 
        setValueIfExists('bairro', ''); 
        setValueIfExists('cidade', ''); 
        setValueIfExists('estado', '');
        const container = document.getElementById('resultado'); 
        if (container) buscarNome();
    } catch (err) {
        alert(`Falha ao conectar a API: ${err}`);
    }
}

async function carregarAluno(id) {
    try {
        const response = await fetch(`http://localhost:3000/aluno/id/${id}`);
        if (!response.ok) {
             alert('Aluno não encontrado'); 
            return;
     }
        const a = await response.json();
        setValueIfExists('aluno_id',a.aluno_id);
        setValueIfExists('matricula', a.matricula || '');   
        setValueIfExists('nome', a.nome || '');
        setValueIfExists('sobrenome', a.sobrenome || '');
        setValueIfExists('data_nascimento', a.data_nascimento || '');
        setValueIfExists('sexo', a.sexo || '');
        setValueIfExists('cpf', a.cpf || '');
        setValueIfExists('situacao', a.situacao || '');
        setValueIfExists('email', a.email || '');
        setValueIfExists('telefone', a.telefone || '');
        setValueIfExists('rua',a.rua || '');
        setValueIfExists('numero',a.numero || '');
        setValueIfExists('complemento',a.complemento || '');
        setValueIfExists('bairro',a.bairro || '');
        setValueIfExists('cidade',a.cidade || '');
        setValueIfExists('estado',a.estado || '');
        setValueIfExists('data_ingresso',a.data_ingresso || '');
    } catch (err) {
        alert(`Erro ao carregar aluno: ${err}`);
    }
}

async function atualizaAluno(id) {
    const matricula = getValue('matricula');
     const nome = getValue('nome');
    const sobrenome = getValue('sobrenome');
    const data_nascimento = getValue('data_nascimento');
    const sexo = getValue('sexo');
    const cpf = getValue('cpf');
    const situacao = getValue('situacao');
    const email = getValue('email');
    const telefone = getValue('telefone');
    const rua = getValue('rua');
    const numero = getValue('numero');
    const complemento = getValue('complemento');
    const bairro = getValue('bairro');
    const cidade = getValue('cidade');
    const estado = getValue('estado');
    const data_ingresso = getValue('data_ingresso');

    if (!nome) {
        alert('Informe o nome do aluno'); 
        return; 
    }

    try {
        const response = await fetch(`http://localhost:3000/aluno/id/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                matricula:matricula,
                nome:nome,
                sobrenome:sobrenome,
                data_nascimento: data_nascimento,
                sexo: sexo,
                cpf: cpf,
                situacao: situacao, 
                email:email,
                telefone: telefone,
                rua: rua,
                numero:numero,
                complemento:complemento,
                bairro:bairro,
                cidade:cidade,
                estado:estado,
                data_ingresso:data_ingresso })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) { 
            alert(`❌ Erro ao atualizar (status ${response.status}) - ${data.erro || data.mensagem || ''}`); 
            return; 
        }
        alert('✅ Aluno atualizado com sucesso!');
    } catch (err) { alert(`Falha ao conectar a API: ${err}`); }
}

async function confirmarExclusao(id) {
    const confirmacao = confirm('Deseja realmente excluir aluno ' + id + '?');
    if (!confirmacao) return;
    try {
        const response = await fetch(`http://localhost:3000/aluno/id/${id}`,
            { 
                method: 'DELETE', headers: { 'Content-Type': 'application/json' } 
            });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
             alert(`Erro ao excluir: ${data.erro || data.mensagem || ''}`); return; 
            }
        alert(data.messagem || 'Aluno excluído com sucesso');
        const container = document.getElementById('resultado'); 
        if (container) buscarNome();
    } catch (err) { alert(`Falha ao conectar a API: ${err}`); }
}

async function buscarNome() {
    const nome = getValue('nome');
    const container = document.getElementById('resultado');
    if (!container) 
        return;
    try {
        const response = await fetch('http://localhost:3000/aluno/');
        const registros = await response.json();
        if (!Array.isArray(registros) || registros.length === 0) {
             container.innerHTML = '<p>Nenhum registro encontrado</p>';
             return; }
        // filter by name if provided
        const filtrados = nome ? registros.filter(r => r.nome && r.nome.toLowerCase().includes(nome.toLowerCase())) : registros;
        if (filtrados.length === 0) { 
            container.innerHTML = '<p>Nenhum registro encontrado</p>'; 
            return; 
        }
        const tabela = `
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr>
                        <th>Código</th>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>Data de Nascimento</th>
                        <th>Sexo</th>
                        <th>CPF</th>
                        <th>Situação</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Rua</th>
                        <th>Número</th>
                        <th>Complemento</th>
                        <th>Bairro</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Data de Ingresso</th>
                        <th>Ações</th>
                    </tr></thead>
                    <tbody>
                        ${filtrados.map(r => `
                            <tr>
                                <td><a href="cadastro_aluno.html?id=${r.aluno_id}" class="btn-link">${r.aluno_id}</a></td>
                                <td>${r.matricula || ''}</td>
                                <td>${r.nome || ''}</td>
                                <td>${r.sobrenome || ''}</td>
                                <td>${r.data_nascimento ? (new Date(r.data_nascimento)).toLocaleDateString() : ''}</td>
                                <td>${r.sexo || ''}</td>
                                <td>${r.cpf || ''}</td>
                                <td>${r.situacao || ''}</td>
                                <td>${r.email || ''}</td>
                                <td>${r.telefone || ''}</td>
                                <td>${r.rua || ''}</td>
                                <td>${r.numero || ''}</td>
                                <td>${r.complemento || ''}</td>
                                <td>${r.bairro || ''}</td>
                                <td>${r.cidade || ''}</td>
                                <td>${r.estado || ''}</td>
                                <td>${r.data_ingresso ? (new Date(r.data_ingresso)).toLocaleDateString() : ''}</td>
                                <td class="action-cell">
                                    <a href="cadastro_aluno.html?id=${r.aluno_id}" class="btn-link">✏</a>
                                    <button type="button" data-delete-id="${r.aluno_id}" class="btn-icon">🗑</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        container.innerHTML = tabela;
    } catch (err) { alert(`Falha ao conectar a API: ${err}`); }
}
