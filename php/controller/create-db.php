<?php
	// It calls the database.php file and almost everything in it.
	// Fixed the code because everything in database.php moved to config.php
	require_once(__DIR__ . "/../model/config.php");

	// A session is a way to store information in variables to be used across multiple pages.
	// And this echos if it was created successfully.

	// It's making a table post and putting an id in it automatically, a text that can only have 255 characters, and the post is text. None of them can be NULL. And the primary key is id.
	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
		. "id int(11) NOT NULL AUTO_INCREMENT,"
		. "username varchar(30) NOT NULL,"
		. "email varchar(50) NOT NULL,"
		. "password char(128) NOT NULL,"
		. "salt char(128) NOT NULL,"
		. "exp int(4),"
		. "exp1 int(4),"
		. "exp2 int(4),"
		. "exp3 int(4),"
		. "exp4 int(4),"
		. "PRIMARY KEY (id))");
