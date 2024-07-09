const Note = ({name,number, onDelete}) => {

	return (
		<li>{name} {number} <button onClick={onDelete}>delete</button></li>

	)
}

export default Note