<?php
$host = 'localhost'; 
$username = 'root'; 
$password = ''; 
$database = 'bingo'; 

// Create a database connection
$connection = mysqli_connect($host, $username, $password, $database);

// Check if the connection was successful
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
?>