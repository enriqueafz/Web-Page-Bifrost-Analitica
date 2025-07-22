// Este archivo actúa como un intermediario seguro (proxy).
// Se ejecuta en el servidor, no en el navegador del usuario.

export default async function handler(request, response) {
    // 1. Solo permitimos que se nos contacte con el método POST.
    if (request.method !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método no permitido' })
        };
    }

    try {
        // 2. Leemos tu llave secreta desde las "variables de entorno" de tu servidor.
        const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

        if (!accessKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error de configuración del servidor: La llave de API no está definida.' })
            };
        }
        
        // 3. ¡CORRECCIÓN CLAVE!
        // El `request.body` en Netlify es un stream. Necesitamos leerlo para obtener el JSON.
        // Usamos JSON.parse(request.body) directamente. Netlify ya lo procesa por nosotros.
        const requestBody = JSON.parse(request.body);

        // 4. Creamos un nuevo objeto de formulario.
        const formData = new FormData();
        
        // 5. Añadimos la información secreta y fija aquí, en el servidor.
        formData.append('access_key', accessKey);
        formData.append('subject', 'Nueva Solicitud de Consulta - Bifrost Analitica');
        formData.append('from_name', 'Bifrost Analitica Website');

        // 6. Tomamos todos los datos que el usuario llenó en el formulario y los añadimos.
        for (const key in requestBody) {
            formData.append(key, requestBody[key]);
        }

        // 7. Hacemos la llamada a la API de web3forms desde nuestro servidor.
        const apiResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const data = await apiResponse.json();

        // 8. Enviamos la respuesta de web3forms de vuelta a nuestra página web.
        if (data.success) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: '¡Formulario enviado con éxito!' })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: data.message || 'Algo salió mal.' })
            };
        }
    } catch (error) {
        console.error("Error en la función del servidor:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error interno del servidor: ${error.message}` })
        };
    }
}
