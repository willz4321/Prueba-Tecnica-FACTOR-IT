# PRUEBA TÉCNICA

**Importante:** La prueba está dividida en 2 carpetas: **Cliente** (Carrito-web) y **Servidor** (carrito-api).

## FRONTEND

Se desarrolló con **React.js** y el empaquetador **Rspack**. Se implementó **Redux** para el manejo del estado global de la aplicación y **react-router-dom** para manejar el enrutamiento en el carrito, permitiendo la navegación entre diferentes vistas. También se utilizó la biblioteca de componentes **shadcn/ui** en algunas partes, como el carrito desplegable.

Para las solicitudes al servidor se usó **axios** para obtener las compras, los clientes, los productos, y demás, que son luego almacenados en el reducer de la aplicación para evitar hacer peticiones GET cada vez que se solicita un dato.

La aplicación cuenta con 5 páginas:

1. **Página de Inicio:** Muestra todos los productos y, en la parte superior, el navbar para filtrar por productos. El navbar, además de contar con los filtros, tiene un botón para ver el carrito con todos los productos añadidos y un botón de enlace para redirigir a la página de clientes. Cuando se ingresa a la página, aparecen alertas solicitando un número de DNI. En caso de haber comprado anteriormente y poseer los requisitos para ser VIP, se adjuntará un descuento de cliente VIP al comprar 10 unidades o más. En caso de que sea día de promoción, saldrá una alerta indicando si se desea aceptar el beneficio.

2. **Página de Clientes:** Muestra todos los clientes en la base de datos con algunos datos como el nombre, tipo y DNI. Tiene un filtro que permite visualizar por tipo de cliente y su antigüedad con dicho tipo.

   **Importante:** Para visualizar la información de los usuarios, es conveniente tener un sistema de permisos con login para acceder a la información de clientes, de manera que se mantenga privada. Sin embargo, como no se estipuló esta condición en los requisitos del problema, se omitió. Esto se podría implementar con **Spring Security** para autenticación y autorización, permitiendo que ciertos usuarios tengan acceso a diferentes secciones o datos de la aplicación. No se incluyó porque no se requirió en este caso.

3. **Página de Detalles de Producto:** Muestra información del producto y permite seleccionar el talle y la cantidad.

4. **Página de Lista de Carrito:** Muestra el carrito con los productos y, a la derecha, el total a pagar, y si cumple las condiciones de promoción.

5. **Página de Datos de Pedido:** Esta página almacena la información del pedido al ingresar el DNI. Si el cliente figura en la base de datos y es cliente VIP, se le aplicará el descuento para 10 productos.

6. **Cierre:** La última página es para procesar el pedido o anularlo. En cualquiera de los casos, redirige a la página principal y muestra una notificación dependiendo del caso.

## BACKEND

Se desarrolló con **Spring Boot 3** usando la versión 21 de **Java**, con base de datos **PostgreSQL**.

- **Endpoint:** Se utilizó **Spring MVC** para la API REST y se habilitó **Swagger** para probar la API RESTful.

- **Base de Datos:** Se utiliza **Spring Data JPA** para el mapeo y el acceso a datos. En la carpeta **Dao** se crean las interfaces con **CrudRepository** para la implementación de operaciones CRUD. Posteriormente, en la carpeta **Service** se crean las clases de servicio para cada entidad, para realizar operaciones sobre los datos y coordinar entre diferentes componentes de la aplicación.

- **SchedulingConfig:** En la carpeta **config** se implementó la clase **SchedulingConfig** para tareas programadas, en este caso para verificar si un cliente sigue siendo VIP o no y actualizar dichos datos.

- **UnitTest:** Se implementan diferentes clases en la carpeta **test** para realizar las pruebas unitarias con **JUnit** y **Mockito**.


- **SCRIP PARA BASE DE DATOS**

**Productos**: 
-- Inserción de datos en la tabla productos
INSERT INTO public.productos(
    id, descripcion, imagen, nombre, precio, talle, tipo, talles, fecha_comun, fecha_vip
) VALUES
    (DEFAULT, 'Abrigo 1', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451028/carrito/oyyvslpdr6jbwmkamw5x.jpg', 'Buzo Negro', 1500.00, 2, 'N/A', '{10,11,12}', NULL, NULL),
    (DEFAULT, 'Abrigo 2', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451029/carrito/glqjo3fffa1ey9s9cglc.jpg', 'Campera Beige', 1600.00, 2, 'N/A', '{10,11,12}', NULL, NULL),
    (DEFAULT, 'Abrigo 3', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451030/carrito/wg5h5sdyym5zuxgmwpzg.png', 'Buzo de algodon', 1700.00, 2, 'N/A', '{10,11,12}', NULL, NULL),
    (DEFAULT, 'Camisa 1', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451060/carrito/xjqhbipewkvmxvn9ieab.jpg', 'Camisa de algodón', 300.00, 1, 'N/A', '{0,1,2,3,4}', NULL, NULL),
    (DEFAULT, 'Camisa 2', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451060/carrito/qyess4sjgb2cwvoqjtgk.jpg', 'Remera de algodon lila', 350.00, 1, 'N/A', '{0,1,2,3,4}', NULL, NULL),
    (DEFAULT, 'Camisa 3', 'https://res.cloudinary.com/drd90e66k/image/upload/v1726451060/carrito/gbdg1blspuvhrxppn0sj.jpg', 'Remera de algodon negra', 400.00, 1, 'N/A', '{0,1,2,3,4}', NULL, NULL);

**Promociones**: 
-- Inserción de datos en la tabla promociones
INSERT INTO public.promociones(
    id, fecha
) VALUES
    (DEFAULT, '2024-09-01'), -- Promoción 1: Fecha de inicio de la promoción
    (DEFAULT, '2024-10-01'), -- Promoción 2: Fecha de inicio de la promoción
    (DEFAULT, '2024-11-01'); -- Promoción 3: Fecha de inicio de la promoción


**Clientes** No es necesario insertar clientes ya que se crean automáticamente al completar una venta, registrando sus datos y actualizando información de ser
necesario 