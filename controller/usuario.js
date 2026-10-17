const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if(id){
    carregarUsuario(id);
   
}


document.addEventListener('DOMContentLoaded', () => {
    const botaoSalvar = document.getElementById('botao_salvar');
    if (botaoSalvar) {
        if(id){
            botaoSalvar.addEventListener('click',()=> atualizaUsuario(id));
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
                const usuario_id = targetButton.dataset.id;
                confirmarExclusao(usuario_id);
            }
        })        
        buscarNome();

    }
    // Se estivermos na página de login, ligar o botão de salvar ao fluxo de autenticação
    const botaoLogin = document.getElementById('salv');
    if (botaoLogin) {
        botaoLogin.addEventListener('click', (e) => {
            e.preventDefault();
            usuLog();
        });
    } 
    const botaoAlterarSenha = document.getElementById('btns-salv');
    if (botaoAlterarSenha) {
        botaoAlterarSenha.addEventListener('click', (e) => {
            e.preventDefault();
            atualizaSenha();
        });
    }   
});
  
async function inserirRegistro() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const data_nascimento = document.getElementById("data_nascimento").value;
    const sexo = document.getElementById("sexo").value;
    const perfil = document.getElementById("perfil").value;
    const status = document.getElementById("status").value;

    try {
        const response = await fetch(`http://localhost:3000/usuario/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha:senha,
                    data_nascimento: data_nascimento,
                    sexo: sexo,
                    perfil: perfil,
                    status: status,
                }) 
            });
        const data = await response.json();
        if (!response.ok) {
            alert(`❌ Erro ao salvar os dados (status ${data.erro})`);
            return;
        }

        else {
            alert("✅ Dados inseridos com sucesso!");
        }

    } catch (error) {
        alert(`Falha ao conectar a API :${error}`);
    }
}

async function carregarUsuario(id){
    try{
            const response = await fetch(`http://localhost:3000/usuario/id/${id}`);
            const usuario = await response.json();

            document.getElementById("usuario_id").value = usuario.usuario_id;
            document.getElementById("nome").value = usuario.nome;
            document.getElementById("email").value = usuario.email;
            document.getElementById("senha").value;
            document.getElementById("data_nascimento").value = usuario.data_nascimento;
            document.getElementById("sexo").value = usuario.sexo;
            document.getElementById("perfil").value = usuario.perfil;
            document.getElementById("status").value = usuario.status;
          
        }
            catch(error){
            alert(`Deu não man: ${error}`);
        }
}
let usuarioId = null;

async function atualizaSenha(){
    const email = document.getElementById("emaill").value;
    let container = document.getElementById("resultado");

    try {
        const response = await fetch(`http://localhost:3000/usuario/email/${email}`);
        const usuario = await response.json();

        console.log("Resposta da API:", usuario);

        // 🔵 DETECTA AUTOMATICAMENTE SE É OBJETO OU ARRAY
        let id = null;

        if (usuario.usuario_id) {
            id = usuario.usuario_id;
        } 
        else if (Array.isArray(usuario) && usuario.length > 0 && usuario[0].id) {
            id = usuario[0].id;
        }

        // 🔴 Se não achou ID → usuário não existe
        if (id === null || id === undefined) {
            container.innerHTML = `
                <form>
                    <fieldset>
                        <p>Usuário não encontrado</p>
                    </fieldset>
                </form>`;
            return;
        }

        // 🔵 GUARDA O ID GLOBALMENTE
        usuarioId = id;
        console.log("ID encontrado:", usuarioId);

        // 🔵 Mostra o formulário
        container.innerHTML = `
            <form>
                <fieldset>
                    <legend>Alterar Senha</legend>
                    <label>Nova Senha: <input id="nova_senha" type="password"></label>
                    <label>Confirme a Senha: <input id="conf_senha" type="password"></label>
                    <button type="button" onclick="mudarSenha()">Salvar</button>
                </fieldset>
            </form>
        `;
    }
    catch(error){
        alert(`Erro: ${error}`);
    }
}

async function mudarSenha(){
    const nova_senha = document.getElementById("nova_senha").value;
    const conf_senha = document.getElementById("conf_senha").value;
    
    if (!nova_senha || !conf_senha) {
        alert('Preencha ambos os campos de senha');
        return;
    }
    
    if (nova_senha !== conf_senha) {
        alert('As senhas não conferem');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/usuario/senha/${usuarioId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senha: nova_senha
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.mensagem || 'Senha alterada com sucesso');
        } else {
            alert(data.mensagem || `Erro ao alterar senha (status ${response.status})`);
        }
    } catch (error) {
        alert(`Falha ao conectar a API: ${error}`);
    }
}

async function atualizaUsuario(id){
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const data_nascimento = document.getElementById("data_nascimento").value;
        const sexo = document.getElementById("sexo").value;
        const perfil = document.getElementById("perfil").value;
        const status = document.getElementById("status").value;



    try {
        const response = await fetch(`http://localhost:3000/usuario/usuario/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha:senha,
                    data_nascimento: data_nascimento,
                    sexo: sexo,
                    perfil: perfil,
                    status: status,
                })
            });
       
        if (!response.ok) {
           const errorData = await response.json();
            alert(`❌ Erro ao atualizar os dados (status ${response.status}): ${errorData.erro || 'Erro desconhecido'}`);
            return;
           
        } 
         const data = await response.json();

            alert("✅ Dados atualizados com sucesso!");
        
    } catch (error) {
        alert(`Falha ao conectar a API :${error}`);
    }
} 
async function confirmarExclusao(id){
    const confirmacao = confirm("Quer memo excluir "+id+"?");
    if(confirmacao){
        try{
            const response = await fetch(`http://localhost:3000/usuario/${id}`,
                {
                    method:"DELETE",
                    headers:{"Content-Type":"application/json"}
                });
                const data = await response .json();
                if(response.ok){
                            alert(data.messagem);
                            buscarNome()
                        }
        }catch(error){
            alert(`Deu não man: ${error}`);
        }
    }
}
async function buscarNome() {
    const nome = document.getElementById("filtroNomes").value;
    let container = document.getElementById("resultado");
    try {
        
        const response = await fetch(`http://localhost:3000/usuario/filtros?nome=${nome}`);
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
                        <th>email</th>
                        <th>data_nascimento</th>
                        <th>sexo</th>
                        <th>perfil</th>
                        <th>status</th>
                                  
                    </tr>
                </thead>
                <tbody>
                    ${registros.map(r => `
                        <tr>    
                            <td><a href="..\crud\cadastro_usuario.html?id=${r.usuario_id}" class="btn-link">${r.usuario_id}</a></td>
                            <td>${r.nome}</td>
                            <td>${r.email}</td>
                            <td>${r.data_nascimento}</td>
                            <td>${r.sexo}</td>
                            <td>${r.perfil}</td>
                            <td>${r.status}</td>
                            <td class="action-cell">
                                <a href="cadastro_usuario.html?id=${r.usuario_id}" title="Editar" class="btn-link" onclick=atualizaUsuario()>✏</a>
                                <button type="button" data-id="${r.usuario_id}" title="Excluir" class="btn-icon" id="bnt-excluir" onclick=confirmarExclusao(${r.usuario_id})>🗑</button>
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
async function usuLog(){
    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;
    if (!login || !senha) {
        alert('Preencha email e senha');
        return;
    }
    try{
         const response = await fetch(`http://localhost:3000/usuario/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: login,
                    senha: senha
                })
         });

         const data = await response.json();

         // DEBUG: log response for troubleshooting
         console.log('usuLog response', response.status, data);

         if (response.ok) {
             // Se o servidor retornou o objeto do usuário, salvar no localStorage
             if (data && data.usuario) {
                 try {
                     localStorage.setItem('usuario', JSON.stringify(data.usuario));
                 } catch (e) {
                     console.warn('Erro ao salvar localStorage.usuario', e);
                 }
             }

             // Login bem-sucedido — redireciona para main.html
             window.location.href = 'main.html';
             return;
         }

         // Se não foi OK, mostra mensagem retornada pelo servidor
         if (data && data.mensagem) {
             alert(data.mensagem);
         } else {
             alert('Erro ao efetuar login');
         }

    } catch(error){
        alert(`Falha ao conectar a API : ${error}`);
    }
}

