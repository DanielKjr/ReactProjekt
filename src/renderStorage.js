

import "./game.css";
import React, { useEffect, useState } from 'react';

function Grid(props) {
    const gameServer = props.gameServer;
    const [groundArray, setGroundArray] = useState([]);
    const [clutterArray, setClutterArray] = useState([]);
    const [moveAbleArray, setMoveAbleArray] = useState([]);
    const [effectArray, setEffectArray] = useState([]);
    const [infoArray, setInfoArray] = useState([]);

    useEffect(() => {
      //gameServer.connect();
      document.addEventListener("keydown", handleMovement); 

      return () => {
          //gameServer.disconnect();
          document.removeEventListener("keydown", handleMovement); 
      };
  });



    gameServer.onEvent("WorldUpdate", response => {
      if(response.ground !== undefined){
        setGroundArray(response.ground);
      }
      if(response.clutter !== undefined)
      {
        setClutterArray(response.clutter);
      }
      if(response.movables !== undefined)
      {
        setMoveAbleArray(response.movables);
      }
      if(response.effects !== undefined)
      {
        setEffectArray(response.effects);
      }
      if(response.info !== undefined)
      {
        //Dumb bypass of array limitations
        //Could convert into standard variable with lots of work, but too lazy.
        let tmp = [response.info,response.info];
        setInfoArray(tmp);
      }

    });

    //TODO set a limit
    function handlePlayerMovement(direction)
    {
      if(direction === "w")
      {
        gameServer.invoke("MoveDirection", "up");
      }
      if(direction === "a")
      {
        gameServer.invoke("MoveDirection", "left");
      }
      if(direction === "s")
      {
        gameServer.invoke("MoveDirection", "down");
      }
      if(direction === "d")
      {
        gameServer.invoke("MoveDirection", "right");
      }
      
    }

    const handleMovement = (event) => {
      if(!props.isTyping)
      {
        handlePlayerMovement(`${event.key}`);
      }
       
  }

    return (
      <div className="grid-container">
        {groundArray.map((tile, index) => (
          <img
            key={`ground-${index}`}
            className="grid-item ground"
            src={`./tiles/tile_${tile}.png`}
            alt="bad path"
          />
        ))}
        {clutterArray.map((obj,index)=>(
          <img
          key={`clutter-${index}`}
          style={{left:(obj.xpos)*48,top:(obj.ypos)*48}}
          className={`grid-item clutter ${CheckFlip(obj.flipped)}`}
          src={`./tiles/tile_${obj.tile}.png`}
          alt="bad path"
          />
        ))}
        {moveAbleArray.map((obj,index)=>(
          <img
            key={`movables-${index}`}
            style={{left:(obj.xpos)*48,top:(obj.ypos)*48}}
            className={`grid-item moveable ${CheckFlip(obj.flipped)}`}
            src={`./tiles/tile_${obj.tile}.png`}
            alt="bad path"
          />
        ))}
        {effectArray.map((obj,index)=>(
          <img
            key={`effects-${index}`}
            style={{left:(obj.xpos)*48,top:(obj.ypos)*48}}
            className={`grid-item effect ${CheckFlip(obj.flipped)}`}
            src={`./tiles/tile_${obj.tile}.png`}
            alt="bad path"
          />
        ))}
        {infoArray.map((obj,index)=>(
          <img
            key={`info-${index}`}
            style={{left:(1)*48,top:(1)*48}}
            className={`grid-item info`}
            alt={`x:${obj.xpos}, y:${obj.ypos}`}
          />
        ))}
      </div>
    );
    
    }
  function CheckFlip(msg){
    if(msg){
      return "flip";
    }
    else{
      return "";
    }
  }

  export default Grid;
  
