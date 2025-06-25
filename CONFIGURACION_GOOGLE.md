# 🔧 Configuración de Google API - Paso a Paso

## 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto:
   - Nombre: "Sistema Laboratorios Universidad del Valle"
   - ID del proyecto: `lab-system-univalle` (o similar)

## 2. Habilitar APIs Necesarias

En el proyecto creado, ve a "APIs y servicios" > "Biblioteca" y habilita:

### APIs Requeridas:
- ✅ **Google Calendar API**
- ✅ **Google+ API** (para OAuth)
- ✅ **People API** (para información del perfil)

## 3. Configurar OAuth 2.0

### Pantalla de Consentimiento OAuth:
1. Ve a "APIs y servicios" > "Pantalla de consentimiento OAuth"
2. Selecciona **"Externo"** (para permitir correos @correounivalle.edu.co)
3. Completa la información:
   \`\`\`
   Nombre de la aplicación: Sistema de Laboratorios
   Correo de soporte: tu-email@correounivalle.edu.co
   Dominio autorizado: tu-usuario.github.io
   \`\`\`

### Crear Credenciales OAuth:
1. Ve a "APIs y servicios" > "Credenciales"
2. Clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
3. Tipo de aplicación: **"Aplicación web"**
4. Configurar:
   \`\`\`
   Nombre: Lab System Client
   
   Orígenes de JavaScript autorizados:
   - https://tu-usuario.github.io
   - http://localhost:3000 (para desarrollo)
   
   URIs de redirección autorizados:
   - https://tu-usuario.github.io/lab-access-system
   - https://tu-usuario.github.io/lab-access-system/
   - http://localhost:3000 (para desarrollo)
   \`\`\`

## 4. Crear API Key

1. En "Credenciales", clic en "Crear credenciales" > "Clave de API"
2. **Importante**: Restringir la clave:
   - Restricciones de aplicación: "Referentes HTTP"
   - Referentes de sitios web:
     \`\`\`
     https://tu-usuario.github.io/*
     http://localhost:3000/* (para desarrollo)
     \`\`\`
   - Restricciones de API: Seleccionar solo "Google Calendar API"

## 5. Configurar Variables de Entorno

### Para GitHub (Secrets):
\`\`\`
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_API_KEY=tu-api-key
ADMIN_EMAIL=admin@correounivalle.edu.co
\`\`\`

### Para desarrollo local (.env.local):
\`\`\`
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_API_KEY=tu-api-key
NEXT_PUBLIC_ADMIN_EMAIL=admin@correounivalle.edu.co
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

## 6. Configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Settings > Secrets and variables > Actions
3. Agregar los siguientes secrets:
   \`\`\`
   GOOGLE_CLIENT_ID: [tu-client-id]
   GOOGLE_API_KEY: [tu-api-key]
   ADMIN_EMAIL: admin@correounivalle.edu.co
   \`\`\`

## 7. Verificar Configuración

### Checklist antes del despliegue:
- [ ] Proyecto creado en Google Cloud
- [ ] APIs habilitadas (Calendar, Google+, People)
- [ ] Pantalla de consentimiento configurada
- [ ] Cliente OAuth creado con dominios correctos
- [ ] API Key creada y restringida
- [ ] Secrets configurados en GitHub
- [ ] Dominio de GitHub Pages agregado a orígenes autorizados

## 8. Dominios que debes autorizar

Reemplaza `tu-usuario` con tu nombre de usuario de GitHub:

\`\`\`
Orígenes JavaScript autorizados:
- https://tu-usuario.github.io

URIs de redirección:
- https://tu-usuario.github.io/lab-access-system
- https://tu-usuario.github.io/lab-access-system/

Referentes para API Key:
- https://tu-usuario.github.io/*
\`\`\`

## 9. Ejemplo de configuración completa

Si tu usuario de GitHub es `juanperez`, los dominios serían:
\`\`\`
https://juanperez.github.io
https://juanperez.github.io/lab-access-system
\`\`\`

## ⚠️ Notas Importantes

1. **Tiempo de propagación**: Los cambios pueden tardar hasta 5 minutos en aplicarse
2. **Verificación de dominio**: Google puede requerir verificar la propiedad del dominio
3. **Límites de cuota**: La API tiene límites diarios, pero son suficientes para uso universitario
4. **Correos autorizados**: Solo funcionará con @correounivalle.edu.co

## 🔧 Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verificar que el dominio esté exactamente como está configurado en GitHub Pages
- Asegurar que incluyes tanto la versión con `/` al final como sin ella

### Error: "origin_mismatch"
- Verificar los orígenes JavaScript autorizados
- Asegurar que el protocolo sea HTTPS en producción

### Error: "API key not valid"
- Verificar que la API Key tenga las restricciones correctas
- Asegurar que Google Calendar API esté habilitada
