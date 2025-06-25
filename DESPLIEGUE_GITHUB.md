# 🚀 Guía de Despliegue en GitHub Pages

## 1. Preparar el Repositorio

\`\`\`bash
# Crear repositorio en GitHub
# Nombre sugerido: lab-access-system

# Clonar y configurar
git clone https://github.com/tu-usuario/lab-access-system.git
cd lab-access-system

# Instalar dependencias
npm install
\`\`\`

## 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** > **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `gh-pages` (se creará automáticamente)
5. **Folder**: `/ (root)`

## 3. Configurar Secrets

En **Settings** > **Secrets and variables** > **Actions**:

\`\`\`
GOOGLE_CLIENT_ID: tu-client-id.apps.googleusercontent.com
GOOGLE_API_KEY: tu-api-key
ADMIN_EMAIL: admin@correounivalle.edu.co
\`\`\`

## 4. Actualizar next.config.mjs

Reemplaza `tu-usuario` con tu nombre de usuario de GitHub:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lab-access-system' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/lab-access-system' : '',
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://tu-usuario.github.io/lab-access-system' 
      : 'http://localhost:3000'
  }
}

export default nextConfig
\`\`\`

## 5. Desplegar

\`\`\`bash
# Hacer commit y push
git add .
git commit -m "Initial commit - Lab Access System"
git push origin main

# El GitHub Action se ejecutará automáticamente
# Verifica en la pestaña "Actions" del repositorio
\`\`\`

## 6. Verificar Despliegue

1. Ve a `https://tu-usuario.github.io/lab-access-system`
2. Verifica que todas las páginas cargan correctamente
3. Prueba la autenticación con Google (después de configurar las APIs)

## 7. URL Final

Tu aplicación estará disponible en:
\`\`\`
https://tu-usuario.github.io/lab-access-system
\`\`\`

## 8. Comandos Útiles

\`\`\`bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Despliegue manual (si es necesario)
npm run deploy
\`\`\`

## ⚠️ Importante

- Asegúrate de que el nombre del repositorio sea exactamente `lab-access-system`
- Si usas un nombre diferente, actualiza `basePath` y `assetPrefix` en `next.config.mjs`
- GitHub Pages puede tardar unos minutos en actualizar después del despliegue
