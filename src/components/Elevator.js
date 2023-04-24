import './Elevator.css';

const Elevator = (props) => {
  return (
    <img
      src={props.src}
      alt=''
      className='elevator-svg'
      id={props.id}
      style={{ transform: `translateY(${props.position * -50}px)` }}
    />
  );
};
export default Elevator;
