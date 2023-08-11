import React, { useEffect, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import styles from './kanban.module.scss';
import { useAuthService } from '../../services/authService';




const TaskInformation = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px;
  width: 158px;
  min-height: 106px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  z-index: 9999;
  border-radius: 5px;
  background: ${({ isDragging }) =>
    isDragging ? '#D1E5E2' : 'white'};
    border: ${({ isDragging }) => isDragging && '1px dashed #10957D'};
  margin-top: 15px;

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 400px;
    color: #7d7d7d;
  }
`;



const TaskCard = ({ item, index,isOndrag,setIsOnDrag,photoEffect,setPhotoEffect,title ,setCollectionId,collectionId,id}) => {


  const rotation = useMemo(() => Math.floor(Math.random() * 61) - 30, []);

  const {removeCollection,getAllCollection} = useAuthService();

  useEffect(() => {
    setCollectionId(id)
  }, [item]);



  return (
    <Draggable
    key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
    onMouseEnter={() => setIsOnDrag(true)}
onMouseLeave={() => setIsOnDrag(false)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskInformation
                      title={title} // pass the title prop

             rotation={rotation} // pass the rotation prop
          style={{
            paddingBottom:title !== "Your Images" && photoEffect && '4rem',
          }}
          isDragging={snapshot.isDragging}>
            <div
            className={styles.taskContent}
            >
            <img src={item.image}/>
            </div>
         
          </TaskInformation>
        </div>
      )}
    </Draggable>
  );
};


export default TaskCard;
