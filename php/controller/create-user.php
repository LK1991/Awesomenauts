<?php
	require_once(__DIR__ . "/../model/config.php");

	// The FILTER_SANITIZE_STRING strips or encodes unwanted characters.
	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

	// The salt variable restricts you from having a weak password.
	$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";
	
	// Without hashing, any passwords that are stored in your application's database can be stolen.
	$hashedPassword = crypt($password, $salt);

	// Inserting a post.
	$query = $_SESSION["connection"]->query("INSERT INTO users SET "
		. "username = '$username',"
		. "password = '$hashedPassword',"
		. "salt = '$salt', "
		. "exp = 0, "
		. "exp1 = 0, "
		. "exp2 = 0, "
		. "exp3 = 0, "
		. "exp4 = 0");

	$_SESSION["name"] = $username;

	if($query) {
		// Need this for Ajax on index.php
		echo "true";
	}
	else {
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}