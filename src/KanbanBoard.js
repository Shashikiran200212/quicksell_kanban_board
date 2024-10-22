import React, { useEffect, useState } from 'react';
import { getTickets } from './apiService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';
import DisplayMenu from './DisplayMenu';
import priority0 from './public/No-priority.svg';
import priority1 from './public/Low Priority.svg';
import priority2 from './public/Medium Priority.svg';
import priority3 from './public/High Priority.svg';
import priority4 from './public/Urgent Priority.svg';
import add from './public/add.svg';
import more from './public/more.svg';
import todoIcon from './public/To-do.svg';
import inProgressIcon from './public/in-progress.svg';
import backlogIcon from './public/Backlog.svg';
import tag from './public/tag.png';
import svg1 from './public/p1.png';
import svg2 from './public/p2.png';
import svg3 from './public/p3.png';
import Footer from './Footer';


const statusIcons = {
  'Todo': todoIcon,
  'In progress': inProgressIcon,
  'Backlog': backlogIcon,
  'Anoop sharma': svg1,
  'Suresh': svg2,
  'Shankar Kumar': svg2,
  'Ramesh': svg2,
  'Yogesh': svg2,
  '0':priority0,
  '1':priority1,
  '2':priority2,
  '3':priority3,
  '4':priority4,

};



const randomSvgs = [svg1, svg2, svg3]; 

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [orderBy, setOrderBy] = useState(localStorage.getItem('orderBy') || 'priority');
  const [sortedTickets, setSortedTickets] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTickets();
      setTickets(data.tickets);
      setUsers(data.users);
      groupAndSortTickets(data.tickets);
    };
    fetchData();
  }, []);

  useEffect(() => {
    groupAndSortTickets(tickets);
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('orderBy', orderBy);
  }, [groupBy, orderBy, tickets]);

  const groupAndSortTickets = (tickets) => {
    let groupedData = {};
    if (groupBy === 'status') {
      groupedData = groupByStatus(tickets);
    } else if (groupBy === 'user') {
      groupedData = groupByUser(tickets);
    } else if (groupBy === 'priority') {
      groupedData = groupByPriority(tickets);
    }

    Object.keys(groupedData).forEach(group => {
      groupedData[group] = sortTickets(groupedData[group]);
    });

    setSortedTickets(groupedData);
  };

  const groupByStatus = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const { status } = ticket;
      acc[status] = acc[status] ? [...acc[status], ticket] : [ticket];
      return acc;
    }, {});
  };

  const groupByUser = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const user = users.find(user => user.id === ticket.userId);
      const userName = user ? user.name : 'Unknown User';
      
      acc[userName] = acc[userName] ? [...acc[userName], ticket] : [ticket];
      return acc;
    }, {});
  };

  const groupByPriority = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const { priority } = ticket;
      acc[priority] = acc[priority] ? [...acc[priority], ticket] : [ticket];
      return acc;
    }, {});
  };

  const sortTickets = (tickets) => {
    if (orderBy === 'priority') {
      return tickets.sort((a, b) => a.priority - b.priority);
    } else if (orderBy === 'title') {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const group = source.droppableId;
    const newTickets = Array.from(sortedTickets[group]);
    const [removed] = newTickets.splice(source.index, 1);
    newTickets.splice(destination.index, 0, removed);
    setSortedTickets({ ...sortedTickets, [group]: newTickets });
  };

  const getRandomSvg = () => {
    const randomIndex = Math.floor(Math.random() * randomSvgs.length);
    return randomSvgs[randomIndex];
  };

  return (
    <div>
      <DisplayMenu setGroupBy={setGroupBy} setOrderBy={setOrderBy} />
      <div className="kanban-board">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(sortedTickets).map((priority) => (
            <Droppable droppableId={priority} key={priority}>
              {(provided) => (
                <div className="status-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className='col-names'>
                    <h3>
                      <img src={statusIcons[priority]} alt={`${priority} icon`} className="status-icon" />
                      {priority} <span className='count'>{sortedTickets[priority].length}</span>
                    </h3> 
                    <div>
                      <img src={add} alt="add-icon" className="col-icon" />
                      <img src={more} alt="more-icon" className="col-icon" />
                    </div>
                  </div>

                  {sortedTickets[priority].map((ticket, index) => (
                    <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                      {(provided) => (
                        <div
                          className="ticket"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="ticket-header">
                            <img src={getRandomSvg()} alt="Random decoration" className="profile" />
                          </div>
                          <p className='ticketid'>{ticket.id}</p> 
         
                          <p className='title'>{ticket.title}</p>

                          
                          <div className='priority-section'>
                            <div className="priority-icon">
                              {ticket.priority === 0 && <img src={priority0} alt="Priority 0" />}
                              {ticket.priority === 1 && <img src={priority1} alt="Priority 1" />}
                              {ticket.priority === 2 && <img src={priority2} alt="Priority 2" />}
                              {ticket.priority === 3 && <img src={priority3} alt="Priority 3" />}
                              {ticket.priority === 4 && <img src={priority4} alt="Priority 4" />}
                            </div>
                            <div className='tag'>
                              <img src={tag} alt="tag" className="tag" />
                              {ticket.tag.map((tag, idx) => (
                                <span key={idx} className="tag-item">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Footer />
    </div>
  );
};

export default KanbanBoard;
