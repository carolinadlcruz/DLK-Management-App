let tabs_wrapper = document.getElementsByClassName("tabs-wrapper");
for (let tabs of tabs_wrapper) {
  let tab_list = tabs.getElementsByClassName("tab");
  
  for (let tab of tab_list) {
    tab.setAttribute("tabindex", 1);
    
    const change_selected = (e) => {
      // Cambiar el color del texto/icono al seleccionar un tab
      for (let t of tab_list) {
        t.classList.remove("selected");
      }
      e.target.classList.add("selected");
      
      // Resto del código para cambiar el indicador de selección (barra, etc.)
      tabs.style.setProperty("--bar-width", e.target.offsetWidth + "px");
      tabs.style.setProperty("--bar-offset", e.target.offsetLeft + "px");
      tabs.value = e.target.textContent;
      
      /* Emitir eventos si es necesario */
    };
    
    tab.addEventListener("focus", (e) => {
      change_selected(e);
    });
    
    tab.addEventListener("click", (e) => {
      change_selected(e);
    });
  }
  
  // Establecer el tab inicial seleccionado (aquí podrías tener un tab predeterminado)
  let active_tab = tab_list[0];
  active_tab.classList.add("selected");
  tabs.style.setProperty("--bar-width", active_tab.offsetWidth + "px");
  tabs.style.setProperty("--bar-offset", active_tab.offsetLeft + "px");
  tabs.value = active_tab.textContent;
}

  