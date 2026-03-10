# Usamos una imagen de Java 17
FROM eclipse-temurin:17-jdk-alpine
# Directorio de trabajo
WORKDIR /app
# Copiamos el contenido del proyecto
COPY . .
# Construimos el proyecto (saltando tests para ir rápido)
RUN ./mvnw clean package -DskipTests
# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "target/tienda_zapas-0.0.1-SNAPSHOT.jar"]