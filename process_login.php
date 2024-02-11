<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $password = $_POST["password"];

    // Read user details from the stored file
    $file = fopen("user_details.txt", "r");
    $validLogin = false;

    if ($file) {
        while (($line = fgets($file)) !== false) {
            $parts = explode(": ", $line);
            if (count($parts) === 2) {
                $key = trim($parts[0]);
                $value = trim($parts[1]);

                if ($key === "Name" && $value === $name) {
                    // Matched username, now check password
                    $nextLine = fgets($file);
                    $passwordLine = explode(": ", $nextLine);
                    $storedPassword = trim($passwordLine[1]);
                    if (password_verify($password, $storedPassword)) {
                        $validLogin = true;
                        break;
                    }
                }
            }
        }
        fclose($file);
    }

    if ($validLogin) {
        echo "Login successful!";
    } else {
        echo "Login failed. Please check your credentials.";
    }
}
?>
