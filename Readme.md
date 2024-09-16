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
