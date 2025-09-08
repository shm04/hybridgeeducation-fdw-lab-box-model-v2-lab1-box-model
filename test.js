/*
Archivo para evaluar automáticamente la tarea.
No modificar este archivo.
*/

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const filePath = `file://${process.cwd()}/index.html`;

  // Verificar que el archivo estilos.css existe
  if (!fs.existsSync(path.join(process.cwd(), 'estilos.css'))) {
    console.error('ERROR: El archivo estilos.css no existe.');
    process.exit(1);
  }

  // Abrir la página
  await page.goto(filePath);

  // Verificar que la hoja de estilos externa se ha importado
  const linkElement = await page.$('link[rel="stylesheet"][href="estilos.css"]');
  if (!linkElement) {
    console.error('ERROR: La hoja de estilos externa estilos.css no se ha importado correctamente en index.html.');
    process.exit(1);
  }

  // Verificar la existencia del <div> con la clase .mi-div
  const div = await page.$('.mi-div');
  if (!div) {
    console.error('ERROR: No se encontró el <div> con la clase .mi-div');
    process.exit(1);
  }

  // Obtener los estilos del <div>
  const divStyles = await page.evaluate(div => {
    const styles = window.getComputedStyle(div);
    return {
      width: styles.width,
      height: styles.height,
      padding: styles.padding,
      margin: styles.margin,
      border: styles.border
    };
  }, div);

  // Estilos esperados
  const expectedStyles = {
    width: '300px',
    height: '200px',
    padding: '20px',
    margin: '30px',
    border: '10px solid rgb(0, 0, 255)' // azul en RGB
  };

  // Verificar que los estilos coinciden
  for (let [key, value] of Object.entries(expectedStyles)) {
    if (divStyles[key] !== value) {
      console.error(`ERROR: El estilo ${key} es ${divStyles[key]}, pero debería ser ${value}`);
      process.exit(1);
    }
  }

  console.log('Todas las pruebas pasaron exitosamente.');
  await browser.close();
})();
