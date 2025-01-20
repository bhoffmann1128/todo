'use client'
import './listitem-styles.css';
import AddIcon from '../../../public/add-icon.svg';
import MoveIcon from '../../../public/move-icon.svg';
import DeleteIcon from '../../../public/delete-icon.svg';

type ListItemProps = {
    handleMove?: () => void,    // Changed from React.MouseEventHandler
    handleAdd?: () => void,     // Changed from React.MouseEventHandler
    handleDelete?: () => void   // Changed from React.MouseEventHandler
}

export default function ListItem({handleMove, handleAdd, handleDelete}:ListItemProps){

    
    return (
        <div className="list-item">
            <div className="list-item__move-handle">
                <button onClick={()=>handleMove?.()} className="list-item__handle"><MoveIcon /></button>
            </div>
            <input className="list-item__input" type="text"></input>
            <div className="list-item__actions">
                <button onClick={()=>handleAdd?.()} className="list-item__handle"><AddIcon /></button>
                <button onClick={()=>handleDelete?.()} className="list-item__handle"><DeleteIcon /></button>
            </div>
        </div>
    )
}