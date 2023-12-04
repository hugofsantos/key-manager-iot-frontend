import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useSocketIo } from '../../network/websocket';


const CadastroProfessor = () => {
  const [teacher, setTeacher] = useState({
    nome: '',
    matricula: '',
  });
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Recebe dados do servidor
    const socket = useSocketIo('');
    
    socket.on('cadastrar', data => {
      setUid(data);
    });
    
    // // Limpa o listener quando o componente é desmontado
    return () => {
      socket.off('cadastrar');
    };
  }, []);  

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try{
      const resposta = await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/professor`, 
        { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Definir o cabeçalho Content-Type como application/json
          },
          body: JSON.stringify({...teacher, uid}) // Converter o objeto teacher em uma string JSON
        });

      if(!resposta.ok) {
        const erroRespota = await resposta.json();

        throw erroRespota;
      }

      setTeacher({
        nome: '',
        matricula: '',
      });
      setUid('');
      setSuccess('Professor cadastrado com sucesso!');        
    }catch (error){
      setError(error.message || 'Aconteceu algum erro no cadastro do professor');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container-fluid">
      <h2 className="mt-5">Cadastro de Professores</h2>
      <div className="form-group mt-5">
        <label htmlFor="nome">Nome completo:</label>
        <input
          type="text"
          className="form-control"
          id="nome"
          name="nome"
          placeholder="Informe o nome completo"
          required
          value={teacher.nome}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-5">
        <label htmlFor="matricula">Matrícula:</label>
        <input
          type="text"
          className="form-control"
          id="matricula"
          name="matricula"
          placeholder="Informe a matrícula"
          required
          value={teacher.matricula}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-5">
        <label htmlFor="uid">UID:</label>
        <input
          type="text"
          className="form-control"
          id="uid"
          name="uid"
          required
          disabled
          placeholder="Aproxime o RFID do leitor"
          value={uid}
          //onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-5">Cadastrar</button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </form>
  );
};

export default CadastroProfessor;