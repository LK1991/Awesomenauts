<?php
	//  Requiring this file.
	require_once(__DIR__ . "/../model/config.php");

	$array = array(
		'exp'=> '',
		'exp1'=> '',
		'exp2'=> '',
		'exp3'=> '',
		'exp4'=> '',
	);

	// The FILTER_SANITIZE_STRING strips or encodes unwanted characters.
	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
	// This is selecting the salt and the password from the users database in the username column.
	$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username'");

	// Fetch a result row as an associative array, a numeric array, or both.
	if($query->num_rows == 1) {
		$row = $query->fetch_array();

		if($row["password"] === crypt($password, $row["salt"])) {
			$_SESSION["authenticated"] = true;
			$array["exp"] = $row["exp"];
			$array["exp1"] = $row["exp1"];
			$array["exp2"] = $row["exp2"];
			$array["exp3"] = $row["exp3"];
			$array["exp4"] = $row["exp4"];
			$_SESSION["name"] = $username;
			echo json_encode($array);
		}
		else {
			echo "Invalid username and password";
		}
	}
	else {
		echo "Invalid username and password";
	}
