import "./Card.css";

function Card(props) {
  return (
    <div className="Card">
      <h3>{props.title}</h3>
      <h2>{props.value}</h2>
    </div>
  );
}

export default Card;
