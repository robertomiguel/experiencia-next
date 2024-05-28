# docker
postgres:15.7


# prisma
npx prima init

crear modelo en ./prisma/schema.prisma

ejecutar migración

npx prima migrate dev

npx prima generate

acualizaciones del schema con
npx prisma migrate dev --name nombre_del_cambio

Variables de entorno para ejecutar el protecto:
## Ruta base del proyecto
BASE_URL=

## wikipedia api
WIKI_API_URL=

## IA Api
IMAGE_API_KEY=
IMAGE_API_URL=
IMAGE_API_AUTH=
IMAGE_API_GET_URL=

## database Prisma
DATABASE_URL=

## revalidation security
REVALIDATION_KEY=

## secret
JWT_SECRET=

## pass temporal de inicio
PASSWORD=

## IA proxy
PROXY_IMAGE_API_URL=
PROXY_IMAGE_APP_URL=
PROXY_IMAGE_HOST_URL=

## cloudinary
IMAGE_CLOUD_NAME=
IMAGE_CLOUD_API_KEY=
IMAGE_CLOUD_API_SECRET=
IMAGE_CLOUD_UPLOAD_PRESET=
IMAGE_CLOUD_FOLDER=
