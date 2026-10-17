//trocar os nomezinhos (produtos) e seus atributos

/* i,portção de:
   -funcionalidades da biblioteca express
   -dados da conexão com banco de dados disponistos em conexão.js */
   import express from 'express';
   import db from '../../db/conexao.js';
    //definição de constante para distinguir a rota recebida na requisição
    const router = express.Router();


    //CREATE
    router.post('/',async (req,res) =>{
        const { nome_disciplina,carga_horaria,ementa,modulo } = req.body;

        if (nome_disciplina == ''|| undefined) {
            res.status(401).json({ erro: 'nome disciplina  inesistente'});
            return;
        }
        if (carga_horaria  == ''|| undefined) {
            res.status(401).json({ erro: ' carga horaria inesistente'});
            return;
        }
        if ( modulo == ''|| undefined) {
            res.status(401).json({ erro: ' modulo inesistente'});
            return;
        }

        try{
            const [result] = await db.execute(
                    'INSERT INTO disciplina (nome_disciplina, carga_horaria, ementa, modulo) VALUES (?,?,?,?)',
                    [nome_disciplina, carga_horaria, ementa, modulo]
                    );

           res.status(201).json({ id: result.insertId,nome_disciplina,carga_horaria,ementa,modulo});
            }catch (err){
                res.status(500).json({ erro: err.message});
            }
         
    });
    //READ TODOS
    router.get('/',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM disciplina');
        res.json(rows);
    });

    //READ POR nome
    router.get('/nome/:nome_disciplina',async (req,res) =>{
         const[rows] = await db.execute('SELECT* FROM disciplina WHERE nome_disciplina =?', [req.params.nome_disciplina] );
        if(rows.length === 0)
        return res.status(404).json({erro:'disciplina não encontrada'});
        res.json(rows);
   });

    //READ POR carga
    router.get('/carga/:carga_horaria',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM disciplina WHERE carga_horaria = ?', [req.params.carga_horaria] );
        if(rows.length === 0)
        return res.status(404).json({erro:'disciplina não encontrada'});
        res.json(rows);
    });

      //READ POR id
    router.get('/id/:disciplina_id',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM disciplina WHERE disciplina_id = ?', [req.params.disciplina_id] );
        if(rows.length === 0)
        return res.status(404).json({erro:'disciplina não encontrada'});
        res.json(rows[0]);
    });


   //UPDATE 
   router.put('/id/:disciplina_id',async (req,res) =>{
       const {nome_disciplina,carga_horaria,ementa,modulo} = req.body;
      
       if (nome_disciplina == ''|| undefined) {
        res.status(401).json({ erro: 'nome disciplina  inesistente'});
        return;
    }
      if (carga_horaria  == ''|| undefined) {
        res.status(401).json({ erro: ' carga horaria inesistente'});
        return;
    }
      if ( modulo == ''|| undefined) {
        res.status(401).json({ erro: ' modulo inesistente'});
        return;
    }
       try{
           await db.execute(
               'UPDATE disciplina SET nome_disciplina = ?, carga_horaria  = ?, ementa = ?, modulo = ? WHERE disciplina_id =?',
               [nome_disciplina,carga_horaria,ementa,modulo, req.params.disciplina_id]
           );
           res.json({message: 'disciplina atualizada com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }
   });
   //DELETE
   router.delete('/id/:disciplina_id',async (req,res) =>{
       try{
           await db.execute(
               'DELETE FROM disciplina WHERE disciplina_id =?',[req.params.disciplina_id]);
           res.json({messagem: 'disciplina removida com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });
   export default router;
   
   
   