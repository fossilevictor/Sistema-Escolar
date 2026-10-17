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
        const { aluno_id,turma_id,data_matricula,status_matricula } = req.body;

        if (data_matricula == ''|| undefined) {
            res.status(401).json({ erro: 'data obrigatória não informada!'});
            return;
        }


        try{
            const [result] = await db.execute(
                        'INSERT INTO matricula (aluno_id, turma_id, data_matricula, status_matricula) VALUES (?,?,?,?)',
                        [aluno_id, turma_id, data_matricula, status_matricula]
                        );
            if(turma_id == ''){
                res.status(402).json({ erro: ' turma inesistente'});
                return;
            }
            if(aluno_id  == ''){
                res.status(402).json({ erro: ' aluno  inesistente'});
                return;
            }
           
           res.status(201).json({ id: result.insertId,aluno_id,turma_id,data_matricula,status_matricula});
            }catch (err){
                res.status(500).json({ erro: err.message});
            }
         
    });
    //READ TODOS
    router.get('/',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM matricula');
        res.json(rows);
    });
    //READ POR ID 
    router.get('/id/:matricula_id',async (req,res) =>{
         const[rows] = await db.execute('SELECT* FROM matricula WHERE matricula_id =?', [req.params.matricula_id] );
        if(rows.length === 0)
        return res.status(404).json({erro:'matricula não encontrada'});
        res.json(rows);
   });


     //READ POR aluno 
     router.get('/aluno/:aluno_id',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM matricula WHERE aluno_id =?', [req.params.aluno_id] );
       if(rows.length === 0)
       return res.status(404).json({erro:'aluna não encontrada'});
       res.json(rows);
  });

       //READ POR turma 
     router.get('/turma/:turma_id',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM matricula WHERE turma_id =?', [req.params.turma_id] );
       if(rows.length === 0)
       return res.status(404).json({erro:'turma não encontrada'});
       res.json(rows);
  });


      //READ POR data 
      router.get('/data/:data_matricula',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM matricula WHERE data_matricula =?', [req.params.data_matricula] );
       if(rows.length === 0)
       return res.status(404).json({erro:'data não encontrada'});
       res.json(rows);
  });


     //READ POR status 
     router.get('/status/:status_matricula',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM matricula WHERE status_matricula =?', [req.params.status_matricula] );
       if(rows.length === 0)
       return res.status(404).json({erro:'status não encontrada'});
       res.json(rows);
  });


   //UPDATE 
   router.put('/id/:matricula_id',async (req,res) =>{
       const {aluno_id,turma_id,data_matricula,status_matricula} = req.body;
      
       if (data_matricula == ''|| undefined) {
        res.status(401).json({ erro: 'data obrigatória não informada!'});
        return;
    } 
       try{
              /*  if ( aluno_id == ''|| undefined) {
                    res.status(401).json({ erro: ' aluno inesistente'});
                    return;
                } else{
                    [rows] = await db.execute('SELECT* FROM aluno WHERE aluno_id =?', [aluno_id] );
                    if(rows.length === 0)
                    return res.status(402).json({erro:'aluno não encontrada'});
                }


                if ( turma_id == ''|| undefined) {
                    res.status(401).json({ erro: ' turma inesistente'});
                    return;
                } else{
                    [rows] = await db.execute('SELECT* FROM turma WHERE turma_id =?', [turma_id] );
                    if(rows.length === 0)
                    return res.status(402).json({erro:'turma não encontrada'});
                }
                    */
           await db.execute(
               'UPDATE matricula SET aluno_id = ?, turma_id  = ?, data_matricula = ?, status_matricula = ? WHERE matricula_id =?',
              [aluno_id, turma_id, data_matricula, status_matricula, req.params.matricula_id]
           );
           res.json({message: 'matricula atualizada com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }
   });
   //DELETE
   router.delete('/id/:matricula_id',async (req,res) =>{
       try{

           await db.execute(
               'DELETE FROM matricula WHERE matricula_id =?',[req.params.matricula_id]);
           res.json({messagem: 'matricula removida com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });
   export default router;
   
   
   