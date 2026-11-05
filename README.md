# Una noche para brillar · Invitación de XV

Invitación en español creada con Next.js (App Router), React y TypeScript. Diseño adaptable a móvil, negro y dorado, esfera disco dibujada en SVG y animaciones CSS que respetan la preferencia de movimiento reducido.

## Iniciar

```sh
npm install
npm run dev
```

Abre http://localhost:3000. Para producción: `npm run build` y `npm start`.

## Personalizar

Todos los datos y textos visibles están en **`src/data/invitation.json`**. Edita nombre, familia, fechas, sedes, enlaces a mapas, itinerario, vestimenta, regalos y textos sin cambiar componentes.

- `event.date` y `event.endDate`: fechas ISO con zona horaria, por ejemplo `2027-05-15T18:00:00-06:00`. La cuenta regresiva y el calendario usan estas fechas. Actualiza también `dateLabel`, `shortDate` y los horarios del itinerario: son textos independientes para darte libertad editorial.
- `rsvp.phone`: número real de WhatsApp con código de país, solo dígitos. El número actual es ficticio. `maxGuests` controla las opciones por confirmación; no representa un control de cupo global.
- `venues.items`: reemplaza direcciones y `mapUrl`. La recepción es ficticia; elimina su `note` después de completar los datos.
- `footer.demo`: cambia el aviso de muestra cuando la invitación esté lista.
- Metadatos del navegador: `metadata`.

## Música

La bienvenida ocupa toda la pantalla y mantiene el desplazamiento bloqueado. Al pulsar **Descubre la celebración**, se abre un telón y se muestra la invitación desde el inicio. El audio se solicita directamente en ese clic para funcionar en navegadores móviles. Si falta el MP3 o el navegador no permite reproducirlo, la invitación se abre igualmente y el control flotante permite reintentar. La bienvenida vuelve a aparecer al recargar. Los textos de esta portada están en `entrance` dentro del JSON; `hero.detailsCta` controla el botón del interior.

Pon tu archivo en **`public/music/disco.mp3`**. Ya está configurado en el JSON:

```json
"music": {
  "src": "/music/disco.mp3",
  "enabled": true,
  "volume": 0.35,
  "play": "Poner música",
  "pause": "Pausar música",
  "unavailable": "La música estará disponible pronto."
}
```

Puedes usar otro nombre y actualizar `src`. El navegador requiere una interacción para reproducir audio: se inicia con el botón flotante, se repite en bucle y puede pausarse. Si falta el archivo, se muestra un aviso sin bloquear la invitación. Usa música que tengas permiso de compartir.

## Funciones y límites

- Cuenta regresiva hasta el inicio de la ceremonia.
- Mapas externos y descarga de calendario `.ics`.
- Formulario con nombre, asistencia y personas. Prepara un mensaje en WhatsApp; el invitado debe enviarlo. No se guardan confirmaciones en una base de datos.
- Animaciones de esfera, destellos y apertura; navegación con teclado y soporte de movimiento reducido.
- Fuentes Cormorant Garamond y DM Sans desde Google Fonts, con alternativas locales si no hay conexión.

## Plan del proyecto

1. **Dirección visual.** Negro vinilo `#090909`, superficie `#10100F`, dorado champaña `#CFAD70`, marfil `#F0E7D6`, gris cálido `#A6A097`. Cormorant Garamond para títulos y DM Sans para información. Composición central tipo invitación, esfera dorada como único gran gesto visual. Adaptar el recuerdo setentero con espacio, contraste y legibilidad actuales.
2. **Contenido configurable.** Un JSON para todos los textos y datos, incluidos música, confirmación y metadatos.
3. **Recorrido.** Portada → cuenta regresiva → bienvenida y familia → ubicaciones → itinerario → vestimenta y regalos → confirmación → despedida. En escritorio, sedes y detalles en dos columnas; en móvil, una sola columna.
4. **Interacción.** Animación de la esfera y destellos, música voluntaria, calendario descargable y confirmación por WhatsApp.
5. **Entrega.** Verificar compilación, TypeScript, comportamiento en móvil y formularios. Sustituir datos de muestra y agregar MP3 antes de publicar.

La referencia se adapta con negro y oro, brillo de mosaicos y elegancia nocturna. Se evita convertir el tema disco en una interfaz multicolor: la esfera concentra la animación y el resto prioriza el contenido.
