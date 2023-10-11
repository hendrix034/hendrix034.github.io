<?php
include('db_config.php');

if (isset($_POST['winData'])) {
    $winData = $_POST['winData'];

    // Get the current date and time
    $currentDate = date('Y-m-d H:i:s'); // Adjust the format as needed

    // Insert the current date into the database
    $sql = "INSERT INTO winner_list (date, name) VALUES ('$currentDate','$winData')";

    if (mysqli_query($connection, $sql)) {
        echo 'Success'; // Or a JSON response indicating success
    } else {
        echo 'Error'; // Or a JSON response indicating an error
    }
}
?>