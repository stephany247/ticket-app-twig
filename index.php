<?php
require_once 'vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false
]);

// Simple routing based on query parameter
$page = $_GET['page'] ?? 'landing';

if ($page === 'landing') {
    echo $twig->render('landing.html.twig');
} elseif ($page === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Fake login logic (for now)
        $username = $_POST['username'];
        $password = $_POST['password'];

        if ($username === 'admin' && $password === 'password') {
            // Redirect to landing after login
            header("Location: index.php");
            exit;
        } else {
            echo $twig->render('login.html.twig', ['error' => 'Invalid credentials']);
            exit;
        }
    }
    echo $twig->render('login.html.twig');
} elseif ($page === 'register') {
    // Fake logout (destroy session if you implement one)
    echo $twig->render('register.html.twig');
} else {
    echo $twig->render('landing.html.twig');
}
