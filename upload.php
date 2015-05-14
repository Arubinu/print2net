<?php
header( 'Content-type: application/json' );

$path = 'uploads/';
$max_size = 2000 * 1024; // max file size ( 2000 Ko )
$valid_exts = array( 'gif', 'jpeg', 'jpg', 'png', 'pdf' );
$valid_typs = array( 'image/gif', 'image/jpeg', 'image/png', 'application/pdf' );

$code = false;
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'POST' )
{
	if( @is_uploaded_file( $_FILES[ 'image' ][ 'tmp_name' ] ) )
	{
		$ext = strtolower( pathinfo( $_FILES[ 'image' ][ 'name' ], PATHINFO_EXTENSION ) );

		if ( in_array( $ext, $valid_exts) AND $_FILES[ 'image' ][ 'size' ] < $max_size )
		{
			$tmp = strrev( uniqid( '' ) );
			$path = $path.$tmp.'.'.$ext;

			if ( move_uploaded_file( $_FILES[ 'image' ][ 'tmp_name' ], $path ) )
			{
				$code = $tmp;
				$status = 'Image envoyé avec succès!';
			}
			else
				$status = '&Eacute;chec d\'envoi: une erreur inconnu est survenue!';
		}
		else
			$status = '&Eacute;chec d\'envoi: fichier non supporté ou trop volumineux!';
	}
	else
		$status = '&Eacute;chec d\'envoi: le fichier n\'a pas été reçu!';
}
else
	$status = 'Mauvaise requête!';

$return = array( 'code' => $code, 'status' => $status );
if ( !function_exists( 'json_decode' ) )
{
	require_once( 'json.php' );

	$json = new Services_JSON();
	echo $json->encode( $return );
}
else
	echo json_encode( $return );
?>
