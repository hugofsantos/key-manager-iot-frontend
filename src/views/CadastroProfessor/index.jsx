import React, { useState } from 'react';

const CadastroProfessor = () => {
  const [teacher, setTeacher] = useState({
    nome: '',
    matricula: '',
    uid: ''
  });

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
      await fetch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/professor`, 
        { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Definir o cabeçalho Content-Type como application/json
          },
          body: JSON.stringify(teacher) // Converter o objeto teacher em uma string JSON
        },

        setTeacher({
          nome: '',
          matricula: '',
          uid: ''
        })
      );
    }catch (error){
      console.error(error.message); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container-fluid">
      <div className="form-group">
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
          //disabled
          placeholder="Aproxime o RFID do leitor"
          value={teacher.uid}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-5">Cadastrar</button>
    </form>
  );
};

export default CadastroProfessor;