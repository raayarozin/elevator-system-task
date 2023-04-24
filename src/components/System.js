import './System.css';
import { useEffect, useState } from 'react';
import Button from './Button';
import Elevator from './Elevator';
import movingEImage from '../assets/elevator-moving.png';
import arrivedEImage from '../assets/elevator-arrived.png';
import staticEImage from '../assets/elevator-static.png';
import ding from '../assets/ding.mp3';

const System = () => {
  const FLOORS = 10;
  const ELEVATORS = 5;
  const calls = [];

  //elevator positions
  const [e1Position, setE1Position] = useState(0);
  const [e2Position, setE2Position] = useState(0);
  const [e3Position, setE3Position] = useState(0);
  const [e4Position, setE4Position] = useState(0);
  const [e5Position, setE5Position] = useState(0);

  const elevatorPositions = [
    setE1Position,
    setE2Position,
    setE3Position,
    setE4Position,
    setE5Position,
  ];

  //elevator srcs
  const [e1Src, setE1Src] = useState(staticEImage);
  const [e2Src, setE2Src] = useState(staticEImage);
  const [e3Src, setE3Src] = useState(staticEImage);
  const [e4Src, setE4Src] = useState(staticEImage);
  const [e5Src, setE5Src] = useState(staticEImage);

  const elevatorSources = [e1Src, e2Src, e3Src, e4Src, e5Src];
  const setElevatorSources = [setE1Src, setE2Src, setE3Src, setE4Src, setE5Src];

  //buttons states
  const [btn0State, setBtn0State] = useState('call');
  const [btn1State, setBtn1State] = useState('call');
  const [btn2State, setBtn2State] = useState('call');
  const [btn3State, setBtn3State] = useState('call');
  const [btn4State, setBtn4State] = useState('call');
  const [btn5State, setBtn5State] = useState('call');
  const [btn6State, setBtn6State] = useState('call');
  const [btn7State, setBtn7State] = useState('call');
  const [btn8State, setBtn8State] = useState('call');
  const [btn9State, setBtn9State] = useState('call');

  const buttonStates = [
    btn0State,
    btn1State,
    btn2State,
    btn3State,
    btn4State,
    btn5State,
    btn6State,
    btn7State,
    btn8State,
    btn9State,
  ];

  const buttonsSetStates = [
    setBtn0State,
    setBtn1State,
    setBtn2State,
    setBtn3State,
    setBtn4State,
    setBtn5State,
    setBtn6State,
    setBtn7State,
    setBtn8State,
    setBtn9State,
  ];

  const [elevatorGrid, setElevatorGrid] = useState(
    Array.from({ length: ELEVATORS }, (_, i) => ({
      id: i,
      floors: FLOORS,
      currentFloor: 0,
      targetFloor: null,
      isMoving: false,
      src: elevatorSources[i],
      start: null,
      calculatedTime: null,
    }))
  );

  const updateElevatorGrid = (elevator, destination, state, time) => {
    if (state === 'moving') {
      elevatorGrid[elevator.id].currentFloor = null;
      elevatorGrid[elevator.id].targetFloor = destination;
      elevatorGrid[elevator.id].isMoving = true;
      elevatorGrid[elevator.id].start = time;
    } else {
      elevatorGrid[elevator.id].currentFloor = destination;
      elevatorGrid[elevator.id].targetFloor = null;
      elevatorGrid[elevator.id].isMoving = false;
      elevatorGrid[elevator.id].calculatedTime = `${
        time - elevatorGrid[elevator.id].start
      } seconds`;
    }
    setElevatorGrid([...elevatorGrid]);
  };

  const updateElevatorDisplay = (chosenElevator, destination, state) => {
    if (state === 'moving') {
      setElevatorSources[chosenElevator](movingEImage);
      const setNewPosition = elevatorPositions[chosenElevator];
      setNewPosition(destination);
    } else if (state === 'arrived') {
      setElevatorSources[chosenElevator](arrivedEImage);
    } else {
      setElevatorSources[chosenElevator](staticEImage);
    }
  };

  const callElevator = (targetFloor) => {
    const availableElevators = elevatorGrid.filter(
      (elevator) => !elevator.isMoving
    );
    const distances = availableElevators.map((el) =>
      Math.abs(el.currentFloor - targetFloor)
    );
    const closest =
      availableElevators[distances.indexOf(Math.min(...distances))];

    moveElevator(closest, targetFloor);

    setTimeout(() => {
      stopElevator(closest, targetFloor);
    }, 2000);

    setTimeout(() => {
      updateElevatorDisplay(closest.id, targetFloor, 'static');
      buttonsSetStates[targetFloor]('call');
    }, 3000);
  };

  const moveElevator = (closestElevator, targetFloor) => {
    buttonsSetStates[targetFloor]('waiting');
    updateElevatorGrid(
      closestElevator,
      targetFloor,
      'moving',
      new Date(Date.now()).getMilliseconds()
    );
    updateElevatorDisplay(closestElevator.id, targetFloor, 'moving');
  };

  const stopElevator = (closestElevator, targetFloor) => {
    updateElevatorGrid(
      closestElevator,
      targetFloor,
      'arrived',
      new Date(Date.now()).getMilliseconds()
    );
    updateElevatorDisplay(closestElevator.id, targetFloor, 'arrived');
    buttonsSetStates[targetFloor]('arrived');
    new Audio(ding).play();
  };

  const addToQueue = (targetFloor) => {
    calls.push(targetFloor);

    const interval = setInterval(() => {
      if (calls.length === 0) {
        clearInterval(interval);
      } else {
        if (calls.length > 1) {
          const targetFloor = calls.shift();
          callElevator(targetFloor);
        } else if (calls.length === 1) {
          const targetFloor = calls.shift();
          waitToNextAvailableElevator(targetFloor);
        }
      }
    }, 2000);
  };

  const waitToNextAvailableElevator = (targetFloor) => {
    setTimeout(() => {
      callElevator(targetFloor);
    }, 2000);
  };

  return (
    <div className='system-wrapper'>
      <h4 className='exercise-header'>Elevator Exercise</h4>
      <div className='system-grid'>
        {Array.from({ length: FLOORS - 1 }, (_, i) => {
          return (
            <div className='system-grid-level' key={i + 1}>
              <div className='system-level-corner'>9th</div>
              <div className='system-grid-cell'></div>
              <div className='system-grid-cell'></div>
              <div className='system-grid-cell'></div>
              <div className='system-grid-cell'></div>
              <div className='system-grid-cell'></div>
              <Button
                id={i + 1}
                state={buttonStates[i + 1]}
                onClick={() => {
                  addToQueue(i + 1);
                }}
              />
            </div>
          );
        }).reverse()}

        <div className='system-grid-level'>
          <div className='system-level-corner'>Ground Floor</div>
          <div className='system-grid-cell'>
            <Elevator src={e1Src} position={e1Position} />
          </div>
          <div className='system-grid-cell'>
            <Elevator src={e2Src} position={e2Position} />
          </div>
          <div className='system-grid-cell'>
            <Elevator src={e3Src} position={e3Position} />
          </div>
          <div className='system-grid-cell'>
            <Elevator src={e4Src} position={e4Position} />
          </div>
          <div className='system-grid-cell'>
            <Elevator src={e5Src} position={e5Position} />
          </div>
          <Button
            id={0}
            state={btn0State}
            onClick={() => {
              addToQueue(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default System;
