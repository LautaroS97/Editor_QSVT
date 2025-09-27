# Auto-generado por Editor de Preguntas
# Guardar este archivo dentro de data/
var Preguntas = [
  {
    "id": "proyecto_carem",
    "name": "Proyecto Carem",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_sendero" ],
    "image_path": "proyecto_carem.jpg",
    "prompt": "El auge de la IA aumentó el interés por los reactores SMR. Argentina tiene uno propio en desarrollo (Proyecto CAREM) pero hace falta redoblar la inversión para terminarlo rápido.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY para reducir los subsidios al capital y reasignar esos recursos al CAREM.",
    "tooltip": "Perdés el apoyo del Capital por proponer la quita de subsidios, pero ganás a la Ciencia.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": -2, "capital": 2 }, { "type": "add_supports", "ids": [ "nac_comunidad_cientifica" ] }, { "type": "remove_supports", "ids": [ "nac_pymes", "nac_gran_capital", "nac_industria" ] }
    ]
  },
      {
    "id": "B",
    "label": "Privatizar el proyecto y venderlo a una empresa estadounidense interesada.",
    "tooltip": "Ganás el apoyo de los EEUU pero perdés el de la Ciencia argentina.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "nac_comunidad_cientifica" ] }
    ]
  },
      {
    "id": "C",
    "label": "Abandonar el proyecto y asociarse con China para construir otro modelo de reactor SMR.",
    "tooltip": "Ganás el apoyo de Chian pero perdés el de la Ciencia argentina.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_nucleo", "value": -200 }, { "type": "add_supports", "ids": [ "dip_china" ] }, { "type": "remove_supports", "ids": [ "nac_comunidad_cientifica" ] }
    ]
  },
      {
    "id": "D",
    "label": "Simular un falso hackeo a la CNEA y regalarle los planos del CAREM a Israel.",
    "tooltip": "Ganás el apoyo de Israel, pero perdés el de la Ciencia y mucha imagen pública.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -10 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "dip_israel" ] }, { "type": "remove_supports", "ids": [ "nac_comunidad_cientifica" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "flexibilidad_laboral",
    "name": "Flexibilidad Laboral",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_gran_capital" ],
    "image_path": "flexibilidad_laboral.jpg",
    "prompt": "El Gran Capital exige una ley para reducir el costo laboral mediante la flexibilización total de las condiciones de trabajo o amenaza con reducir la inversión.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de reforma laboral para reducir al mínimo las obligaciones patronales.",
    "tooltip": "Ganás el apoyo del Gran Capital pero provocás la furia del movimiento obrero.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "shift_pendulum", "workers": 3, "capital": -3 }, { "type": "add_supports", "ids": [ "nac_gran_capital" ] }, { "type": "remove_supports", "ids": [ "nac_movimiento_obrero" ] }
    ]
  },
      {
    "id": "B",
    "label": "No flexibilizar las condiciones, pero aumentar los subsidios causando déficit e inflación.",
    "tooltip": "Ganás el apoyo de las PyMEs, pero por la inflación perdés el del sector financiero.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_pymes" ] }, { "type": "remove_supports", "ids": [ "nac_sector_financiero" ] }
    ]
  },
      {
    "id": "C",
    "label": "Rechazar la flexibilización laboral y apoyar la vigencia de los convenios colectivos.",
    "tooltip": "",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": -1, "capital": 1 }, { "type": "add_supports", "ids": [ "nac_movimiento_obrero" ] }, { "type": "remove_supports", "ids": [ "nac_gran_capital" ] }
    ]
  },
      {
    "id": "D",
    "label": "Buscar la conciliación entre ambos sectores, sin tomar medidas concretas.",
    "tooltip": "No te inmolás con ningún sector, pero perdés apoyo de tu núcleo duro.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_nucleo", "value": -200 }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "retenciones_cero",
    "name": "Retenciones Cero",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_campo" ],
    "image_path": "retenciones_cero.jpg",
    "prompt": "Tras una fuerte caída del precio internacional de los productos agropecuarios, el campo realiza tractorazos exigiendo retenciones cero para paliar la situación.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de retenciones cero y compensar el agujero fiscal tomando deuda con el FMI.",
    "tooltip": "Ganás el apoyo del campo y EEUU pero perdés el del movimiento obrero.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": -200 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_campo", "dip_eeuu" ] }, { "type": "remove_supports", "ids": [ "nac_movimiento_obrero" ] }
    ]
  },
      {
    "id": "B",
    "label": "Suspender temporalmente las retenciones y compensar con un ajuste en salud y educación.",
    "tooltip": "Ganás el apoyo del Campo y el Sector Financiero, pero desatás huelgas docentes y de salud.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "shift_pendulum", "workers": 2, "capital": -2 }, { "type": "add_supports", "ids": [ "nac_campo", "nac_sector_financiero" ] }, { "type": "remove_supports", "ids": [ "nac_gremios_salud", "nac_gremios_docentes" ] }
    ]
  },
      {
    "id": "C",
    "label": "Suspender temporalmente las retenciones y compensar recortando subsidios a la industria.",
    "tooltip": "Ganás el apoyo del Campo, pero perdés el de la Industria.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": -100 }, { "type": "add_supports", "ids": [ "nac_campo" ] }, { "type": "remove_supports", "ids": [ "nac_industria" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar la baja de retenciones y no tomar medidas en favor del Campo.",
    "tooltip": "Perdés el apoyo del Campo, pero no comprometés a otros sectores.",
    "next_question_id": "",
    "effects": [
      { "type": "remove_supports", "ids": [ "nac_campo" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "subsidios_a_la_industria",
    "name": "Subsidios a la Industria",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_industria" ],
    "image_path": "subsidios_a_la_industria.jpg",
    "prompt": "La tasa de ganancia de la Industria nacional viene cayendo en picada y el sector reclama una política más robusta de subsidios desde el Estado para aumentar la inversión.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de subsidios a la Industria nacional para aumentar transferencias al sector.",
    "tooltip": "Ganás el apoyo de la Industria, pero aumenta el déficit, la inflación y cae tu imagen.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -10 }, { "type": "delta_nucleo", "value": -200 }, { "type": "shift_pendulum", "workers": 2, "capital": -2 }, { "type": "add_supports", "ids": [ "nac_industria" ] }, { "type": "remove_supports", "ids": [ "nac_clase_media" ] }
    ]
  },
      {
    "id": "B",
    "label": "Suspender el pago de algunos impuestos y compensar recortando el gasto educativo.",
    "tooltip": "La Industria te apoya, pero la docencia organiza una huelga en tu contra.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_industria" ] }, { "type": "remove_supports", "ids": [ "nac_gremios_docentes" ] }
    ]
  },
      {
    "id": "C",
    "label": "Aumentar los subsidios energéticos y compensar recortando algunos planes sociales.",
    "tooltip": "La Industria te apoya, pero los movimientos sociales aumentan los piquetes.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -200 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_industria" ] }, { "type": "remove_supports", "ids": [ "nac_movimientos_sociales" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar cualquier aumento de subsidios a la Industria y no tomar medidas.",
    "tooltip": "Perdés el apoyo de la industria, pero no compremetés a otros sectores.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -2 }, { "type": "remove_supports", "ids": [ "nac_industria" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "exencion_ambiental",
    "name": "Exención Ambiental",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_extractivismo" ],
    "image_path": "exencion_ambiental.jpg",
    "prompt": "Faltan dólares. Un grupo de mineras y petroleras dice estar listo para invertir en el país, pero solicitan que se los exima de responsabilidad ambiental en caso de contaminación.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de exención de responsabilidad ambiental para apurar las inversiones.",
    "tooltip": "No sólo te apoya el extractivismo, también la Industria, pero enfurecés a los ecologistas.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "shift_pendulum", "workers": 2, "capital": -2 }, { "type": "add_supports", "ids": [ "nac_sector_extractivista", "nac_industria" ] }, { "type": "remove_supports", "ids": [ "nac_grupos_ambientalistas" ] }
    ]
  },
      {
    "id": "B",
    "label": "Negociar sólo la exención en Vaca Muerta para apurar el ingreso de dólares.",
    "tooltip": "Ganás el apoyo de las petroleras, pero los ambientalistas rechazan tu aval al fracking.",
    "next_question_id": "",
    "effects": [
      { "type": "add_supports", "ids": [ "dis_cuyo_petroleras", "dis_patagonia_petroleras" ] }, { "type": "remove_supports", "ids": [ "nac_grupos_ambientalistas" ] }
    ]
  },
      {
    "id": "C",
    "label": "Ofrecer exención para yacimientos de oro a cambio de reservas en lingotes para el BCRA.",
    "tooltip": "Las mineras te apoyan y mejoran las reservas, pero los ecologistas no están contentos.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": 3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "add_supports", "ids": [ "dis_cuyo_mineras", "dis_norte_mineras", "dis_patagonia_mineras" ] }, { "type": "remove_supports", "ids": [ "nac_grupos_ambientalistas" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar cualquier eximición de daño ambiental y reforzar controles.",
    "tooltip": "",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": -100 }, { "type": "shift_pendulum", "workers": -1, "capital": 1 }, { "type": "add_supports", "ids": [ "nac_grupos_ambientalistas" ] }, { "type": "remove_supports", "ids": [ "nac_sector_extractivista" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "desregulacion_financiera",
    "name": "Desregulación Financiera",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [ "econ_financiero" ],
    "image_path": "desregulacion_financiera.jpg",
    "prompt": "El sector financiero dice estar listo para aumentar sus inversiones, pero pide eliminar controles, desregular las criptomonedas y habilitar operaciones de alto riesgo.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de desregulación financiera para dar libertad total al capital especulativo.",
    "tooltip": "El sector financiero te da su apoyo, pero las empresas despiden para volcarse a la timba.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 200 }, { "type": "shift_pendulum", "workers": 2, "capital": -2 }, { "type": "add_supports", "ids": [ "nac_sector_financiero" ] }, { "type": "remove_supports", "ids": [ "nac_movimiento_obrero" ] }
    ]
  },
      {
    "id": "B",
    "label": "Armar una bicicleta financiera para fomentar el ingreso de capitales de corto plazo.",
    "tooltip": "Te respaldan los timberos, pero la fuga de capitales afecta los intereses de la Industria.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 300 }, { "type": "shift_pendulum", "workers": 2, "capital": -2 }, { "type": "add_supports", "ids": [ "nac_sector_financiero" ] }, { "type": "remove_supports", "ids": [ "nac_industria" ] }
    ]
  },
      {
    "id": "C",
    "label": "Timbear los fondos de seguridad previsional emitiendo bonos para seducir al sector.",
    "tooltip": "El sector financiero te respalda, pero los jubilados inician fuertes protestas.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_sector_financiero" ] }, { "type": "remove_supports", "ids": [ "nac_movimiento_jubilados" ] }
    ]
  },
      {
    "id": "D",
    "label": "Rechazar cualquier forma de desregulación financiera y aumentar controles.",
    "tooltip": "Perdés el apoyo del sector financiero, pero no comprometés a otros sectores.",
    "next_question_id": "",
    "effects": [
      { "type": "remove_supports", "ids": [ "nac_sector_financiero" ] }
    ]
  }
    ],
    "nested_only": false
  },
  
  {
    "id": "fomento_pymes",
    "name": "Fomento PyMEs",
    "category": "econ",
    "role_target": 1,
    "scope": "national",
    "province": "",
    "allowed_states": [ 0 ],
    "affinity_agenda": [],
    "image_path": "fomento_pymes.jpg",
    "prompt": "Las PyMEs se quejan de la dificultad para acceder a crédito barato y solicitan líneas de préstamos a tasas subsidiadas por el Estado. Algunas están cerrando por este motivo.",
    "options": [
      {
    "id": "A",
    "label": "Presentar LEY de fomento a las PyMEs que aumenta los subsidios a este sector.",
    "tooltip": "Las PyMEs te aplauden, pero el sector financiero te quita su apoyo.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 200 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_pymes" ] }, { "type": "remove_supports", "ids": [ "nac_sector_financiero" ] }
    ]
  },
      {
    "id": "B",
    "label": "Aumentar temporalmente los subsidios energéticos a las pequeñas y medianas empresas.",
    "tooltip": "Las PyMEs te apoyan, pero aumenta la inflación e impacta fuerte en los sectores populares.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -5 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": 1, "capital": -1 }, { "type": "add_supports", "ids": [ "nac_pymes" ] }, { "type": "remove_supports", "ids": [ "nac_movimientos_sociales" ] }
    ]
  },
      {
    "id": "C",
    "label": "Ofrecer crédito a tasas subsidiadas únicamente al sector tecnológico-científico.",
    "tooltip": "Las PyMEs te quitan su apoyo, pero los científicos y las startups respaldan la decisión.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": 100 }, { "type": "shift_pendulum", "workers": -1, "capital": 1 }, { "type": "add_supports", "ids": [ "nac_comunidad_cientifica", "dis_cordoba_startups_tecnologicas" ] }, { "type": "remove_supports", "ids": [ "nac_pymes" ] }
    ]
  },
      {
    "id": "D",
    "label": "Desconocer el reclamo de créditos subsidiados y no tomar otras medidas.",
    "tooltip": "Las PyMEs te quitan su apoyo y el desempleo enoja también a la clase media.",
    "next_question_id": "",
    "effects": [
      { "type": "delta_public_image_pct", "value": -3 }, { "type": "delta_nucleo", "value": -100 }, { "type": "remove_supports", "ids": [ "nac_pymes", "nac_clase_media" ] }
    ]
  }
    ],
    "nested_only": false
  }
]
