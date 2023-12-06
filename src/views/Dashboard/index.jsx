import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboards.css';
import { useSocketIo } from '../../network/websocket';

const Dashboard = () => {
  const [roomsData, setRoomsData] = useState([
   //{{ id: 1, name: 'Sala 1', status: 'Ocupada', borrower: 'João', time: '10:00', room: "0" }}
    { id: 1, name: 'Sala 1', status: 'Disponível', room: "1", request: null },
    { id: 2, name: 'Sala 2', status: 'Disponível', room: "2", request: null },
    { id: 3, name: 'Sala 3', status: 'Disponível', room: "3", request: null },
    { id: 4, name: 'Sala 4', status: 'Disponível', room: "4", request: null },
    { id: 5, name: 'Sala 5', status: 'Disponível', room: "5", request: null },
    { id: 6, name: 'Sala 6', status: 'Disponível', room: "6", request: null },
    { id: 7, name: 'Sala 7', status: 'Disponível', room: "7", request: null },
    { id: 8, name: 'Sala 8', status: 'Disponível', room: "8", request: null },
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
          roomData.request = null;
          return roomData;
        })
        setRoomsData(newRoomsData);
      });
    }catch(error) {
      console.error(error.message);
    }
  };

  const requestEmprestimo = async (room) => {
    try {
      const route = room.status === 'Ocupada' ? 'give-back-room' : 'give-room';
      const uri = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/emprestimos/${route}?room=${room.room}`;  

      await fetch(uri, {method: 'PUT'});

      setRoomsData(prevRoomsData => {
        const roomIndex = prevRoomsData.findIndex(r => r.room === room.room);

        if (roomIndex >= 0) {
          const updatedRoomsData = [...prevRoomsData];
          const newRoom = structuredClone(room);
          newRoom.request = null;
          newRoom.status = newRoom.status === 'Ocupada' ? 'Disponível' : 'Ocupada';
          updatedRoomsData[roomIndex] = newRoom;

          return updatedRoomsData;
        }
        return prevRoomsData;
      });
    } catch (error) {
     console.error(error.message); 
    }
  }

  const rejectRequest = async (roomValue) => {
    setRoomsData(prevRoomsData => {
      const roomIndex = prevRoomsData.findIndex(room => room.room === roomValue);

      if (roomIndex >= 0) {
        const updatedRoomsData = [...prevRoomsData];
        updatedRoomsData[roomIndex] = {
          ...updatedRoomsData[roomIndex],
          request: null,
        };
        return updatedRoomsData;
      }

      return prevRoomsData;
    });    
  }

  const getRequestText = (room) => {
    const requestingText = room.status === 'Ocupada' ? 'Devolução solicitada por: ' : 'Empréstimo solicitado por: ';
    return requestingText + room.request.borrower;
  };

  useEffect(() => {
    fetchEmprestimos(); // Busca últimos empréstimos

    // Recebe dados do servidor
    const socket = useSocketIo();

    // Para o evento 'retirada' do WebSocket
    socket.on('retirada', data => {
      const { horarioEmprestimo, sala, professor: { nome } } = data;

      const updatedRoomsData = roomsData.map(roomData => {
        if (roomData.room === sala) {
          return {
            ...roomData,
            status: 'Ocupada',
            borrower: nome,
            time: new Date(horarioEmprestimo).toLocaleString('pt-BR'),
          };
        }
        return roomData;
      });

      setRoomsData(updatedRoomsData);
    });

    // Para o evento 'devolucao' do WebSocket
    socket.on('devolucao', data => {
      setRoomsData(prevRoomsData => {
        const updatedRoomsData = prevRoomsData.map(room => {
          if (room.room === data) {
            return {
              ...room,
              status: 'Disponível',
            };
          }
          return room;
        });
        return updatedRoomsData;
      });
    });

    // Para o evento 'solicitar' do WebSocket
    socket.on('solicitar', data => {
      setRoomsData(prevRoomsData => {
        const roomIndex = prevRoomsData.findIndex(room => room.room === data.room);

        if (roomIndex >= 0) {
          const updatedRoomsData = [...prevRoomsData];
          updatedRoomsData[roomIndex] = {
            ...updatedRoomsData[roomIndex],
            request: data,
          };
          return updatedRoomsData;
        }

        return prevRoomsData;
      });
    });

    // Limpa o listener quando o componente é desmontado
    return () => {
      socket.off('retirada');
      socket.off('devolucao');
      socket.off('solicitar');
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
                {(room.status === 'Ocupada' && !room.request) && (
                  <div>
                    <p>Emprestado para: {room.borrower}</p>
                    <p>Horário: {room.time}</p>
                  </div>
                )}
                {(room.request) && (
                  <div>
                    <p>{getRequestText(room)}</p>
                    <button type="button" className="btn btn-primary" onClick={() => requestEmprestimo(room)}>Aceitar</button>
                    <button type="button" className="btn btn-danger ms-2" onClick={() => rejectRequest(room.room)}>Recusar</button>
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