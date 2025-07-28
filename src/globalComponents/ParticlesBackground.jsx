import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import particlesConfig from "./config/particles-config.js";
export const ParticlesBackground = () => {
    const particlesInit = useCallback(async(engine)=>{
        await loadFull(engine)
    }, [])

    
  return (
      <Particles
       // id="tsparticles"
        options={particlesConfig}
        init={particlesInit}
      />
  );
};
