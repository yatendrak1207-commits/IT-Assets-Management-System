import "./Card.css";

function Card(props) {
  return (
    <div
      className="Card"
      onClick={props.onClick}
      style={{ cursor: props.onClick ? "pointer" : "default" }}
    >
      <h3>{props.title}</h3>
      <h2>{props.value}</h2>
    </div>
  );
}

export default Card;
