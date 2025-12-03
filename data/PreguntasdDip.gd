# Auto-generado por Editor de Preguntas
# Guardar este archivo dentro de data/
var Preguntas = [
  {
    "id": "base_militar_en_tierra_del_fuego",
    "name": "Base Militar en Tierra del Fuego",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "dip_usa" ],
    "image_path": "base_militar_en_tierra_del_fuego.jpg",
    "prompt": "Los Estados Unidos quieren reforzar su presencia militar en su Patio Trasero e insisten en su interés de instalar una base militar en Tierra del Fuego, puerta a la Antártida.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para autorizar la base militar de EEUU en Tierra del Fuego.",
    "tooltip": "Ganás el apoyo de EEUU, pero perdés el de China.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "dip_china" ] }
    ]
  },
      {
    "id": "B",
    "label": "Ofrecer a EEUU una asociación estratégica para construir un puerto de aguas profundas.",
    "tooltip": "Ganás el apoyo de EEUU y el polo fueguino, pero perdés el de China.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_eeuu", "dis_patagonia_polo_fueguino" ] }, { "type": "remove_supports", "ids": [ "dip_china" ] }
    ]
  },
      {
    "id": "C",
    "label": "Reafirmar tu alineamiento con China habilitándoles construir un puerto de aguas profundas.",
    "tooltip": "Perdés el apoyo de EEUU, pero ganás el de China y el polo fueguino.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_china", "dis_patagonia_polo_fueguino" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar la injerencia militar extranjera sobre territorio argentino.",
    "tooltip": "Perdés el apoyo de EEUU, pero ganás el de los sectores soberanistas.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "nac_veteranos_malvinas" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "ruta_de_la_seda",
    "name": "Ruta de la Seda",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "dip_china" ],
    "image_path": "ruta_de_la_seda.jpg",
    "prompt": "China te propone tu incorporación plena a la nueva Ruta de la Seda, lo cual supone inversión en infraestructura pero también tensiones geopolíticas con Estados Unidos.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para firmar un tratado de adhesión plena a la Ruta de la Seda.",
    "tooltip": "Ganás el apoyo de China, pero perdés el de los EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -1 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "dip_china" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu" ] }
    ]
  },
      {
    "id": "B",
    "label": "Negociar inversiones en infraesctructura sin adherir a la Ruta de la Seda.",
    "tooltip": "No ganás el apoyo de China, ni perdés el de EEUU, pero las inversiones mejoran tu imagen.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "nac_movimiento_obrero" ] }
    ]
  },
      {
    "id": "C",
    "label": "Rechazar tu incorporación e intentar negociar inversiones con los Estados Unidos.",
    "tooltip": "Ganás el apoyo de EEUU y perdés el de China, pero no llegan inversiones y cae tu imagen.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "add_supports", "ids": [ "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "dip_china" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar incorporación, expropiar constructoras y ejecutar las obras desde el Estado.",
    "tooltip": "Perdés el apoyo del Gran Capital, pero ganás el de la clase obrera y mejorás tu imagen.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 8 }, { "type": "delta_nucleo", "value": 300 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_movimiento_obrero" ] }, { "type": "remove_supports", "ids": [ "nac_gran_capital" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "reconocer_jerusalen_como_capital",
    "name": "Reconocer Jerusalén como Capital",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "dip_israel" ],
    "image_path": "reconocer_jerusalen_como_capital.jpg",
    "prompt": "Israel te pide reconocer a Jerusalén como capital. Pero la propia ONU rechaza dicho status por ser violatorio de la partición de Palestina aprobada en 1947 para fundar Israel.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de reconocimiento de Jerusalén como capital de Israel.",
    "tooltip": "Ganás el apoyo de Israel, pero perdés el de los palestinos y algo de imagen.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_israel" ] }, { "type": "remove_supports", "ids": [ "dip_palestina" ] }
    ]
  },
      {
    "id": "B",
    "label": "No aceptar la petición, pero ofrecerles apoyo diplomático en su disputa con Irán.",
    "tooltip": "Ganás el apoyo de Israel, pero perdés el de Irán.",
    "next_question_id": "",
    "effects": [
      { "type": "add_supports", "ids": [ "dip_israel" ] }, { "type": "remove_supports", "ids": [ "dip_iran" ] }
    ]
  },
      {
    "id": "C",
    "label": "Rechazar el pedido y reafirmar tu alineamiento con Palestina",
    "tooltip": "Perdés el apoyo de Israel, pero ganás el de Palestina.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_palestina" ] }, { "type": "remove_supports", "ids": [ "dip_israel" ] }
    ]
  },
      {
    "id": "D",
    "label": "Condenar la petición y coordinar con Irán la defensa diplomática de Palestina.",
    "tooltip": "Ganás el apoyo de Palestina e Irán, pero perdés el de Israel y EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "dip_iran", "dip_palestina" ] }, { "type": "remove_supports", "ids": [ "dip_israel", "dip_eeuu" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "venezuela_mercosur",
    "name": "Venezuela MERCOSUR",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "dip_patria_grande" ],
    "image_path": "venezuela_mercosur.jpg",
    "prompt": "Venezuela quiere relanzar su política internacional de la Patria Grande bolivariana y como primera medida solicita volver a ser un miembro pleno del MERCOSUR.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para proponer revocar la suspensión de Venezuela del MERCOSUR.",
    "tooltip": "Ganás el apoyo de Venezuela, pero perdés el de EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "dip_venezuela" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu" ] }
    ]
  },
      {
    "id": "B",
    "label": "Proponerle a Brasil evaluar de forma conjunta la situación de Venezuela.",
    "tooltip": "Ganás el apoyo de Brasil y Venezuela, pero perdés el de EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_brasil", "dip_venezuela" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu" ] }
    ]
  },
      {
    "id": "C",
    "label": "Bloquear cualquier reincorporación, sin importar la postura de Brasil.",
    "tooltip": "Perdés el apoyo de Venezuela y Brasil, pero ganás el de EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "dip_brasil", "dip_venezuela" ] }
    ]
  },
      {
    "id": "D",
    "label": "No pronunciarse sobre Venezuela y delegar a Brasil la decisión final.",
    "tooltip": "Ganás el apoyo de Brasil, pero perdés el de Venezuela y algo de núcleo duro.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_nucleo", "value": -200 }, { "type": "add_supports", "ids": [ "dip_brasil" ] }, { "type": "remove_supports", "ids": [ "dip_venezuela" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "derecho_al_retorno",
    "name": "Derecho al Retorno",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "dip_palestina" ],
    "image_path": "derecho_al_retorno.jpg",
    "prompt": "Palestina busca el reconocimiento de su \"derecho al retorno\" a los territorios ocupados por Israel y pide a Argentina que revise su postura histórica de la solución de dos Estados.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para reconocer el derecho al retorno de los palestinos.",
    "tooltip": "Ganás el apoyo de Palestina, pero perdés el de Israel.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "dip_palestina" ] }, { "type": "remove_supports", "ids": [ "dip_israel" ] }
    ]
  },
      {
    "id": "B",
    "label": "Mantener tu postura histórica de la solución de los dos Estados.",
    "tooltip": "Ganás el apoyo del Reino Unido, pero perdés el de Palestina.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_nucleo", "value": -100 }, { "type": "add_supports", "ids": [ "dip_reino_unido" ] }, { "type": "remove_supports", "ids": [ "dip_palestina" ] }
    ]
  },
      {
    "id": "C",
    "label": "Negar que Israel cometa un genocidio en Palestina y apoyar su derecho a la defensa.",
    "tooltip": "Ganás el apoyo de Israel, pero perdés el de Palestina y los organismos de DDHH.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dip_israel" ] }, { "type": "remove_supports", "ids": [ "dip_palestina", "nac_organismos_ddhh" ] }
    ]
  },
      {
    "id": "D",
    "label": "Cerrar la Embajada de Israel y expropiar las empresas israelíes en repudio al genocidio.",
    "tooltip": "Apoyo de Palestina y el movimiento obrero. Enemistad con EEUU, Israel y el gran capital.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 400 }, { "type": "shift_pendulum", "workers": -2, "capital": 2 }, { "type": "add_supports", "ids": [ "dip_palestina", "nac_movimiento_obrero" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu", "dip_israel", "nac_gran_capital" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "asamblea_constituyente",
    "name": "Asamblea Constituyente",
    "category": "dip",
    "role_target": 1,
    "scope": "international",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [],
    "image_path": "asamblea_constituyente.jpg",
    "prompt": "La población empieza a discutir la idea de construir una Argentina sobre otras bases sociales y se abre la posibilidad de convocar una asamblea nacional constituyente.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para convocar a una asamblea nacional constituyente, libre y soberana.",
    "tooltip": "Apoyo de varios sectores. Enemistad con el gran capital, la Justicia y EEUU.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 300 }, { "type": "shift_pendulum", "workers": -1, "capital": 1 }, { "type": "add_supports", "ids": [ "nac_movimiento_obrero", "nac_movimientos_sociales", "nac_movimiento_mujeres" ] }, { "type": "remove_supports", "ids": [ "dip_eeuu", "nac_justicia", "nac_gran_capital" ] }
    ]
  },
      {
    "id": "B",
    "label": "Rechazar cualquier convocatoria a una asamblea constituyente.",
    "tooltip": "Respaldo de la Justicia, EEUU y el gran capital. Rechazo de varios sectores.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": -100 }, { "type": "add_supports", "ids": [ "nac_justicia", "nac_gran_capital", "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "nac_movimiento_obrero", "nac_movimientos_sociales", "nac_movimiento_mujeres" ] }
    ]
  },
      {
    "id": "C",
    "label": "Poner en discusión únicamente la reforma del Poder Judicial en la Constitución.",
    "tooltip": "Perdés el apoyo de la Justicia, pero ganás el de los organismos de DDHH.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "nac_organismos_ddhh" ] }, { "type": "remove_supports", "ids": [ "nac_justicia" ] }
    ]
  },
      {
    "id": "D",
    "label": "Proponer quitar artículo 18 de la CN y habilitar pena de muerte por traición a la Patria.",
    "tooltip": "Ganás el apoyo de los sectores nacionalistas, pero perdés el de la Justicia.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 200 }, { "type": "add_supports", "ids": [ "nac_veteranos_malvinas" ] }, { "type": "remove_supports", "ids": [ "nac_justicia" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "guerra_a_reino_unido",
    "name": "Guerra a Reino Unido",
    "category": "dip",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [],
    "image_path": "guerra_a_reino_unido.jpg",
    "prompt": "La Armada te informa que el submarino hundido cerca de las Islas Malvinas que estaban buscando, no sufrió un accidente sino que fue torpedeado por fuerzas británicas.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para declarar formalmente la guerra al Reino Unido y recuperar las Malvinas.",
    "tooltip": "Ganás el apoyo de los sectores nacionalistas, pero perdés el de los británicos.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 15 }, { "type": "delta_nucleo", "value": 500 }, { "type": "add_supports", "ids": [ "nac_veteranos_malvinas" ] }, { "type": "remove_supports", "ids": [ "dip_reino_unido" ] }
    ]
  },
      {
    "id": "B",
    "label": "Encubrir el hecho y mandar a espiar a los familiares de la tripulación.",
    "tooltip": "",
    "next_question_id": "",
    "effects": [
      { "type": "add_supports", "ids": [ "dip_reino_unido" ] }, { "type": "remove_supports", "ids": [ "nac_organismos_ddhh" ] }
    ]
  },
      {
    "id": "C",
    "label": "Traer petroleras off shore a que exploren el lecho marino, simulando buscar el submarino.",
    "tooltip": "Ganás el apoyo de Reino Unido y las petroleras, pero perdés el de los grupos ambientales.",
    "next_question_id": "",
    "effects": [
      { "type": "add_supports", "ids": [ "dip_reino_unido", "dis_patagonia_petroleras", "dis_cuyo_petroleras" ] }, { "type": "remove_supports", "ids": [ "nac_grupos_ambientalistas" ] }
    ]
  },
      {
    "id": "D",
    "label": "Comunicar el hecho ocurrido al pueblo argentino y responder sólo por la vía diplomática.",
    "tooltip": "Respaldo del Reino Unido. Furia de los veteranos de Malvinas.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -12 }, { "type": "delta_nucleo", "value": -500 }, { "type": "add_supports", "ids": [ "dip_reino_unido" ] }, { "type": "remove_supports", "ids": [ "nac_veteranos_malvinas" ] }
    ]
  }
    ],
    "nested_only": false
  }
]
