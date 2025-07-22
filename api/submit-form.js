// Este archivo actúa como un intermediario seguro (proxy).
// Se ejecuta en el servidor, no en el navegador del usuario.

export default async function handler(request, response) {
    // 1. Solo permitimos que se nos contacte con el método POST.
    // Si alguien intenta acceder de otra forma, lo rechazamos.
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Método no permitido' });
    }

    // 2. ¡LA PARTE MÁS IMPORTANTE!
    // Leemos tu llave secreta desde las "variables de entorno" de tu servidor.
    // NUNCA se escribe directamente en el código.
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    // Si la llave no está configurada en el servidor, detenemos el proceso por seguridad.
    if (!accessKey) {
        return response.status(500).json({ message: 'Error de configuración del servidor: La llave de API no está definida.' });
    }

    // 3. Creamos un nuevo objeto de formulario.
    const formData = new FormData();
    
    // 4. Añadimos la información secreta y fija aquí, en el servidor.
    formData.append('access_key', accessKey);
    formData.append('subject', 'Nueva Solicitud de Consulta - Bifrost Analitica');
    formData.append('from_name', 'Bifrost Analitica Website');

    // 5. Tomamos todos los datos que el usuario llenó en el formulario (nombre, email, etc.)
    // y los añadimos al objeto que enviaremos.
    for (const key in request.body) {
        formData.append(key, request.body[key]);
    }

    try {
        // 6. Hacemos la llamada a la API de web3forms desde nuestro servidor.
        // El navegador del usuario nunca habla directamente con web3forms.
        const apiResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const data = await apiResponse.json();

        // 7. Enviamos la respuesta de web3forms de vuelta a nuestra página web.
        if (data.success) {
            return response.status(200).json({ message: '¡Formulario enviado con éxito!' });
        } else {
            // Si web3forms da un error, se lo comunicamos a la página.
            return response.status(400).json({ message: data.message || 'Algo salió mal.' });
        }
    } catch (error) {
        // Si hay un error de conexión con la API, también lo manejamos.
        return response.status(500).json({ message: 'Error del servidor. Por favor, inténtelo de nuevo más tarde.' });
    }
}
/*

---

### **Paso Final y Crucial: Configurar la Variable de Entorno**

Para que `process.env.WEB3FORMS_ACCESS_KEY` funcione, debes configurar esta variable en tu servicio de hosting (por ejemplo, Vercel o Netlify).

1.  Ve al panel de control de tu proyecto en tu proveedor de hosting.
2.  Busca la sección de **"Settings"** (Configuración) y luego **"Environment Variables"** (Variables de Entorno).
3.  Crea una nueva variable:
    * **Nombre:** `WEB3FORMS_ACCESS_KEY`
    * **Valor:** `b79b8e8c-6658-41dc-ac88-bb23d67c7b33`

Al hacer esto, tu llave de API solo existe en tu servidor, completamente oculta del público. Con los tres archivos (`index.html`, `main.js` y `api/submit-form.js`) funcionando juntos, tu formulario operará de forma segura y correc
*/