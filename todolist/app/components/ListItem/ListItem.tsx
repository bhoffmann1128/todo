'use client'
import './listitem-styles.css';
import AddIcon from '../../../public/add-icon.svg';
import MoveIcon from '../../../public/move-icon.svg';
import DeleteIcon from '../../../public/delete-icon.svg';
import { DragEvent } from 'react';

type ListItemProps = {
    id: string,
    content: string,
    draggable?: boolean,
    onDragStart?: (e: DragEvent<HTMLDivElement>) => void,
    onDragOver?: (e: DragEvent<HTMLDivElement>) => void,
    onDrop?: (e: DragEvent<HTMLDivElement>) => void,
    handleAdd?: () => void,
    handleDelete?: (id:string) => void,
    handleContentChange?: (id: string, value: string) => void
}

export default function ListItem({ 
    id, 
    content, 
    draggable,
    onDragStart,
    onDragOver,
    onDrop,
    handleAdd, 
    handleDelete,
    handleContentChange 
}:ListItemProps){
    
    return (
        <div 
            className="list-item" 
            id={id}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="list-item__handle">
                <button className="list-item__handle-button"><MoveIcon /></button>
            </div>
            <input 
                className="list-item__input" 
                type="text" 
                value={content}
                onChange={(e) => handleContentChange?.(id, e.target.value)}
            />
            <div className="list-item__actions">
                <button onClick={handleAdd} className="list-item__handle"><AddIcon /></button>
                <button onClick={()=>handleDelete?.(id)} className="list-item__handle"><DeleteIcon /></button>
            </div>
        </div>
    )
}