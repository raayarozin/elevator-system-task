import './Button.css';

const Button = (props) => {
  const statusHandler = () => {
    if (props.state === 'call') {
      props.onClick(props.floorNumber);
    }
  };

  return (
    <div className='system-level-corner'>
      <button
        id={props.id}
        onClick={(e) => {
          statusHandler(e);
        }}
        className={`elevator-button ${props.state}-button`}
      >
        {props.state}
      </button>
    </div>
  );
};
export default Button;
