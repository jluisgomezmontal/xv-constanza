# Una noche para brillar · Invitación de XV

Invitación en español creada con Next.js (App Router), React y TypeScript. Diseño adaptable a móvil, blanco perla y plata, esfera disco dibujada en SVG y animaciones CSS que respetan la preferencia de movimiento reducido.

## Iniciar

```sh
npm install
npm run dev
```

Abre http://localhost:3000. Para producción: `npm run build` y `npm start`.

## Personalizar

Todos los datos y textos visibles están en **`src/data/invitation.json`**. Edita nombre, familia, fechas, sedes, enlaces a mapas, itinerario, vestimenta, regalos y textos sin cambiar componentes.

- `event.date` y `event.endDate`: fechas ISO con zona horaria, por ejemplo `2026-12-26T17:00:00-06:00`. La cuenta regresiva y el calendario usan estas fechas. Actualiza también `dateLabel`, `shortDate` y los horarios del itinerario: son textos independientes para darte libertad editorial.
- `venues.items`: reemplaza direcciones y `mapUrl`.
- `footer.demo`: texto opcional del pie de página. Vacío para ocultarlo.
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
  "unavailable": "No pudimos iniciar la música. Pulsa «Poner música» para intentarlo de nuevo."
}
```

Puedes usar otro nombre y actualizar `src`. El navegador requiere una interacción para reproducir audio: se inicia con el botón flotante, se repite en bucle y puede pausarse. Si falta el archivo, se muestra un aviso sin bloquear la invitación. Usa música que tengas permiso de compartir.

## Funciones y límites

- Cuenta regresiva hasta el inicio de la ceremonia.
- Mapas externos y descarga de calendario `.ics`.
- Lluvia de sobres con una animación breve al llegar a la sección de regalos.
- Animaciones de esfera, destellos y apertura; navegación con teclado y soporte de movimiento reducido.
- Fuentes Cormorant Garamond y DM Sans desde Google Fonts, con alternativas locales si no hay conexión.

## Plan del proyecto

1. **Dirección visual.** Blanco perla `#F8F8FA`, blanco `#FFFFFF`, grafito `#252631` y plata. Cormorant Garamond para títulos y DM Sans para información. Composición central tipo invitación, esfera plateada como único gran gesto visual. Adaptar el recuerdo setentero con espacio, contraste y legibilidad actuales.
2. **Contenido configurable.** Un JSON para todos los textos y datos, incluidos música, calendario y metadatos.
3. **Recorrido.** Portada → cuenta regresiva → bienvenida y familia → ubicaciones → itinerario → vestimenta y regalos → despedida. En escritorio, sedes y detalles en dos columnas; en móvil, una sola columna.
4. **Interacción.** Animación de la esfera y destellos, música voluntaria, calendario descargable.
5. **Entrega.** Verificar compilación, TypeScript, comportamiento en móvil y formularios. Verificar los datos del evento antes de publicar.

La referencia se adapta con blanco y plata, brillo de mosaicos y tipografía elegante. Se evita convertir el tema disco en una interfaz multicolor: la esfera concentra la animación y el resto prioriza el contenido.
