FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
# Permisos para el ejecutable de Maven
RUN chmod +x mvnw
# Construcción
RUN ./mvnw clean package -DskipTests
# Ejecución (revisa que el nombre del .jar sea el correcto en tu carpeta target)
ENTRYPOINT ["java", "-jar", "target/tienda_zapas-0.0.1-SNAPSHOT.jar"]