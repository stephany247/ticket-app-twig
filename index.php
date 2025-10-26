<?php
require_once 'vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false
]);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

//  routing
switch ($path) {
    case '/':
        echo $twig->render('landing.html.twig');
        break;

    case '/auth/login':
        echo $twig->render('login.html.twig');
        break;

    case '/auth/register':
        echo $twig->render('register.html.twig');
        break;

    case '/dashboard':
        echo $twig->render('dashboard.html.twig');
        break;

    case '/tickets':
        echo $twig->render('tickets.html.twig');
        break;

    default:
        echo $twig->render('landing.html.twig');
        break;
}
