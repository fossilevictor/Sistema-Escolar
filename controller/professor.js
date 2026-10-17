//capturar id da url
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if(id){
    carregarFesor(id);  
}
document.addEventListener('DOMContentLoaded', () => {
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if(id){
            botaoSalvar.addEventListener('click',()=> atualizaFesor(id));
        }
        else{
        botaoSalvar.addEventListener('click', inserirRegistro);
        }
    }

    const botaoBuscar = document.getElementById('procurar');
    if (botaoBuscar) {
        botaoBuscar.addEventListener('click', buscarNome);
    }

    // Só chama a busca inicial se estiver na página que mostra o resultado
    const containerResultado = document.getElementById("resultado");
    if (containerResultado) {
        containerResultado.addEventListener('click',(event) =>{
            const targetButton = event.target.closest('bnt-excluir');
            if(targetButton){
                const professor_id = targetButton.dataset.id;
                confirmarExclusao(professor_id);
            }
        })        
        buscarNome();
    }
});

async function inserirRegistro() {
    const nome = document.getElementById("nome").value;
    const sexo = document.getElementById("sexo").value;
    const cpf = document.getElementById("cpf").value;
    const nascimento = document.getElementById("nascimento").value;
    const status = document.getElementById("status").value;
    const formacao = document.getElementById("formacao").value;
    const emissao = document.getElementById("emissao").value;
    const observacao = document.getElementById("observacao").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const cep = document.getElementById("cep").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    try {
        const response = await fetch(`http://localhost:3000/professor/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    sexo: sexo,
                    cpf: cpf,
                    nascimento: nascimento,
                    status: status,
                    formacao: formacao,
                    emissao: emissao,
                    observacao: observacao,
                    email: email,
                    telefone: telefone,
                    cep: cep,
                    rua: rua,
                    numero: numero,
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado
                })
            });
        const data = await response.json();
        if (!response.ok) {
            alert(`❌ Erro ao salvar os dados (status ${data.status})`);
            return;
        }

        else {
            alert("✅ Dados inseridos com sucesso!");
        }

    } catch (error) {
        alert(`Falha ao conectar a API :${error}`);
    }
}



async function buscarNome() {
    const nome = document.getElementById("filtroNome").value;
    const status = document.getElementById("filtroStatus").value;
    let container = document.getElementById("resultado");
    try {
        
        const response = await fetch(`http://localhost:3000/professor/filtros?nome=${nome}&status=${status}`);
        const registros = await response.json();
        if (registros.length === 0) {
            container.innerHTML = "<p>Nenhum registro encontrado<p>";
            return;
        }
        
        // Montar o grid em HTML
        let tabela = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Telefone</th>
                        <th>E-mail</th>
                        <th>Ações</th>      
                    </tr>
                </thead>
                <tbody>
                    ${registros.map(r => `
                        <tr>
                            <td><a href="cadastro_professor.html?id=${r.professor_id}" class="btn-link">${r.professor_id}</a></td>
                            <td>${r.nome}</td>
                            <td>${r.status}</td>
                            <td>${r.telefone}</td>
                            <td>${r.email}</td>
                            <td class="action-cell">
                                <a href="cadastro_professor.html?id=${r.professor_id}" title="Editar" class="btn-link" onclick=atualizaFesor()>✏</a>
                                <button type="button" data-id="${r.professor_id}" title="Excluir" class="btn-icon" id="bnt-excluir" onclick=confirmarExclusao(${r.professor_id})>🗑</button>
                            </td>
                        </tr>`).join("")}
                </tbody>
            </table>
        </div>`;
        container.innerHTML = tabela;


    } catch (error) {
        alert(`Falha ao conectar a API : ${error}`);
    }

}

async function confirmarExclusao(id){
    const confirmacao = confirm("Quer memo excluir "+id+"?");
    if(confirmacao){
        try{
            const response = await fetch(`http://localhost:3000/professor/${id}`,
                {
                    method:"DELETE",
                    headers:{"Content-Type":"application/json"}
                });
                const data = await response .json();
                if(response.ok){
                    alert(data.messagem);
                    buscarNome();
                }
        }catch(error){
            alert(`Deu não man: ${error}`);
        }
    }
}
async function carregarFesor(){
        try{
            const response = await fetch(`http://localhost:3000/professor/${id}`);
            const professor = await response.json();

            document.getElementById("professor_id").value = professor.professor_id;
            document.getElementById("nome").value = professor.nome;
            document.getElementById("sexo").value = professor.sexo;
            document.getElementById("cpf").value = professor.cpf;
            document.getElementById("nascimento").value = professor.nascimento;
            document.getElementById("status").value = professor.status;
            document.getElementById("formacao").value = professor.formacao;
            document.getElementById("emissao").value = professor.emissao;
            document.getElementById("observacao").value = professor.observacao;
            document.getElementById("email").value = professor.email;
            document.getElementById("telefone").value = professor.telefone;
            document.getElementById("cep").value = professor.cep;
            document.getElementById("rua").value = professor.rua;
            document.getElementById("numero").value = professor.numero;
            document.getElementById("complemento").value = professor.complemento;
            document.getElementById("bairro").value = professor.bairro;
            document.getElementById("cidade").value = professor.cidade;
            document.getElementById("estado").value = professor.estado;
        }
        catch(error){
          alert(`Deu não man: ${error}`);
        }
}
async function atualizaFesor(){
    const nome = document.getElementById("nome").value;
    const sexo = document.getElementById("sexo").value;
    const cpf = document.getElementById("cpf").value;
    const nascimento = document.getElementById("nascimento").value;
    const status = document.getElementById("status").value;
    const formacao = document.getElementById("formacao").value;
    const emissao = document.getElementById("emissao").value;
    const observacao = document.getElementById("observacao").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const cep = document.getElementById("cep").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    try {
        const response = await fetch(`http://localhost:3000/professor/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    sexo: sexo,
                    cpf: cpf,
                    nascimento: nascimento,
                    status: status,
                    formacao: formacao,
                    emissao: emissao,
                    observacao: observacao,
                    email: email,
                    telefone: telefone,
                    cep: cep,
                    rua: rua,
                    numero: numero,
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado
                })
            });
        const data = await response.json();
        if (!response.ok) {
            alert(`❌ Erro ao salvar os dados (status ${data.status})`);
            return;
        }

        else {
            alert("✅ Dados inseridos com sucesso!");
        }

    } catch (error) {
        alert(`Falha ao conectar a API :${error}`);
    }
}