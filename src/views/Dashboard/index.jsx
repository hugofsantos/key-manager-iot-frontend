import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboards.css';

const Dashboard = () => {
  const [roomsData, setRoomsData] = useState([
   //{{ id: 1, name: 'Sala 1', status: 'Ocupada', borrower: 'João', time: '10:00', room: "0" }}
    { id: 1, name: 'Sala 1', status: 'Disponível', room: "1" },
    { id: 2, name: 'Sala 2', status: 'Disponível', room: "2" },
    { id: 3, name: 'Sala 3', status: 'Disponível', room: "3" },
    { id: 4, name: 'Sala 4', status: 'Disponível', room: "4" },
    { id: 5, name: 'Sala 5', status: 'Disponível', room: "5" },
    { id: 6, name: 'Sala 6', status: 'Disponível', room: "6" },
    { id: 7, name: 'Sala 7', status: 'Disponível', room: "7" },
    { id: 8, name: 'Sala 8', status: 'Disponível', room: "8" },
  ]);

  const fetchEmprestimos = async () => {
    try{
      const response = await fetch(
        `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/emprestimos/pendings?comProfessor=true`
      );
      const emprestimos = await response.json();

      emprestimos.forEach(emprestimo => {
        const { horarioEmprestimo, sala, professor: { nome } } = emprestimo;

        const newRoomsData = roomsData.map(roomData => {
          if (roomData.room === sala) {
            roomData.status = 'Ocupada';
            roomData.borrower = nome;
            roomData.time = new Date(horarioEmprestimo).toLocaleString('pt-BR');
          }

          return roomData;
        })
        setRoomsData(newRoomsData);
      });
    }catch(error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchEmprestimos(); // Busca últimos empréstimos

    // Recebe dados do servidor
    const socket = io(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`, { withCredentials: false });

    socket.on('liberar', data => {
      const { horarioEmprestimo, sala, professor: { nome } } = data;

      const newRoomsData = roomsData.map(roomData => {
        if (roomData.room === sala) {
          roomData.status = 'Ocupada';
          roomData.borrower = nome;
          roomData.time = new Date(horarioEmprestimo).toLocaleString('pt-BR');
        }

        return roomData;
      })
      setRoomsData(newRoomsData);
    });

    socket.on('trancar', data => {
      const roomIndex = roomsData.findIndex(room => room.room === data);

      if(roomIndex >= 0) {
        roomsData[roomIndex].status = 'Disponível';

        setRoomsData(roomsData);
      }
    });

    // Limpa o listener quando o componente é desmontado
    return () => {
      socket.off('liberar');
      socket.off('trancar');
    };    
  }, []);



  return (
    <div className="container">
      <h1>Dashboard de Salas</h1>
      <div className="row">
        {roomsData.map(room => (
          <div key={room.id} className="col-lg-3 col-md-4 col-sm-6">
            <div className={`card ${room.status !== 'Ocupada' ? 'text-success' : ''}`}>
              <div className="card-body">
                <h5 className={`card-title ${room.status !== 'Ocupada' ? 'text-success' : ''}`}>
                  {room.name}
                </h5>
                <p className={`card-text ${room.status !== 'Ocupada' ? 'text-success' : ''}`}>
                  {room.status}
                </p>
                {room.status === 'Ocupada' && (
                  <div>
                    <p>Emprestado para: {room.borrower}</p>
                    <p>Horário: {room.time}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;