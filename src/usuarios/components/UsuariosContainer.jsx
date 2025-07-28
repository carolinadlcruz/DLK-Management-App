import { useState } from "react";
import { UsuarioComponent } from "./UsuarioComponent";
export const UsuariosContainer = ({
  usuarios = [],
  usuarioEnviado,
  onRecargarUsuarios,
}) => {
  //Hooks
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState();

  return (
    <div>
      {usuarios.map((usuario, index) => (
        <UsuarioComponent
          key={index}
          usuario={usuario}
          seleccionUsuario={usuarioEnviado}
          onRecargarUsuarios={onRecargarUsuarios}
        />
      ))}
    </div>
  );
};
