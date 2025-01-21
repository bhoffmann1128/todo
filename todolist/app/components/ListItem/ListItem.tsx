'use client'
import AddIcon from '../../../public/add-icon.svg';
import MoveIcon from '../../../public/move-icon.svg';
import DeleteIcon from '../../../public/delete-icon.svg';
import { DragEvent } from 'react';

type ListItemProps = {
    id: string;
    content: string;
    isDragging?: boolean;
    className?:string;
    handleAdd?: () => void;
    handleDelete?: (id: string) => void;
    handleContentChange?: (id: string, value: string) => void;
    onDragStart?: (id: string) => void;
    onDragOver?: (e: DragEvent<HTMLDivElement>, id: string) => void;
    onDragEnd?: () => void;
    onDrop?: (e: DragEvent<HTMLDivElement>, id: string) => void;
}

export default function ListItem({
    id,
    content,
    isDragging,
    handleAdd,
    handleDelete,
    handleContentChange,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    className= ""
}: ListItemProps) {
    const handleItemDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const mouseY = e.clientY;
        const threshold = rect.height / 3;

        if (mouseY > rect.top - threshold && mouseY < rect.bottom + threshold) {
            onDragOver?.(e, id);
        }
    };

    return (
        <div 
            className={`list-item-wrapper ${className}`}
            draggable
            onDragStart={() => onDragStart?.(id)}
            onDragOver={handleItemDragOver}
            onDragEnd={onDragEnd}
            onDrop={(e) => onDrop?.(e, id)}
        >
            <div className="list-item__handle-container">
                <button className="list-item__handle"><MoveIcon /></button>
            </div>
            <input 
                className="list-item__input" 
                type="text" 
                value={content}
                onChange={(e) => handleContentChange?.(id, e.target.value)}
            />
            <div className="list-item__actions">
                <button onClick={handleAdd} className="list-item__add"><AddIcon /></button>
                <button onClick={() => handleDelete?.(id)} className="list-item__delete"><DeleteIcon /></button>
            </div>
        </div>
    );
}