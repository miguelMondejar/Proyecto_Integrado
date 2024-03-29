<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>FCT Gestion App</title>

        <!-- Icono-->
        <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />

        <!-- Bootstrap icons-->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" type="text/css" />

        <!-- Google fonts-->
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css" />

        <!-- CSS (incluido Bootstrap)-->
        <link href="css/styles.css" rel="stylesheet">
        <link href="css/forms.css" rel="stylesheet">

        <!-- Scripts JS -->
        <script src="js/form.js"></script>
        <script src="js/validaciones.js"></script>
        <script src="js/appAPI.js"></script>
        <script src="js/usuarios_llamadasAPI.js"></script>
    </head>
    <body>
        <!-- Navigation-->
        <nav class="navbar navbar-light bg-light static-top">
            <div class="container">
                <a class="navbar-brand" href="#!">FCT GESTION APP</a>
                <a class="btn btn-primary" href="http://127.0.0.1:8000/login">Inicio sesión</a>
            </div>
        </nav>
        
        <!-- Masthead-->
        <header class="masthead">
            <div class="container position-relative">
                <div class="row justify-content-center">
                    <div class="col-xl-6">
                        <div class="text-center text-white">
                            <!-- Page heading-->
                            <h1 class="mb-5">FCT GESTION APP</h1>
                            <p class="lead mb-0">Inicia sesión y gestiona facilmente</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- Icons Grid-->
        <section class="features-icons bg-light text-center">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div class="features-icons-icon d-flex"><i class="bi-window m-auto text-primary"></i></div>
                            <h3>Web Responsiva</h3>
                            <p class="lead mb-0">Gestiona desde cualquier dispositivo.</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div class="features-icons-icon d-flex"><i class="bi-layers m-auto text-primary"></i></div>
                            <h3>Bootstrap 5 Ready</h3>
                            <p class="lead mb-0">¡Presentando la última versión del nuevo framework Bootstrap 5!</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="features-icons-item mx-auto mb-0 mb-lg-3">
                            <div class="features-icons-icon d-flex"><i class="bi-terminal m-auto text-primary"></i></div>
                            <h3>Fácil de usar</h3>
                            <p class="lead mb-0">Gestionar tu FCT será muy fácil, nuestra web es muy intuitiva</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Image Showcases-->
        <section class="showcase">
            <div class="container-fluid p-0">
                <div class="row g-0">
                    <div class="col-lg-6 order-lg-2 text-white showcase-img" style="background-image: url('assets/img/alumnosfp.webp')"></div>
                    <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                        <h2>Alumnos</h2>
                        <p class="lead mb-0">Los alumnos podrán gestionar su perfil y subir su CV fácilmente. En todo momento sabrán el estado de su candidatura.</p>
                    </div>
                </div>
                <div class="row g-0">
                    <div class="col-lg-6 text-white showcase-img" style="background-image: url('assets/img/profesor.jpg')"></div>
                    <div class="col-lg-6 my-auto showcase-text">
                        <h2>Profesores</h2>
                        <p class="lead mb-0">Los profesores podrán gestionar fácilmente la FCT de los alumnos. Nuestra web es muy intuitiva.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Footer-->
        <footer class="footer bg-dark">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 h-100 text-center text-lg-start my-auto">
                        <ul class="list-inline mb-2">
                            <li class="list-inline-item"><a href="#!">Sobre nosotros</a></li>
                            <li class="list-inline-item">⋅</li>
                            <li class="list-inline-item"><a href="https://github.com/miguelMondejar">Contacto</a></li>
                            <li class="list-inline-item">⋅</li>
                            <li class="list-inline-item"><a href="https://policies.google.com/terms?hl=es">Terminos de uso</a></li>
                            <li class="list-inline-item">⋅</li>
                            <li class="list-inline-item"><a href="https://policies.google.com/privacy?hl=es">Politica de privacidad</a></li>
                        </ul>
                        <p class="text-muted small mb-4 mb-lg-0">&copy; Miguel Mondéjar González · FCT Gestion App 2023 · Todos los derechos reservados.</p>
                    </div>
                    <div class="col-lg-6 h-100 text-center text-lg-end my-auto">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item me-4">
                                <a href="https://www.facebook.com/"><i class="bi-facebook fs-3"></i></a>
                            </li>
                            <li class="list-inline-item me-4">
                                <a href="https://www.twitter.com/"><i class="bi-twitter fs-3"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="https://www.instagram.com/"><i class="bi-instagram fs-3"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

        <!-- Bootstrap core JS-->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Core theme JS-->
        <script src="js/scripts.js"></script>
        <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
        <!-- * *                               SB Forms JS                               * *-->
        <!-- * * Activate your form at https://startbootstrap.com/solution/contact-forms * *-->
        <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
        <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>

        <!-- borrar un posible token-->
        <script>localStorage.removeItem("token")</script>
    </body>
</html>