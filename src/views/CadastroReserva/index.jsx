import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

//import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

const CadastroReserva = () => {
  const [formData, setFormData] = useState({
    professor: '',
    start: '',
    dates: [],
    end: '',
    room: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/professor`
      );
      const data = await response.json();
      setProfessors(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleDateChange = (dates) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dates: [...dates]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const [horaInicial, minutoInicial] = formData.start.split(':');
      const [horaFinal, minutoFinal] = formData.end.split(':');

      const horarioInicial = new Date(0, 0, 0, Number(horaInicial), Number(minutoInicial)).getTime();
      const horarioFinal = new Date(0, 0, 0, Number(horaFinal), Number(minutoFinal)).getTime();


      if (horarioInicial >= horarioFinal) {
        setError('O horário final deve ser menor que o horário inicial');
        setSuccess('');
        return;
      }

      if (!formData.dates.length) {
        setError('Selecione pelo menos uma data');
        setSuccess('');
        return;
      }

      const reserva = {
        professor: formData.professor,
        datas: formData.dates.map((date) => date.toLocaleDateString('pt-BR')),
        horarioInicial,
        horarioFinal,
        sala: formData.room
      };

      const resposta = await fetch(
        `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/reserva`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Definir o cabeçalho Content-Type como application/json
          },
          body: JSON.stringify(reserva)
        }
      );

      if(!resposta.ok) {
        const erroResposta = await resposta.json();

        throw erroResposta;
      }

      setError('');
      setSuccess('Reserva cadastrada com sucesso.');

      // Limpar os campos do formulário
      setFormData({
        professor: '',
        dates: [],
        start: '',
        end: '',
        room: ''
      });
    } catch (error) {
      let errorMessage = error.message || 'Ocorreu algum erro na criação da reserva.'; 

      setError(errorMessage);
      setSuccess('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="mt-5">Cadastro de Reservas</h2>
      <Form.Group controlId="formProfessor" className="mt-5">
        <Form.Label>Professor:</Form.Label>
        <Form.Control
          as="select"
          name="professor"
          value={formData.professor}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione um professor</option>
          {professors.map((professor) => (
            <option key={professor._id} value={professor._id}>
              {professor.nome + " - " + professor.matricula}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formDates" className="mt-5">
        <Form.Label>Datas:</Form.Label>
        <DayPicker
          mode="multiple"
          min={1}
          selected={[...formData.dates]}
          onSelect={handleDateChange}
          footer={<div></div>}
        />
      </Form.Group>

      <Form.Group controlId="formStart" className="mt-5">
        <Form.Label>Início:</Form.Label>
        <Form.Control
          type="time"
          name="start"
          value={formData.start}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEnd" className="mt-5">
        <Form.Label>Final:</Form.Label>
        <Form.Control
          type="time"
          name="end"
          value={formData.end}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formRoom" className="mt-5">
        <Form.Label>Sala:</Form.Label>
        <Form.Control
          as="select"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione uma sala</option>
          <option value="1">Sala 1</option>
          <option value="2">Sala 2</option>
          <option value="3">Sala 3</option>
          <option value="4">Sala 4</option>
          <option value="5">Sala 5</option>
          <option value="6">Sala 6</option>
          <option value="7">Sala 7</option>
          <option value="8">Sala 8</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-5">
        Cadastrar Reserva
      </Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </Form>
  );
};

export default CadastroReserva;
