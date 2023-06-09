

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
      document.addEventListener("keydown", handleInput); 

      return () => {
      
          document.removeEventListener("keydown", handleInput); 
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
      else{
        setEffectArray([]);
      }
      if(response.info !== undefined)
      {
        //Dumb bypass of array limitations
        //Could convert into standard variable with lots of work, but too lazy.
        let tmp = [response.info,response.info];
        setInfoArray(tmp);
      }

    });

    const directions = ["up", "left", "down", "right"];
    const keys = ["w", "a", "s", "d", " "];
    function handlePlayerInput(value)
    {
      let index = keys.indexOf(value);
      if(index !== -1 && index < 4)
      {
        gameServer.invoke("MoveDirection", `${directions[index]}`);
      }
      if(index === 4)
      {
        gameServer.invoke("Attack");
      }

      
    }

    const handleInput = (event) => {
      if(!props.isTyping && event.repeat === false) {
        handlePlayerInput(`${event.key}`);
      } 
      if(event.keyCode === 32 && event.target === document.body) {
        event.preventDefault();
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
          <h1 key={`info-${index}`}
              style={{left:(1)*48,top:(1)*48, color:"white"}}
              className={`grid-item info`}
              >Biome:{obj.biome} xpos:{obj.xpos} ypos:{obj.ypos}
          </h1>
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
  
