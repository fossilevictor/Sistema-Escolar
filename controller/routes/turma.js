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
        const { curso_id,nome,modulo,ano_semetre,turno,sala, } = req.body;

        if ( modulo == ''|| undefined) {
            res.status(401).json({ erro: ' modulo inesistente'});
            return;
        }

        try{
                if (curso_id === '' || curso_id === undefined) {
                    res.status(401).json({ erro: 'curso inexistente' });
                    return;
                } else {    
                    const [profRows] = await db.execute('SELECT * FROM curso WHERE curso_id = ?', [curso_id]);
                    if (profRows.length === 0) {
                        return res.status(402).json({ erro: 'Curso não encontrado' });
                    }
                }
            const [result] = await db.execute(
                        'INSERT INTO turma (curso_id, nome, modulo, ano_semetre, turno, sala) VALUES (?,?,?,?,?,?)',
                        [curso_id, nome, modulo, ano_semetre, turno, sala,]
                        );

            if(curso_id == '' || undefined){
                res.status(402).json({ erro: ' curso inesistente'});
                return;
            }
           res.status(201).json({ id: result.insertId,curso_id,nome,modulo,ano_semetre,turno,sala,});
            }catch (err){
                res.status(500).json({ erro: err.message});
            }
         
    });
    //READ TODOS
    router.get('/',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM turma');
        res.json(rows);
    });
    //READ POR ID 
    router.get('/id/:turma_id',async (req,res) =>{
         const[rows] = await db.execute('SELECT* FROM turma WHERE turma_id =?', [req.params.turma_id] );
        if(rows.length === 0)
        return res.status(404).json({erro:'turma não encontrada'});
        res.json(rows[0]);
   });

     //READ POR curso
     router.get('/curso/:curso_id',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM turma WHERE curso_id =?', [req.params.curso_id] );
       if(rows.length === 0)
       return res.status(404).json({erro:'fessor não encontrada'});
       res.json(rows[0]);
  });


      //READ POR ano 
      router.get('/semetre/:ano_semetre',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM turma WHERE ano_semetre =?', [req.params.ano_semetre] );
       if(rows.length === 0)
       return res.status(404).json({erro:'ano não encontrada'});
       res.json(rows);
  });

     //READ POR turno
     router.get('/turno/:turno',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM turma WHERE turno =?', [req.params.turno] );
       if(rows.length === 0)
       return res.status(404).json({erro:'turno não encontrada'});
       res.json(rows);
  });


        //READ POR nome 
     router.get('/nome/:nome',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM turma WHERE nome =?', [req.params.nome] );
       if(rows.length === 0)
       return res.status(404).json({erro:'nome não encontrada'});
       res.json(rows);
  });


   //READ POR sala 
   router.get('/sala/:sala',async (req,res) =>{
    const[rows] = await db.execute('SELECT* FROM turma WHERE sala =?', [req.params.sala] );
   if(rows.length === 0)
   return res.status(404).json({erro:'sala não encontrada'});
   res.json(rows);
});



   //UPDATE 
    router.put('/id/:turma_id', async (req, res) => {
    const { curso_id, nome, modulo, ano_semetre, turno, sala,  } = req.body;

    if (modulo === '' || modulo === undefined) {
        res.status(401).json({ erro: 'modulo inexistente' });
        return;
    }

    try {
        if (curso_id === '' || curso_id === undefined) {
            res.status(401).json({ erro: 'curso inexistente' });
            return;
        } else {
            const [profRows] = await db.execute('SELECT * FROM curso WHERE curso_id = ?', [curso_id]);
            if (profRows.length === 0) {
                return res.status(402).json({ erro: 'Curso não encontrado' });
            }
        }

        await db.execute(
            'UPDATE turma SET curso_id = ?, nome = ?, modulo = ?, ano_semetre = ?, turno = ?, sala = ? WHERE turma_id = ?',
            [curso_id, nome, modulo, ano_semetre, turno, sala, , req.params.turma_id]
        );

        res.json({ message: 'turma atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});




   //DELETE
   router.delete('/id/:turma_id',async (req,res) =>{
       try{
       
           await db.execute(
               'DELETE FROM turma WHERE turma_id =?',[req.params.turma_id]);
           res.json({messagem: 'turma removida com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });
   export default router;   